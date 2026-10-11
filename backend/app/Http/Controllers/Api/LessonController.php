<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Services\Video\VideoManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Secure player endpoint: checks enrollment before releasing video stream
     */
    public function play(Request $request, int $id): JsonResponse
    {
        $lesson = Lesson::with(['module.course.instructor', 'attachments'])->findOrFail($id);
        $course = $lesson->module->course;
        $user = $request->user('sanctum');

        // 1. If it's a free preview lesson, allow access immediately
        if ($lesson->is_free_preview) {
            $payload = VideoManager::getPayloadForLesson($lesson, $user);
            return response()->json([
                'status' => 'success',
                'is_free_preview' => true,
                'lesson' => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'duration' => $lesson->duration,
                    'description' => $lesson->description,
                    'attachments' => $lesson->attachments,
                ],
                'video' => $payload,
            ]);
        }

        // 2. Paid lesson: require authenticated user
        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'هذا الدرس متاح فقط للمشتركين. يرجى تسجيل الدخول والاشتراك في الدورة.',
            ], 401);
        }

        // 3. Authorization check: Student enrolled OR Admin OR Course Instructor
        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'approved')
            ->exists();

        $isStaff = $user->hasRole('admin') || ($user->id === $course->instructor_id);

        if (! $isEnrolled && ! $isStaff) {
            return response()->json([
                'status' => 'error',
                'message' => 'عذراً، يجب إتمام الاشتراك وتأكيد الدفع لمشاهدة هذا الدرس.',
            ], 403);
        }

        // 4. Resolve secure streaming payload (signed URLs or embed)
        $payload = VideoManager::getPayloadForLesson($lesson, $user);

        return response()->json([
            'status' => 'success',
            'is_free_preview' => false,
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'duration' => $lesson->duration,
                'description' => $lesson->description,
                'attachments' => $lesson->attachments,
            ],
            'video' => $payload,
        ]);
    }
}
