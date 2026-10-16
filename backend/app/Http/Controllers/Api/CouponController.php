<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Validate a coupon code and calculate discount (D7)
     */
    public function validateCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($validated['code']))->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Code promo invalide ou expiré / كود الخصم غير صالح أو منتهي الصلاحية.',
            ], 422);
        }

        $amount = (float) $validated['amount'];
        $discount = $coupon->calculateDiscount($amount);
        $finalAmount = max(0, round($amount - $discount, 2));

        return response()->json([
            'status' => 'success',
            'message' => 'Code promo appliqué avec succès / تم تطبيق كود الخصم بنجاح.',
            'data' => [
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount_value' => (float) $coupon->discount_value,
                'discount_amount' => $discount,
                'original_amount' => $amount,
                'final_amount' => $finalAmount,
            ],
        ]);
    }
}
