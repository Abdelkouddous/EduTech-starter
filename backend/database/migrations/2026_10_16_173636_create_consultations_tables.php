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
        Schema::create('consultation_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialist_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('duration_minutes')->default(45);
            $table->decimal('price', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_type_id')->constrained('consultation_types')->cascadeOnDelete();
            $table->foreignId('specialist_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->boolean('is_booked')->default(false);
            $table->dateTime('locked_until')->nullable(); // 10-minute hold lock (K3)
            $table->timestamps();

            $table->index(['consultation_type_id', 'start_time', 'is_booked']);
        });

        Schema::create('consultation_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->foreignId('trainee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('consultation_type_id')->constrained('consultation_types')->cascadeOnDelete();
            $table->foreignId('availability_slot_id')->constrained('availability_slots')->cascadeOnDelete();
            $table->foreignId('payment_receipt_id')->nullable()->constrained('payment_receipts')->nullOnDelete();
            $table->string('status')->default('pending_payment'); // pending_payment, confirmed, cancelled, completed
            $table->string('meeting_url')->nullable(); // Google Meet / Zoom link (K4)
            $table->text('notes')->nullable();
            $table->decimal('price_paid', 10, 2)->default(0.00);
            $table->dateTime('booked_at')->useCurrent();
            $table->dateTime('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_bookings');
        Schema::dropIfExists('availability_slots');
        Schema::dropIfExists('consultation_types');
    }
};
