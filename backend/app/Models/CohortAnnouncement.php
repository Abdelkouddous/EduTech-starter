<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CohortAnnouncement extends Model
{
    use HasFactory;

    protected $fillable = [
        'cohort_id',
        'instructor_id',
        'title',
        'content',
        'meeting_url',
        'scheduled_at',
        'is_pinned',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'is_pinned' => 'boolean',
    ];

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
