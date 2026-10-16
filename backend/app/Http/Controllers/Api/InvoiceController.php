<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(protected InvoiceService $invoiceService) {}

    /**
     * Trainee lists their invoices (P7, A5)
     */
    public function index(Request $request): JsonResponse
    {
        $invoices = Invoice::where('trainee_id', $request->user()->id)
            ->latest('issued_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $invoices,
        ]);
    }

    /**
     * Download PDF invoice
     */
    public function download(Request $request, int $id)
    {
        $invoice = Invoice::where('trainee_id', $request->user()->id)->findOrFail($id);
        $pdf = $this->invoiceService->generatePdf($invoice);

        return $pdf->download("Facture-{$invoice->invoice_number}.pdf");
    }
}
