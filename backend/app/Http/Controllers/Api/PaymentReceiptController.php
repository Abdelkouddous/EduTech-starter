<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentReceiptController extends Controller
{
    /**
     * Trainee submits a payment receipt for review
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'cohort_id' => 'nullable|exists:cohorts,id',
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string|in:baridimob,ccp,edahabia,satim,cib,instapay,vodafone_cash,fawry,card',
            'sender_account_or_number' => 'required|string|max:100',
            'transaction_ref' => 'nullable|string|max:100',
            'receipt_image' => 'required|image|max:10240', // 10MB max
        ]);

        $user = $request->user();

        // Check if user is already enrolled
        $existingEnrollment = Enrollment::where('trainee_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->where('status', 'approved')
            ->exists();

        if ($existingEnrollment) {
            return response()->json([
                'status' => 'error',
                'message' => 'أنت مسجل بالفعل في هذه الدورة ولديك وصول كامل للمحتوى.',
            ], 422);
        }

        $imagePath = $request->file('receipt_image')->store('receipts', 'public');

        $receipt = PaymentReceipt::create([
            'trainee_id' => $user->id,
            'course_id' => $validated['course_id'],
            'cohort_id' => $validated['cohort_id'] ?? null,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'sender_account_or_number' => $validated['sender_account_or_number'],
            'transaction_ref' => $validated['transaction_ref'] ?? null,
            'receipt_image_path' => $imagePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'تم استلام إيصال الدفع بنجاح وسيتم مراجعته وتفعيل الدورة خلال ساعات قليلة.',
            'data' => $receipt->load(['course:id,title', 'cohort:id,name']),
        ], 201);
    }

    /**
     * Trainee views their submitted receipts
     */
    public function myReceipts(Request $request): JsonResponse
    {
        $receipts = PaymentReceipt::with(['course:id,title,cover_image', 'cohort:id,name'])
            ->where('trainee_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $receipts,
        ]);
    }

    /**
     * Admin lists all receipts with optional status filter
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = PaymentReceipt::with([
            'trainee:id,name,email,phone',
            'course:id,title,price',
            'cohort:id,name',
            'reviewer:id,name',
        ]);

        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        $receipts = $query->latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $receipts,
        ]);
    }

    /**
     * Admin approves or rejects a receipt
     */
    public function review(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
        ]);

        $receipt = PaymentReceipt::with(['course', 'trainee'])->findOrFail($id);

        if ($receipt->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'تمت مراجعة هذا الإيصال مسبقاً ولا يمكن تعديله مجدداً.',
            ], 422);
        }

        DB::transaction(function () use ($receipt, $validated, $request) {
            $receipt->update([
                'status' => $validated['status'],
                'rejection_reason' => $validated['rejection_reason'] ?? null,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            if ($validated['status'] === 'approved') {
                Enrollment::updateOrCreate(
                    [
                        'trainee_id' => $receipt->trainee_id,
                        'course_id' => $receipt->course_id,
                        'cohort_id' => $receipt->cohort_id,
                    ],
                    [
                        'payment_receipt_id' => $receipt->id,
                        'status' => 'approved',
                        'enrolled_at' => now(),
                        'progress_percent' => 0,
                    ]
                );

                // Increment student count on course
                $receipt->course->increment('students_count');

                // Auto-generate official electronic PDF invoice (P7)
                app(\App\Services\InvoiceService::class)->createFromReceipt($receipt);
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => $validated['status'] === 'approved' 
                ? 'تمت الموافقة على الإيصال وتفعيل وصول المتدرب بنجاح.' 
                : 'تم رفض الإيصال وتوثيق سبب الرفض.',
            'data' => $receipt->fresh(['course', 'trainee', 'enrollment']),
        ]);
    }
}
