<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Services\Payments\SatimPaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SatimPaymentController extends Controller
{
    public function __construct(protected SatimPaymentGateway $gateway) {}

    /**
     * Trainee creates an online SATIM / CIB payment session
     */
    public function initiateCheckout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'cohort_id' => 'nullable|exists:cohorts,id',
            'return_url' => 'nullable|url',
        ]);

        $user = $request->user();
        $course = Course::findOrFail($validated['course_id']);

        // Check if user is already enrolled
        $existingEnrollment = Enrollment::where('trainee_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'approved')
            ->exists();

        if ($existingEnrollment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous êtes déjà inscrit à cette formation / أنت مسجل بالفعل في هذه الدورة.',
            ], 422);
        }

        $session = $this->gateway->createCheckoutSession(
            $user,
            $course,
            $validated['cohort_id'] ?? null,
            $validated['return_url'] ?? null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Session de paiement SATIM / CIB initialisée avec succès.',
            'data' => $session,
        ], 201);
    }

    /**
     * Webhook endpoint called by SATIM payment gateway switch
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|string',
            'amount' => 'required|numeric',
            'status' => 'required|string|in:APPROVED,DECLINED,approved,declined',
            'response_code' => 'nullable|string',
            'signature' => 'nullable|string',
        ]);

        // If signature is provided, verify it
        if (!empty($validated['signature'])) {
            $isValid = $this->gateway->verifySignature(
                $validated['order_id'],
                (float) $validated['amount'],
                strtoupper($validated['status']),
                $validated['signature']
            );

            if (!$isValid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Signature cryptographique SATIM invalide.',
                ], 403);
            }
        }

        $result = $this->gateway->processWebhook($validated);

        $httpStatus = ($result['status'] === 'error') ? 404 : 200;
        return response()->json($result, $httpStatus);
    }

    /**
     * Visual test checkout simulator for developers and clients
     */
    public function simulator(string $orderId)
    {
        return response()->view('payments.satim_simulator', [
            'orderId' => $orderId,
        ]);
    }
}
