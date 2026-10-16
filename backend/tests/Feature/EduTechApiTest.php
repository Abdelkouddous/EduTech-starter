<?php

namespace Tests\Feature;

use App\Models\AvailabilitySlot;
use App\Models\ConsultationBooking;
use App\Models\ConsultationType;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Lesson;
use App\Models\PaymentReceipt;
use App\Models\Review;
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

    public function test_french_academic_certificate_can_be_downloaded_and_verified(): void
    {
        $code = 'CERT-2025-0001';

        // 1. Verify certificate publicly
        $verifyRes = $this->getJson("/api/v1/certificates/{$code}");
        $verifyRes->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('certificate.code', $code)
            ->assertJsonPath('certificate.trainee_name', 'محمود حسن');

        // 2. Download French PDF stream
        $downloadRes = $this->get("/api/v1/certificates/{$code}/download");
        $downloadRes->assertStatus(200);
        $this->assertEquals('application/pdf', $downloadRes->headers->get('content-type'));
    }

    public function test_satim_automated_checkout_and_webhook_auto_enrollment_flow(): void
    {
        $newTrainee = User::factory()->create(['email' => 'algerian.trainee@dz.com']);
        $course = Course::where('id', '!=', 1)->first() ?? Course::factory()->create(['price' => 12000]);

        // 1. Initiate SATIM Checkout Session
        $checkoutRes = $this->actingAs($newTrainee, 'sanctum')
            ->postJson('/api/v1/payments/satim/checkout', [
                'course_id' => $course->id,
            ]);

        $checkoutRes->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['order_id', 'session_id', 'amount', 'currency', 'terminal_id', 'checkout_url', 'signature'],
            ]);

        $orderId = $checkoutRes->json('data.order_id');
        $amount = $checkoutRes->json('data.amount');

        $this->assertDatabaseHas('payment_receipts', [
            'transaction_ref' => $orderId,
            'method' => 'satim',
            'status' => 'pending',
            'trainee_id' => $newTrainee->id,
        ]);

        // 2. Compute HMAC signature for webhook
        $secretKey = config('services.satim.secret_key');
        $validSignature = hash_hmac('sha256', "{$orderId}|{$amount}|APPROVED", $secretKey);

        // 3. SATIM Webhook callback triggers auto-enrollment
        $webhookRes = $this->postJson('/api/v1/payments/satim/webhook', [
            'order_id' => $orderId,
            'amount' => $amount,
            'status' => 'APPROVED',
            'response_code' => '00',
            'signature' => $validSignature,
        ]);

        $webhookRes->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // 4. Verify payment receipt was approved and enrollment created
        $this->assertDatabaseHas('payment_receipts', [
            'transaction_ref' => $orderId,
            'status' => 'approved',
        ]);

        $this->assertDatabaseHas('enrollments', [
            'trainee_id' => $newTrainee->id,
            'course_id' => $course->id,
            'status' => 'approved',
        ]);
    }

    public function test_course_catalog_search_and_filtering(): void
    {
        // 1. Search by keyword
        $res = $this->getJson('/api/v1/courses?q=React');
        $res->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // 2. Filter by price range
        $resPrice = $this->getJson('/api/v1/courses?price_min=1000&price_max=10000');
        $resPrice->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // 3. Filter by rating
        $resRating = $this->getJson('/api/v1/courses?rating=4.5');
        $resRating->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    public function test_course_reviews_listing_and_submission_by_enrolled_trainee(): void
    {
        $trainee = User::where('email', 'mahmoud@gmail.com')->first();
        $course = Course::first();

        // 1. Fetch public reviews for course
        $reviewsRes = $this->getJson("/api/v1/courses/{$course->id}/reviews");
        $reviewsRes->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'average_rating', 'reviews_count', 'data']);

        // 2. Enrolled trainee submits a review
        $submitRes = $this->actingAs($trainee, 'sanctum')
            ->postJson("/api/v1/courses/{$course->id}/reviews", [
                'rating' => 5,
                'comment' => 'محتوى ممتاز وتطبيق عملي عالي الجودة.',
            ]);

        $submitRes->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.rating', 5);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $trainee->id,
            'course_id' => $course->id,
            'rating' => 5,
        ]);
    }

    public function test_consultations_listing_and_booking_workflow(): void
    {
        $trainee = User::where('email', 'mahmoud@gmail.com')->first();
        $type = ConsultationType::first();

        // 1. List consultation types
        $typesRes = $this->getJson('/api/v1/consultations/types');
        $typesRes->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // 2. List available slots for type
        $slotsRes = $this->getJson("/api/v1/consultations/types/{$type->id}/slots");
        $slotsRes->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $slot = AvailabilitySlot::where('consultation_type_id', $type->id)->where('is_booked', false)->first();

        // 3. Trainee books a consultation
        $bookRes = $this->actingAs($trainee, 'sanctum')
            ->postJson('/api/v1/consultations/book', [
                'slot_id' => $slot->id,
                'notes' => 'أرغب بمناقشة مسار التوظيف والعمل عن بعد.',
            ]);

        $bookRes->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'message', 'data' => ['booking_code', 'meeting_url']]);

        // Slot should now be marked as booked
        $slot->refresh();
        $this->assertTrue($slot->is_booked);

        // 4. View trainee bookings
        $myBookingsRes = $this->actingAs($trainee, 'sanctum')
            ->getJson('/api/v1/consultations/my-bookings');

        $myBookingsRes->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    public function test_electronic_invoices_listing_and_download(): void
    {
        $trainee = User::where('email', 'mahmoud@gmail.com')->first();
        $invoice = Invoice::where('trainee_id', $trainee->id)->first();

        // 1. List user invoices
        $listRes = $this->actingAs($trainee, 'sanctum')
            ->getJson('/api/v1/invoices');

        $listRes->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'data']);

        // 2. Download invoice PDF
        $downloadRes = $this->actingAs($trainee, 'sanctum')
            ->get("/api/v1/invoices/{$invoice->id}/download");

        $downloadRes->assertStatus(200);
        $this->assertEquals('application/pdf', $downloadRes->headers->get('content-type'));
    }

    public function test_coupon_validation_and_discount_calculation(): void
    {
        $response = $this->postJson('/api/v1/coupons/validate', [
            'code' => 'EDUTECH20',
            'amount' => 10000,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.code', 'EDUTECH20')
            ->assertJsonPath('data.discount_amount', 2000)
            ->assertJsonPath('data.final_amount', 8000);
    }

    public function test_in_app_account_deletion_compliance(): void
    {
        $user = User::factory()->create(['email' => 'to.delete@dz.com']);

        $res = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/v1/auth/account');

        $res->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}
