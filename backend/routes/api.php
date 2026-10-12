<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CohortAnnouncementController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstituteBootstrapController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\LessonNoteController;
use App\Http\Controllers\Api\PaymentReceiptController;
use App\Http\Controllers\Api\ProfileHubController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Dynamic White-Label Bootstrap & Config (EDU-02)
    Route::get('/institute/bootstrap', [InstituteBootstrapController::class, 'bootstrap']);

    // 2. Authentication (EDU-01)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // 3. Courses Catalog & Public Details (EDU-01)
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);

    // 4. Secure Video Player & Lesson Delivery (EDU-04)
    Route::get('/lessons/{id}/play', [LessonController::class, 'play']);

    // 5. Public Certificate Verification & Download (EDU-05)
    Route::get('/certificates/{code}', [EnrollmentController::class, 'verifyCertificate']);
    Route::get('/certificates/{code}/download', [EnrollmentController::class, 'downloadCertificate']);

    // ==========================================
    // Protected Routes (Sanctum Authenticated)
    // ==========================================
    Route::middleware('auth:sanctum')->group(function () {
        // Current user profile
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Trainee Enrolled Dashboard & Progress Tracking (EDU-05)
        Route::get('/my-courses', [EnrollmentController::class, 'myCourses']);
        Route::post('/lessons/{id}/complete', [EnrollmentController::class, 'toggleLessonComplete']);

        // Academic Profile & Credential Hub (EDU-08)
        Route::get('/user/profile-hub', [ProfileHubController::class, 'show']);

        // Interactive Study Notes & Lesson Workspace (EDU-07)
        Route::get('/lessons/{lessonId}/notes', [LessonNoteController::class, 'index']);
        Route::post('/lessons/{lessonId}/notes', [LessonNoteController::class, 'store']);
        Route::delete('/notes/{id}', [LessonNoteController::class, 'destroy']);

        // Cohort Announcements & Live Meeting Links (EDU-01 senior feature)
        Route::get('/cohorts/{cohortId}/announcements', [CohortAnnouncementController::class, 'index']);
        Route::post('/cohorts/{cohortId}/announcements', [CohortAnnouncementController::class, 'store']);

        // Manual Payment Receipts Submission (EDU-03)
        Route::post('/payments/submit-receipt', [PaymentReceiptController::class, 'submit']);
        Route::get('/payments/my-receipts', [PaymentReceiptController::class, 'myReceipts']);

        // ==========================================
        // Staff / Admin Endpoints
        // ==========================================
        Route::middleware('role:admin|instructor')->group(function () {
            Route::post('/courses', [CourseController::class, 'store']);
        });

        Route::middleware('role:admin')->group(function () {
            // White-label dynamic branding updates
            Route::put('/admin/institute/settings', [InstituteBootstrapController::class, 'update']);

            // Receipt audit verification pipeline (EDU-03)
            Route::get('/admin/payments/receipts', [PaymentReceiptController::class, 'adminIndex']);
            Route::post('/admin/payments/receipts/{id}/review', [PaymentReceiptController::class, 'review']);
        });
    });
});
