<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'trainee_id',
        'course_id',
        'cohort_id',
        'payment_receipt_id',
        'status',
        'progress_percent',
        'certificate_issued',
        'certificate_id',
        'enrolled_at',
        'completed_at',
    ];

    protected $casts = [
        'certificate_issued' => 'boolean',
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function trainee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainee_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function paymentReceipt(): BelongsTo
    {
        return $this->belongsTo(PaymentReceipt::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    /**
     * Recalculate progress based on completed lessons
     */
    public function recalculateProgress(): void
    {
        $totalLessons = $this->course->modules()->withCount('lessons')->get()->sum('lessons_count');
        if ($totalLessons === 0) {
            $this->update(['progress_percent' => 100]);
            return;
        }

        $completedCount = $this->lessonProgress()->where('is_completed', true)->count();
        $percent = min(100, (int) round(($completedCount / $totalLessons) * 100));

        $this->progress_percent = $percent;
        if ($percent >= 100 && !$this->completed_at) {
            $this->completed_at = now();
            $this->status = 'completed';
        }
        $this->save();
    }
}
