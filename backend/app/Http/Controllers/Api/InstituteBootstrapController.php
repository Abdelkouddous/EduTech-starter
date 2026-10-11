<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicTerm;
use App\Models\InstituteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstituteBootstrapController extends Controller
{
    /**
     * Return all dynamic white-label configuration and active academic terms
     */
    public function bootstrap(): JsonResponse
    {
        $settings = InstituteSetting::allCached();
        $activeTerms = AcademicTerm::where('is_active', true)->get(['id', 'name', 'code', 'start_date', 'end_date']);

        return response()->json([
            'status' => 'success',
            'institute' => [
                'name' => $settings['institute_name'] ?? 'أكاديمية التعلم',
                'tagline' => $settings['institute_tagline'] ?? '',
                'description' => $settings['institute_description'] ?? '',
                'theme' => [
                    'primary_color' => $settings['primary_color'] ?? '#2563eb',
                    'accent_color' => $settings['accent_color'] ?? '#f59e0b',
                    'logo_url' => $settings['logo_url'] ?? '/assets/logo.png',
                ],
                'currency' => [
                    'code' => $settings['currency_code'] ?? 'EGP',
                    'symbol' => $settings['currency_symbol'] ?? 'ج.م',
                ],
                'contacts' => [
                    'email' => $settings['contact_email'] ?? '',
                    'phone' => $settings['contact_phone'] ?? '',
                    'whatsapp' => $settings['whatsapp_number'] ?? '',
                ],
                'features' => [
                    'allow_manual_receipts' => (bool) ($settings['allow_manual_receipts'] ?? true),
                    'allow_announcement_feeds' => (bool) ($settings['allow_announcement_feeds'] ?? true),
                    'auto_issue_certificates' => (bool) ($settings['auto_issue_certificates'] ?? true),
                    'default_video_driver' => $settings['default_video_driver'] ?? 'embedded',
                ],
                'offline_payment_methods' => $settings['offline_payment_methods'] ?? [],
            ],
            'academic_terms' => $activeTerms,
        ]);
    }

    /**
     * Update dynamic settings (Admin only)
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            InstituteSetting::set($key, $value);
        }

        InstituteSetting::clearCache();

        return response()->json([
            'status' => 'success',
            'message' => 'تم تحديث إعدادات الأكاديمية بنجاح',
            'settings' => InstituteSetting::allCached(),
        ]);
    }
}
