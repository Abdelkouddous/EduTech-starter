<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AvailabilitySlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'consultation_type_id',
        'specialist_id',
        'start_time',
        'end_time',
        'is_booked',
        'locked_until',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_booked' => 'boolean',
        'locked_until' => 'datetime',
    ];

    public function consultationType(): BelongsTo
    {
        return $this->belongsTo(ConsultationType::class);
    }

    public function specialist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'specialist_id');
    }

    public function booking(): HasOne
    {
        return $this->hasOne(ConsultationBooking::class);
    }

    /**
     * Check if slot is available for booking (not booked and lock expired)
     */
    public function isAvailable(): bool
    {
        if ($this->is_booked) {
            return false;
        }

        if ($this->locked_until && $this->locked_until->isFuture()) {
            return false;
        }

        return true;
    }
}
