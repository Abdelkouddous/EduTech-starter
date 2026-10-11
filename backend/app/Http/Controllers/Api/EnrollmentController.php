<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\InstituteSetting;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function __construct(protected CertificateService $certificateService) {}

    /**
     * Trainee's dashboard of enrolled courses with progress
     */
    public function myCourses(Request $request): JsonResponse
    {
        $user = $request->user();

        $enrollments = Enrollment::with([
            'course:id,title,slug,cover_image,category,duration_hours',
            'cohort:id,name,start_date,end_date',
            'certificate',
            'lessonProgress' => fn ($q) => $q->where('is_completed', true),
        ])
        ->where('trainee_id', $user->id)
        ->where('status', 'approved')
        ->latest()
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $enrollments,
        ]);
    }

    /**
     * Mark a lesson as completed and recalculate enrollment progress
     */
    public function toggleLessonComplete(Request $request, int $lessonId): JsonResponse
    {
        $user = $request->user();
        $lesson = Lesson::with('module.course')->findOrFail($lessonId);
        $courseId = $lesson->module->course_id;

        $enrollment = Enrollment::where('trainee_id', $user->id)
            ->where('course_id', $courseId)
            ->where('status', 'approved')
            ->firstOrFail();

        $progress = LessonProgress::firstOrCreate(
            ['enrollment_id' => $enrollment->id, 'lesson_id' => $lessonId],
            ['is_completed' => false]
        );

        $newStatus = ! $progress->is_completed;
        $progress->update([
            'is_completed' => $newStatus,
            'completed_at' => $newStatus ? now() : null,
        ]);

        $enrollment->recalculateProgress();

        // Check if certificate should be issued
        $autoIssue = (bool) InstituteSetting::get('auto_issue_certificates', true);
        $certificate = null;
        if ($autoIssue && $enrollment->progress_percent >= 100) {
            $certificate = $this->certificateService->issueCertificate($enrollment);
        }

        return response()->json([
            'status' => 'success',
            'message' => $newStatus ? 'تم تسجيل إتمام الدرس' : 'تم إلغاء إتمام الدرس',
            'is_completed' => $newStatus,
            'progress_percent' => $enrollment->progress_percent,
            'certificate' => $certificate,
        ]);
    }

    /**
     * Public certificate verification endpoint
     */
    public function verifyCertificate(string $code): JsonResponse
    {
        $certificate = Certificate::with(['course:id,title,category', 'trainee:id,name'])
            ->where('certificate_code', $code)
            ->first();

        if (! $certificate) {
            return response()->json([
                'status' => 'error',
                'message' => 'الشهادة المطلوبة غير صحيحة أو غير مسجلة في سجلات الأكاديمية.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'is_valid' => true,
            'certificate' => [
                'code' => $certificate->certificate_code,
                'trainee_name' => $certificate->trainee_name,
                'course_title' => $certificate->course_title,
                'issued_date' => $certificate->issued_date->format('Y-m-d'),
                'download_url' => url("/api/v1/certificates/{$code}/download"),
            ],
        ]);
    }

    /**
     * Download certificate PDF
     */
    public function downloadCertificate(string $code)
    {
        $certificate = Certificate::where('certificate_code', $code)->firstOrFail();
        $pdf = $this->certificateService->generatePdf($certificate);

        return $pdf->download("certificate-{$code}.pdf");
    }
}
