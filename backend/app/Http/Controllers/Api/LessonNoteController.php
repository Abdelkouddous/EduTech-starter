<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonNoteController extends Controller
{
    /**
     * Get trainee personal notes for a specific lesson
     */
    public function index(Request $request, int $lessonId): JsonResponse
    {
        $notes = LessonNote::where('user_id', $request->user()->id)
            ->where('lesson_id', $lessonId)
            ->orderBy('timestamp_seconds', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'notes' => $notes,
        ]);
    }

    /**
     * Create a new timestamped study note
     */
    public function store(Request $request, int $lessonId): JsonResponse
    {
        $lesson = Lesson::findOrFail($lessonId);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'timestamp_seconds' => 'nullable|integer|min:0',
        ]);

        $note = LessonNote::create([
            'user_id' => $request->user()->id,
            'lesson_id' => $lesson->id,
            'timestamp_seconds' => $validated['timestamp_seconds'] ?? null,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'تم حفظ الملاحظة الدراسية بنجاح.',
            'note' => $note,
        ], 201);
    }

    /**
     * Delete a personal study note
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $note = LessonNote::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $note->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'تم حذف الملاحظة بنجاح.',
        ]);
    }
}
