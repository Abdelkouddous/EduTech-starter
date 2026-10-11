<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add profile fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('avatar');
            $table->string('specialization')->nullable()->after('bio');
            $table->string('role')->default('trainee')->after('specialization'); // admin, instructor, trainee
        });

        // 1. Dynamic Institute Settings Table (EDU-02)
        Schema::create('institute_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // 2. Academic Terms (EDU-01)
        Schema::create('academic_terms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "فصل الخريف 2025"
            $table->string('code')->unique(); // e.g. "FALL-2025"
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Courses (EDU-01)
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->longText('full_description')->nullable();
            $table->string('category');
            $table->string('level')->default('جميع المستويات');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->integer('duration_hours')->default(0);
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('cover_image')->nullable();
            $table->string('promo_video_url')->nullable();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->integer('students_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('prerequisites')->nullable();
            $table->json('learning_outcomes')->nullable();
            $table->timestamps();
        });

        // 4. Course Modules (EDU-01)
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title');
            $table->integer('order')->default(1);
            $table->timestamps();
        });

        // 5. Lessons (EDU-01 & EDU-04)
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_modules')->cascadeOnDelete();
            $table->string('title');
            $table->string('duration')->default('15:00');
            $table->string('video_url')->nullable();
            $table->string('video_driver')->default('embedded'); // embedded, youtube, vimeo, bunny, direct
            $table->boolean('is_free_preview')->default(false);
            $table->string('file_url')->nullable();
            $table->string('file_name')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();
        });

        // 6. Cohorts (EDU-01)
        Schema::create('cohorts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('academic_term_id')->nullable()->constrained('academic_terms')->nullOnDelete();
            $table->string('name'); // e.g. "دفعة أكتوبر 2025"
            $table->integer('capacity')->default(50);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 7. Cohort Announcements / Posts with Meet Link (EDU-01 senior decision)
        Schema::create('cohort_announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cohort_id')->constrained('cohorts')->cascadeOnDelete();
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('meeting_url')->nullable(); // External link to Google Meet, Zoom, Teams
            $table->dateTime('scheduled_at')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();
        });

        // 8. Payment Receipts (EDU-03)
        Schema::create('payment_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('method'); // instapay, vodafone_cash, fawry, card
            $table->string('sender_account_or_number');
            $table->string('transaction_ref')->nullable();
            $table->string('receipt_image_path');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        // 9. Enrollments (EDU-05)
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->nullOnDelete();
            $table->foreignId('payment_receipt_id')->nullable()->constrained('payment_receipts')->nullOnDelete();
            $table->string('status')->default('approved'); // pending, approved, rejected, completed
            $table->integer('progress_percent')->default(0);
            $table->boolean('certificate_issued')->default(false);
            $table->string('certificate_id')->nullable()->unique();
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['trainee_id', 'course_id', 'cohort_id']);
        });

        // 10. Lesson Progress (EDU-05)
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['enrollment_id', 'lesson_id']);
        });

        // 11. Certificates (EDU-05)
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_code')->unique(); // e.g. "CERT-2025-001"
            $table->foreignId('enrollment_id')->constrained('enrollments')->cascadeOnDelete();
            $table->foreignId('trainee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('trainee_name');
            $table->string('course_title');
            $table->date('issued_date');
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });

        // 12. File Attachments (EDU-04)
        Schema::create('file_attachments', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable'); // Course or Lesson
            $table->string('name');
            $table->string('file_path');
            $table->string('size');
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_attachments');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('payment_receipts');
        Schema::dropIfExists('cohort_announcements');
        Schema::dropIfExists('cohorts');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('academic_terms');
        Schema::dropIfExists('institute_settings');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'avatar', 'bio', 'specialization', 'role']);
        });
    }
};
