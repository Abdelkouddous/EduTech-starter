<?php

namespace App\Services\Payments;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SatimPaymentGateway implements PaymentGatewayInterface
{
    public function identifier(): string
    {
        return 'satim';
    }

    public function title(): string
    {
        return 'Paiement Électronique Sécurisé SATIM / Carte CIB & Edahabia (الدفع الإلكتروني)';
    }

    public function requiresManualReview(): bool
    {
        return false;
    }

    /**
     * Initialize an online payment order session
     */
    public function createCheckoutSession(User $user, Course $course, ?int $cohortId = null, ?string $returnUrl = null): array
    {
        $orderNumber = 'SATIM-' . date('Ymd') . '-' . strtoupper(Str::random(8));
        $sessionId = 'SES-' . Str::uuid();
        $secretKey = config('services.satim.secret_key', 'satim_secret_test_key_edutech_2026');
        $terminalId = config('services.satim.terminal_id', 'EDUTECH_SATIM_01');

        $receipt = PaymentReceipt::create([
            'trainee_id' => $user->id,
            'course_id' => $course->id,
            'cohort_id' => $cohortId,
            'amount' => $course->price,
            'method' => 'satim',
            'sender_account_or_number' => 'CIB-EDAHABIA-AUTO',
            'transaction_ref' => $orderNumber,
            'gateway_session_id' => $sessionId,
            'receipt_image_path' => null,
            'status' => 'pending',
        ]);

        $signature = hash_hmac('sha256', "{$orderNumber}|{$course->price}|DZD", $secretKey);

        return [
            'order_id' => $orderNumber,
            'session_id' => $sessionId,
            'amount' => (float) $course->price,
            'currency' => 'DZD',
            'terminal_id' => $terminalId,
            'payment_receipt_id' => $receipt->id,
            'signature' => $signature,
            'checkout_url' => url("/api/v1/payments/satim/checkout/{$orderNumber}"),
            'return_url' => $returnUrl ?? url('/courses'),
        ];
    }

    /**
     * Verify HMAC cryptographic signature for webhook callback
     */
    public function verifySignature(string $orderId, float $amount, string $status, string $signature): bool
    {
        $secretKey = config('services.satim.secret_key', 'satim_secret_test_key_edutech_2026');
        $expected = hash_hmac('sha256', "{$orderId}|{$amount}|{$status}", $secretKey);
        return hash_equals($expected, $signature);
    }

    /**
     * Process webhook notification from SATIM switch
     */
    public function processWebhook(array $payload): array
    {
        $orderId = $payload['order_id'] ?? null;
        $status = strtoupper($payload['status'] ?? 'DECLINED');
        $responseCode = $payload['response_code'] ?? ($status === 'APPROVED' ? '00' : '05');

        $receipt = PaymentReceipt::where('transaction_ref', $orderId)->first();

        if (!$receipt) {
            return [
                'status' => 'error',
                'message' => "Order {$orderId} not found.",
            ];
        }

        if ($receipt->status !== 'pending') {
            return [
                'status' => 'noop',
                'message' => "Receipt already processed with status: {$receipt->status}.",
                'receipt' => $receipt,
            ];
        }

        return DB::transaction(function () use ($receipt, $status, $responseCode, $payload) {
            if ($status === 'APPROVED' && $responseCode === '00') {
                $receipt->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                ]);

                // Automatically grant full course access
                $enrollment = Enrollment::updateOrCreate(
                    [
                        'trainee_id' => $receipt->trainee_id,
                        'course_id' => $receipt->course_id,
                        'cohort_id' => $receipt->cohort_id,
                    ],
                    [
                        'payment_receipt_id' => $receipt->id,
                        'status' => 'approved',
                        'enrolled_at' => now(),
                        'progress_percent' => 0,
                    ]
                );

                $receipt->course->increment('students_count');

                // Auto-generate official electronic invoice (P7)
                app(\App\Services\InvoiceService::class)->createFromReceipt($receipt);

                return [
                    'status' => 'success',
                    'message' => 'Paiement SATIM/CIB approuvé. Accès activé automatiquement.',
                    'receipt' => $receipt->fresh(['course', 'trainee']),
                    'enrollment' => $enrollment,
                ];
            } else {
                $receipt->update([
                    'status' => 'rejected',
                    'rejection_reason' => $payload['reason'] ?? 'Paiement SATIM/CIB refusé ou annulé par la banque (Code ' . $responseCode . ').',
                    'reviewed_at' => now(),
                ]);

                return [
                    'status' => 'declined',
                    'message' => 'Paiement refusé par le serveur de paiement SATIM.',
                    'receipt' => $receipt,
                ];
            }
        });
    }
}
