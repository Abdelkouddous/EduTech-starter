<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * List courses with dynamic search, category, price and rating filters (C1, C2)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::with([
            'instructor:id,name,avatar,specialization',
            'cohorts' => fn ($q) => $q->where('is_active', true),
        ])->where('is_published', true);

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search in title and description (q or search)
        $search = $request->get('q', $request->get('search'));
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Price range filtering
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->price_max);
        }

        // Minimum rating filter
        if ($request->filled('rating')) {
            $query->where('rating', '>=', (float) $request->rating);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'rating_desc' => $query->orderBy('rating', 'desc'),
            default => $query->latest(),
        };

        $courses = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $courses,
        ]);
    }

    /**
     * Get single course details with syllabus and reviews summary (C3)
     */
    public function show(string $slug): JsonResponse
    {
        $course = Course::with([
            'instructor:id,name,avatar,bio,specialization',
            'modules.lessons',
            'cohorts' => fn ($q) => $q->where('is_active', true)->with('term'),
            'attachments',
            'reviews' => fn ($q) => $q->where('is_approved', true)->with('user:id,name,avatar')->latest()->limit(10),
        ])->where('slug', $slug)->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $course,
        ]);
    }

    /**
     * List all reviews for a course (C4)
     */
    public function reviews(int $id): JsonResponse
    {
        $course = Course::findOrFail($id);

        $reviews = $course->reviews()
            ->where('is_approved', true)
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'course_id' => $course->id,
            'average_rating' => (float) $course->rating,
            'reviews_count' => (int) $course->reviews_count,
            'data' => $reviews,
        ]);
    }

    /**
     * Enrolled trainee submits a review for a course (C4)
     */
    public function addReview(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $course = Course::findOrFail($id);

        // Security check: only enrolled students with approved status can review
        $isEnrolled = Enrollment::where('trainee_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'approved')
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'status' => 'error',
                'message' => 'Seuls les étudiants inscrits à cette formation peuvent publier un avis / يجب أن تكون مسجلاً في هذه الدورة لنشر تقييم.',
            ], 403);
        }

        // Create or update review (strictly 1 review per student per course)
        $review = Review::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'is_approved' => true,
            ]
        );

        // Recalculate average rating & reviews count
        $course->recalculateRating();

        return response()->json([
            'status' => 'success',
            'message' => 'Merci pour votre évaluation ! / تم تسجيل تقييمك بنجاح.',
            'data' => $review->load('user:id,name,avatar'),
        ], 201);
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
