<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\ConsultationBooking;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\LessonNote;
use App\Models\LessonProgress;
use App\Models\PaymentReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileHubController extends Controller
{
    /**
     * Get aggregated academic profile, stats, certificates, consultations, and payment history (A5)
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // 1. Enrollments & Course Progress
        $enrollments = Enrollment::with('course:id,title,slug,cover_image,duration_hours')
            ->where('trainee_id', $user->id)
            ->whereIn('status', ['approved', 'completed'])
            ->get();

        $enrolledCount = $enrollments->count();
        $completedCount = $enrollments->where('progress_percent', '>=', 100)->count();

        // 2. Completed lessons & study notes count
        $completedLessonsCount = LessonProgress::whereHas('enrollment', function ($q) use ($user) {
            $q->where('trainee_id', $user->id);
        })->where('is_completed', true)->count();

        $notesCount = LessonNote::where('user_id', $user->id)->count();

        // 3. Certificates Earned
        $certificates = Certificate::with('course:id,title')
            ->where('trainee_id', $user->id)
            ->latest('issued_date')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'certificate_code' => $cert->certificate_code,
                    'course_title' => $cert->course->title ?? 'Formation Académique',
                    'issued_date' => $cert->issued_date ? $cert->issued_date->format('Y-m-d') : null,
                    'verification_url' => url("/api/v1/certificates/{$cert->certificate_code}"),
                    'download_url' => url("/api/v1/certificates/{$cert->certificate_code}/download"),
                ];
            });

        // 4. Payment Receipts History
        $receipts = PaymentReceipt::with('course:id,title')
            ->where('trainee_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($receipt) {
                return [
                    'id' => $receipt->id,
                    'course_title' => $receipt->course->title ?? 'Paiement Formation / استشارة',
                    'amount' => (float) $receipt->amount,
                    'method' => $receipt->method,
                    'status' => $receipt->status,
                    'transaction_ref' => $receipt->transaction_ref,
                    'created_at' => $receipt->created_at->toIso8601String(),
                ];
            });

        // 5. Consultations Booked (K1, K2, A5)
        $consultations = ConsultationBooking::with(['consultationType.specialist:id,name,avatar', 'slot'])
            ->where('trainee_id', $user->id)
            ->latest('booked_at')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'booking_code' => $b->booking_code,
                    'title' => $b->consultationType->title ?? 'Consultation Spécialisée',
                    'specialist' => $b->consultationType->specialist->name ?? 'Expert Académique',
                    'start_time' => $b->slot->start_time ? $b->slot->start_time->toIso8601String() : null,
                    'status' => $b->status,
                    'meeting_url' => $b->meeting_url,
                ];
            });

        // 6. Invoices (P7)
        $invoices = Invoice::where('trainee_id', $user->id)
            ->latest('issued_at')
            ->get()
            ->map(function ($inv) {
                return [
                    'id' => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'item_title' => $inv->item_title,
                    'amount' => (float) $inv->amount,
                    'currency' => $inv->currency,
                    'payment_method' => $inv->payment_method,
                    'issued_at' => $inv->issued_at->toIso8601String(),
                    'download_url' => url("/api/v1/invoices/{$inv->id}/download"),
                ];
            });

        return response()->json([
            'status' => 'success',
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?? 'trainee',
                'joined_at' => $user->created_at->toIso8601String(),
            ],
            'stats' => [
                'enrolled_courses' => $enrolledCount,
                'completed_courses' => $completedCount,
                'completed_lessons' => $completedLessonsCount,
                'study_notes_count' => $notesCount,
                'certificates_count' => $certificates->count(),
                'consultations_count' => $consultations->count(),
                'invoices_count' => $invoices->count(),
            ],
            'certificates' => $certificates,
            'recent_receipts' => $receipts,
            'consultations' => $consultations,
            'invoices' => $invoices,
            'my_courses' => $enrollments->map(function ($enr) {
                return [
                    'id' => $enr->id,
                    'course_id' => $enr->course_id,
                    'title' => $enr->course->title ?? '',
                    'slug' => $enr->course->slug ?? '',
                    'cover_image' => $enr->course->cover_image ?? null,
                    'progress_percent' => (int) $enr->progress_percent,
                ];
            }),
        ]);
    }
}
