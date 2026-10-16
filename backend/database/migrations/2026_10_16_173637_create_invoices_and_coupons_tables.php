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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // e.g. INV-2026-0001
            $table->foreignId('trainee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('payment_receipt_id')->nullable()->constrained('payment_receipts')->nullOnDelete();
            $table->string('item_type'); // course, consultation
            $table->unsignedBigInteger('item_id');
            $table->string('item_title');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('DZD');
            $table->string('payment_method');
            $table->dateTime('issued_at')->useCurrent();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. EDUTECH20
            $table->string('discount_type')->default('percentage'); // percentage, fixed
            $table->decimal('discount_value', 10, 2);
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->dateTime('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('invoices');
    }
};
