<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AvailabilitySlot;
use App\Models\ConsultationBooking;
use App\Models\ConsultationType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ConsultationController extends Controller
{
    /**
     * List all available consultation types with specialist details (K1)
     */
    public function types(): JsonResponse
    {
        $types = ConsultationType::with(['specialist:id,name,avatar,specialization,bio'])
            ->where('is_active', true)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $types,
        ]);
    }

    /**
     * List available upcoming time slots for a consultation type (K2)
     */
    public function slots(int $typeId): JsonResponse
    {
        $type = ConsultationType::findOrFail($typeId);

        // Fetch unbooked slots where locked_until is null or past
        $slots = AvailabilitySlot::where('consultation_type_id', $type->id)
            ->where('is_booked', false)
            ->where('start_time', '>', now())
            ->where(function ($q) {
                $q->whereNull('locked_until')
                  ->orWhere('locked_until', '<=', now());
            })
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'consultation_type' => $type,
            'data' => $slots,
        ]);
    }

    /**
     * Book a consultation slot with atomic locking (K2, K3, K4)
     */
    public function book(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slot_id' => 'required|exists:availability_slots,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            $slot = AvailabilitySlot::lockForUpdate()->with('consultationType')->findOrFail($validated['slot_id']);

            if (!$slot->isAvailable() || $slot->start_time->isPast()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ce créneau n\'est plus disponible ou déjà réservé / هذا الموعد لم يعد متاحاً أو تم حجزه من قبل متدرب آخر.',
                ], 409);
            }

            // Lock slot and create booking
            $bookingCode = 'CONS-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $meetingUrl = 'https://meet.google.com/edu-' . strtolower(Str::random(4)) . '-' . strtolower(Str::random(3));

            $slot->update([
                'is_booked' => true,
                'locked_until' => null,
            ]);

            $booking = ConsultationBooking::create([
                'booking_code' => $bookingCode,
                'trainee_id' => $user->id,
                'consultation_type_id' => $slot->consultation_type_id,
                'availability_slot_id' => $slot->id,
                'status' => 'confirmed',
                'meeting_url' => $meetingUrl,
                'notes' => $validated['notes'] ?? null,
                'price_paid' => $slot->consultationType->price,
                'booked_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Consultation réservée avec succès ! / تم تأكيد حجز الجلسة الاستشارية بنجاح.',
                'data' => $booking->load(['consultationType.specialist', 'slot']),
            ], 201);
        });
    }

    /**
     * Trainee views their booked consultations list (A5, K1)
     */
    public function myBookings(Request $request): JsonResponse
    {
        $bookings = ConsultationBooking::with([
            'consultationType.specialist:id,name,avatar,specialization',
            'slot',
        ])
        ->where('trainee_id', $request->user()->id)
        ->latest('booked_at')
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    /**
     * Trainee cancels a consultation booking (K6)
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $booking = ConsultationBooking::where('trainee_id', $request->user()->id)->findOrFail($id);

        if ($booking->status === 'cancelled') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette réservation est déjà annulée / تم إلغاء هذا الحجز مسبقاً.',
            ], 422);
        }

        DB::transaction(function () use ($booking, $validated) {
            $booking->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => $validated['reason'] ?? 'Annulé par le stagiaire / تم الإلغاء بواسطة المتدرب',
            ]);

            // Release the availability slot for other students
            $booking->slot()->update([
                'is_booked' => false,
                'locked_until' => null,
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Réservation annulée et créneau libéré avec succès / تم إلغاء الحجز بنجاح.',
            'data' => $booking->fresh(['slot']),
        ]);
    }
}
