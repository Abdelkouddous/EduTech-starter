<?php

namespace App\Services\Payments;

class ManualOfflineGateway implements PaymentGatewayInterface
{
    public function __construct(protected string $method = 'instapay') {}

    public function identifier(): string
    {
        return $this->method;
    }

    public function title(): string
    {
        return match ($this->method) {
            'baridimob' => 'BaridiMob (بريدي موب)',
            'ccp' => 'CCP Algérie Poste (حساب بريدي جاري)',
            'edahabia' => 'Carte Edahabia / CIB (الذهبية)',
            'instapay' => 'InstaPay (إنستاباي)',
            'vodafone_cash' => 'Vodafone Cash (فودافون كاش)',
            'fawry' => 'Fawry (فوري)',
            default => 'Paiement Manuel / التحويل اليدوي',
        };
    }

    public function requiresManualReview(): bool
    {
        return true;
    }
}
