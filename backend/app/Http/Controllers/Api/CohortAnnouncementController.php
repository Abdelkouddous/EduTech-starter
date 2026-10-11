<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortAnnouncement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CohortAnnouncementController extends Controller
{
    /**
     * Get announcements for a specific cohort.
     * Enforces authorization: user must be enrolled, course instructor, or admin.
     */
    public function index(Request $request, int $cohortId): JsonResponse
    {
        $cohort = Cohort::with('course')->findOrFail($cohortId);
        $user = $request->user();

        $isEnrolled = $user->enrollments()
            ->where('cohort_id', $cohortId)
            ->where('status', 'approved')
            ->exists();

        $isStaff = $user->hasRole('admin') || ($user->id === $cohort->course->instructor_id);

        if (! $isEnrolled && ! $isStaff) {
            return response()->json([
                'status' => 'error',
                'message' => 'عذراً، يجب أن تكون مسجلاً في هذه الدفعة للوصول إلى لوحة الإعلانات وروابط الجلسات.',
            ], 403);
        }

        $announcements = CohortAnnouncement::with('instructor:id,name,avatar')
            ->where('cohort_id', $cohortId)
            ->orderBy('is_pinned', 'desc')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $announcements,
        ]);
    }

    /**
     * Create an announcement with meeting link (Instructor / Admin only)
     */
    public function store(Request $request, int $cohortId): JsonResponse
    {
        $cohort = Cohort::with('course')->findOrFail($cohortId);
        $user = $request->user();

        if (! $user->hasRole('admin') && $user->id !== $cohort->course->instructor_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'غير مصرح لك بنشر إعلانات لهذه الدفعة.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meeting_url' => 'nullable|url',
            'scheduled_at' => 'nullable|date',
            'is_pinned' => 'nullable|boolean',
        ]);

        $announcement = CohortAnnouncement::create([
            'cohort_id' => $cohortId,
            'instructor_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'meeting_url' => $validated['meeting_url'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'is_pinned' => (bool) ($validated['is_pinned'] ?? false),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'تم نشر الإعلان ورابط الجلسة بنجاح',
            'data' => $announcement->load('instructor:id,name,avatar'),
        ], 201);
    }
}
