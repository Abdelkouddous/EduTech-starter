<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CohortAnnouncementController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstituteBootstrapController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\LessonNoteController;
use App\Http\Controllers\Api\PaymentReceiptController;
use App\Http\Controllers\Api\ProfileHubController;
use App\Http\Controllers\Api\SatimPaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Dynamic White-Label Bootstrap & Config (EDU-02)
    Route::get('/institute/bootstrap', [InstituteBootstrapController::class, 'bootstrap']);

    // 2. Authentication (EDU-01)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // 3. Courses Catalog & Reviews (EDU-01, EDU-11)
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);
    Route::get('/courses/{id}/reviews', [CourseController::class, 'reviews']);

    // 4. Secure Video Player & Lesson Delivery (EDU-04)
    Route::get('/lessons/{id}/play', [LessonController::class, 'play']);

    // 5. Public Certificate Verification & Download (EDU-05, EDU-09)
    Route::get('/certificates/{code}', [EnrollmentController::class, 'verifyCertificate']);
    Route::get('/certificates/{code}/download', [EnrollmentController::class, 'downloadCertificate']);

    // 6. Automated SATIM / CIB E-Payment Webhooks & Simulator (EDU-10)
    Route::post('/payments/satim/webhook', [SatimPaymentController::class, 'handleWebhook']);
    Route::get('/payments/satim/checkout/{orderId}', [SatimPaymentController::class, 'simulator']);

    // 7. Consultations Catalog & Available Slots (EDU-12)
    Route::get('/consultations/types', [ConsultationController::class, 'types']);
    Route::get('/consultations/types/{id}/slots', [ConsultationController::class, 'slots']);

    // 8. Promotional Discount Coupons Validation (EDU-15)
    Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

    // ==========================================
    // Protected Routes (Sanctum Authenticated)
    // ==========================================
    Route::middleware('auth:sanctum')->group(function () {
        // Current user profile & Account Deletion (A6)
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::delete('/auth/account', [AuthController::class, 'deleteAccount']);

        // Course Reviews Submission (EDU-11)
        Route::post('/courses/{id}/reviews', [CourseController::class, 'addReview']);

        // Trainee Enrolled Dashboard & Progress Tracking (EDU-05)
        Route::get('/my-courses', [EnrollmentController::class, 'myCourses']);
        Route::post('/lessons/{id}/complete', [EnrollmentController::class, 'toggleLessonComplete']);

        // Academic Profile & Credential Hub (EDU-08)
        Route::get('/user/profile-hub', [ProfileHubController::class, 'show']);

        // Interactive Study Notes & Lesson Workspace (EDU-07)
        Route::get('/lessons/{lessonId}/notes', [LessonNoteController::class, 'index']);
        Route::post('/lessons/{lessonId}/notes', [LessonNoteController::class, 'store']);
        Route::delete('/notes/{id}', [LessonNoteController::class, 'destroy']);

        // Consultations 1-on-1 Booking & Management (EDU-12)
        Route::post('/consultations/book', [ConsultationController::class, 'book']);
        Route::get('/consultations/my-bookings', [ConsultationController::class, 'myBookings']);
        Route::post('/consultations/bookings/{id}/cancel', [ConsultationController::class, 'cancel']);

        // Electronic PDF Invoices & Billing History (EDU-13)
        Route::get('/invoices', [InvoiceController::class, 'index']);
        Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);

        // Cohort Announcements & Live Meeting Links (EDU-01)
        Route::get('/cohorts/{cohortId}/announcements', [CohortAnnouncementController::class, 'index']);
        Route::post('/cohorts/{cohortId}/announcements', [CohortAnnouncementController::class, 'store']);

        // Payment Gateways (EDU-03 Manual & EDU-10 SATIM Automated)
        Route::post('/payments/submit-receipt', [PaymentReceiptController::class, 'submit']);
        Route::get('/payments/my-receipts', [PaymentReceiptController::class, 'myReceipts']);
        Route::post('/payments/satim/checkout', [SatimPaymentController::class, 'initiateCheckout']);

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
