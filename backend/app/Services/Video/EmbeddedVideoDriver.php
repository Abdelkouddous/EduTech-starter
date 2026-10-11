<?php

namespace App\Services\Video;

use App\Models\Lesson;
use App\Models\User;

class EmbeddedVideoDriver implements VideoDriverInterface
{
    public function name(): string
    {
        return 'embedded';
    }

    public function resolvePayload(Lesson $lesson, ?User $user = null): array
    {
        $url = $lesson->video_url ?? '';

        // Detect YouTube
        if (preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/', $url, $matches)) {
            $videoId = $matches[1];
            return [
                'type' => 'youtube',
                'src' => "https://www.youtube.com/embed/{$videoId}?rel=0&modestbranding=1",
                'is_direct_stream' => false,
            ];
        }

        // Detect Vimeo
        if (preg_match('/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/', $url, $matches)) {
            $videoId = end($matches);
            return [
                'type' => 'vimeo',
                'src' => "https://player.vimeo.com/video/{$videoId}",
                'is_direct_stream' => false,
            ];
        }

        // Direct HTML5 / MP4
        return [
            'type' => 'html5',
            'src' => $url,
            'is_direct_stream' => true,
        ];
    }
}
