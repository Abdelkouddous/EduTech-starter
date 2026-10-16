<?php

namespace App\Services;

use App\Models\InstituteSetting;
use App\Models\Invoice;
use App\Models\PaymentReceipt;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * Create an invoice from an approved payment receipt
     */
    public function createFromReceipt(PaymentReceipt $receipt): Invoice
    {
        $existing = Invoice::where('payment_receipt_id', $receipt->id)->first();
        if ($existing) {
            return $existing;
        }

        $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(Str::random(6));

        return Invoice::create([
            'invoice_number' => $invoiceNumber,
            'trainee_id' => $receipt->trainee_id,
            'payment_receipt_id' => $receipt->id,
            'item_type' => 'course',
            'item_id' => $receipt->course_id,
            'item_title' => $receipt->course ? $receipt->course->title : 'Formation en Ligne',
            'amount' => $receipt->amount,
            'currency' => 'DZD',
            'payment_method' => $receipt->method,
            'issued_at' => now(),
        ]);
    }

    /**
     * Generate PDF stream for an invoice
     */
    public function generatePdf(Invoice $invoice)
    {
        $settings = InstituteSetting::allCached();
        $instituteName = $settings['institute_name'] ?? 'EduTech Starter';

        $data = [
            'invoice' => $invoice->load('trainee'),
            'instituteName' => $instituteName,
        ];

        return Pdf::loadView('invoices.template', $data)
            ->setPaper('a4', 'portrait');
    }
}
