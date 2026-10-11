<?php

namespace App\Services\Payments;

interface PaymentGatewayInterface
{
    public function identifier(): string;
    public function title(): string;
    public function requiresManualReview(): bool;
}
