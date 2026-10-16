<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'trainee_id',
        'consultation_type_id',
        'availability_slot_id',
        'payment_receipt_id',
        'status',
        'meeting_url',
        'notes',
        'price_paid',
        'booked_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'price_paid' => 'decimal:2',
        'booked_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function trainee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainee_id');
    }

    public function consultationType(): BelongsTo
    {
        return $this->belongsTo(ConsultationType::class);
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(AvailabilitySlot::class, 'availability_slot_id');
    }

    public function paymentReceipt(): BelongsTo
    {
        return $this->belongsTo(PaymentReceipt::class);
    }
}
