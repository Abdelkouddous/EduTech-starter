<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\PaymentReceipt;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EduTechApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_institute_bootstrap_returns_white_label_settings(): void
    {
        $response = $this->getJson('/api/v1/institute/bootstrap');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'institute' => [
                    'name',
                    'theme' => ['primary_color', 'accent_color'],
                    'currency' => ['code', 'symbol'],
                    'features',
                    'offline_payment_methods',
                ],
                'academic_terms',
            ]);
    }

    public function test_courses_catalog_returns_seeded_courses(): void
    {
        $response = $this->getJson('/api/v1/courses');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => ['id', 'title', 'slug', 'price', 'instructor', 'cohorts'],
                ],
            ]);
    }

    public function test_user_authentication_flow(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@academy.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => ['id', 'name', 'email', 'role'],
            ]);
    }

    public function test_certificate_verification(): void
    {
        $response = $this->getJson('/api/v1/certificates/CERT-2025-0001');

        $response->assertStatus(200)
            ->assertJsonPath('is_valid', true)
            ->assertJsonPath('certificate.code', 'CERT-2025-0001');
    }

    public function test_secure_lesson_playback_authorization(): void
    {
        $freeLesson = Lesson::where('is_free_preview', true)->first();
        $paidLesson = Lesson::where('is_free_preview', false)->first();

        // Guest can play free preview
        $freeRes = $this->getJson("/api/v1/lessons/{$freeLesson->id}/play");
        $freeRes->assertStatus(200)
            ->assertJsonPath('is_free_preview', true);

        // Guest cannot play paid lesson (401)
        $paidRes = $this->getJson("/api/v1/lessons/{$paidLesson->id}/play");
        $paidRes->assertStatus(401);

        // Enrolled trainee can play paid lesson (200)
        $enrolledTrainee = User::where('email', 'mahmoud@gmail.com')->first();
        $authRes = $this->actingAs($enrolledTrainee, 'sanctum')->getJson("/api/v1/lessons/{$paidLesson->id}/play");
        $authRes->assertStatus(200)
            ->assertJsonPath('is_free_preview', false);
    }

    public function test_receipt_review_approval_flow(): void
    {
        $admin = User::where('email', 'admin@academy.com')->first();
        $course = Course::first();
        $newTrainee = User::where('email', 'aya@gmail.com')->first();

        $receipt = PaymentReceipt::create([
            'trainee_id' => $newTrainee->id,
            'course_id' => $course->id,
            'amount' => $course->price,
            'method' => 'instapay',
            'sender_account_or_number' => 'aya@instapay',
            'receipt_image_path' => 'receipts/test.png',
            'status' => 'pending',
        ]);

        $res = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/payments/receipts/{$receipt->id}/review", [
                'status' => 'approved',
            ]);

        $res->assertStatus(200);

        $this->assertDatabaseHas('enrollments', [
            'trainee_id' => $newTrainee->id,
            'course_id' => $course->id,
            'status' => 'approved',
        ]);
    }

    public function test_trainee_can_create_and_fetch_timestamped_lesson_notes(): void
    {
        $trainee = User::where('email', 'mahmoud@gmail.com')->first();
        $lesson = Lesson::first();

        // 1. Create a note at 145 seconds
        $storeRes = $this->actingAs($trainee, 'sanctum')
            ->postJson("/api/v1/lessons/{$lesson->id}/notes", [
                'content' => 'ملاحظة مهمة: شرح آلية التدقيق المالي ومصادقة الطلبات',
                'timestamp_seconds' => 145,
            ]);

        $storeRes->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('note.timestamp_seconds', 145);

        // 2. Fetch lesson notes
        $indexRes = $this->actingAs($trainee, 'sanctum')
            ->getJson("/api/v1/lessons/{$lesson->id}/notes");

        $indexRes->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(1, 'notes');
    }

    public function test_trainee_can_access_academic_profile_hub_with_aggregated_stats(): void
    {
        $trainee = User::where('email', 'mahmoud@gmail.com')->first();

        $response = $this->actingAs($trainee, 'sanctum')
            ->getJson('/api/v1/user/profile-hub');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'profile' => ['id', 'name', 'email', 'role', 'joined_at'],
                'stats' => ['enrolled_courses', 'completed_courses', 'completed_lessons', 'study_notes_count', 'certificates_count'],
                'certificates',
                'recent_receipts',
                'my_courses',
            ]);
    }
}
