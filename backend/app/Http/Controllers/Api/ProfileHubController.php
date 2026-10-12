<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\LessonNote;
use App\Models\LessonProgress;
use App\Models\PaymentReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileHubController extends Controller
{
    /**
     * Get aggregated academic profile, stats, certificates, and payment history
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // 1. Enrollments & Course Progress
        $enrollments = Enrollment::with('course:id,title,slug,thumbnail_url,duration_hours')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->get();

        $enrolledCount = $enrollments->count();
        $completedCount = $enrollments->where('progress_percentage', '>=', 100)->count();

        // 2. Completed lessons & study notes count
        $completedLessonsCount = LessonProgress::where('user_id', $user->id)
            ->where('is_completed', true)
            ->count();

        $notesCount = LessonNote::where('user_id', $user->id)->count();

        // 3. Certificates Earned
        $certificates = Certificate::with('course:id,title')
            ->where('user_id', $user->id)
            ->orderBy('issued_at', 'desc')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'certificate_code' => $cert->certificate_code,
                    'course_title' => $cert->course->title ?? 'الدورة التدريبية',
                    'issued_at' => $cert->issued_at->toIso8601String(),
                    'verification_url' => url("/api/v1/certificates/{$cert->certificate_code}"),
                    'download_url' => url("/api/v1/certificates/{$cert->certificate_code}/download"),
                ];
            });

        // 4. Manual Payment Receipts History
        $receipts = PaymentReceipt::with('course:id,title')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($receipt) {
                return [
                    'id' => $receipt->id,
                    'course_title' => $receipt->course->title ?? 'طلب التحاق',
                    'amount' => (float) $receipt->amount,
                    'method' => $receipt->method,
                    'status' => $receipt->status,
                    'transaction_ref' => $receipt->transaction_ref,
                    'admin_note' => $receipt->admin_note,
                    'created_at' => $receipt->created_at->toIso8601String(),
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
            ],
            'certificates' => $certificates,
            'recent_receipts' => $receipts,
            'my_courses' => $enrollments->map(function ($enr) {
                return [
                    'id' => $enr->id,
                    'course_id' => $enr->course_id,
                    'title' => $enr->course->title ?? '',
                    'slug' => $enr->course->slug ?? '',
                    'thumbnail_url' => $enr->course->thumbnail_url ?? null,
                    'progress_percentage' => (int) $enr->progress_percentage,
                ];
            }),
        ]);
    }
}
