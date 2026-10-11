<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::with([
            'instructor:id,name,avatar,specialization',
            'cohorts' => fn ($q) => $q->where('is_active', true),
        ])->where('is_published', true);

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $courses = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $courses,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $course = Course::with([
            'instructor:id,name,avatar,bio,specialization',
            'modules.lessons',
            'cohorts' => fn ($q) => $q->where('is_active', true)->with('term'),
            'attachments',
        ])->where('slug', $slug)->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $course,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'full_description' => 'nullable|string',
            'category' => 'required|string',
            'level' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'cover_image' => 'nullable|string',
            'promo_video_url' => 'nullable|string',
            'prerequisites' => 'nullable|array',
            'learning_outcomes' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.rand(100, 999);
        $validated['instructor_id'] = $request->user()->id;

        $course = Course::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'تم إنشاء الدورة بنجاح',
            'data' => $course,
        ], 201);
    }
}
