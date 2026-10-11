<?php

namespace App\Services\Video;

use App\Models\InstituteSetting;
use App\Models\Lesson;

class VideoManager
{
    public static function resolveDriver(string $driverName): VideoDriverInterface
    {
        return match ($driverName) {
            'bunny' => new BunnyNetVideoDriver(),
            default => new EmbeddedVideoDriver(),
        };
    }

    public static function getPayloadForLesson(Lesson $lesson, $user = null): array
    {
        $defaultDriver = InstituteSetting::get('default_video_driver', 'embedded');
        $driverName = $lesson->video_driver ?? $defaultDriver;

        $driver = static::resolveDriver($driverName);
        return $driver->resolvePayload($lesson, $user);
    }
}
