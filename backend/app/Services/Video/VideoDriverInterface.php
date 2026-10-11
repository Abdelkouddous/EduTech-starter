<?php

namespace App\Services\Video;

use App\Models\Lesson;
use App\Models\User;

interface VideoDriverInterface
{
    public function name(): string;

    /**
     * Resolve secure video delivery payload (embed URL, direct tokenized URL, or HLS stream)
     */
    public function resolvePayload(Lesson $lesson, ?User $user = null): array;
}
