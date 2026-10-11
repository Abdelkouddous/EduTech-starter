<?php

namespace App\Services\Video;

use App\Models\Lesson;
use App\Models\User;

class BunnyNetVideoDriver implements VideoDriverInterface
{
    public function name(): string
    {
        return 'bunny';
    }

    public function resolvePayload(Lesson $lesson, ?User $user = null): array
    {
        $libraryId = config('services.bunny.library_id', env('BUNNY_LIBRARY_ID', ''));
        $apiKey = config('services.bunny.token_key', env('BUNNY_TOKEN_KEY', 'default_secret'));
        $videoId = $lesson->video_url ?? '';

        // Tokenized signed URL generation (expires in 4 hours)
        $expires = time() + (4 * 3600);
        $token = hash('sha256', $apiKey . $videoId . $expires);

        $streamUrl = "https://iframe.mediadelivery.net/embed/{$libraryId}/{$videoId}?token={$token}&expires={$expires}";

        return [
            'type' => 'bunny_hls',
            'src' => $streamUrl,
            'is_direct_stream' => false,
            'expires_at' => $expires,
        ];
    }
}
