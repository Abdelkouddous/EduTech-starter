<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'full_description',
        'category',
        'level',
        'price',
        'original_price',
        'duration_hours',
        'instructor_id',
        'cover_image',
        'promo_video_url',
        'rating',
        'reviews_count',
        'students_count',
        'is_published',
        'prerequisites',
        'learning_outcomes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_published' => 'boolean',
        'prerequisites' => 'array',
        'learning_outcomes' => 'array',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('order');
    }

    public function cohorts(): HasMany
    {
        return $this->hasMany(Cohort::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(FileAttachment::class, 'attachable');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function recalculateRating(): void
    {
        $avg = $this->reviews()->where('is_approved', true)->avg('rating') ?? 0;
        $count = $this->reviews()->where('is_approved', true)->count();
        $this->update([
            'rating' => round($avg, 2),
            'reviews_count' => $count,
        ]);
    }
}
