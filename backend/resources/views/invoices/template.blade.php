<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Facture / Reçu - {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 30px;
            color: #0f172a;
            font-size: 13px;
        }
        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        .institute-name {
            font-size: 22px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            text-align: right;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 30px;
        }
        .meta-table td {
            vertical-align: top;
            width: 50%;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f1f5f9;
            color: #334155;
            padding: 10px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }
        .items-table td {
            padding: 12px 10px;
            border: 1px solid #e2e8f0;
        }
        .total-box {
            text-align: right;
            margin-top: 15px;
            font-size: 16px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            font-size: 11px;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <div class="institute-name">{{ $instituteName }}</div>
                    <div style="color: #64748b; font-size: 12px; margin-top: 4px;">Plateforme d'Enseignement & Formation Professionnelle 🇩🇿</div>
                </td>
                <td style="text-align: right;">
                    <div class="invoice-title">FACTURE / REÇU OFFICIEL</div>
                    <div style="font-family: monospace; font-weight: bold; margin-top: 4px;">N° {{ $invoice->invoice_number }}</div>
                    <div style="color: #64748b; font-size: 12px;">Date: {{ $invoice->issued_at->format('d/m/Y H:i') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="meta-table">
        <tr>
            <td>
                <strong>Facturé à (Stagiaire) :</strong><br/>
                {{ $invoice->trainee->name }}<br/>
                Email : {{ $invoice->trainee->email }}<br/>
                Téléphone : {{ $invoice->trainee->phone ?? 'N/A' }}
            </td>
            <td style="text-align: right;">
                <strong>Détails du Paiement :</strong><br/>
                Mode : {{ strtoupper($invoice->payment_method) }}<br/>
                Statut : <span style="color: #16a34a; font-weight: bold;">PAYÉ / ACQUITTÉ ✓</span><br/>
                Devise : {{ $invoice->currency }} (Dinar Algérien)
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>Désignation / Prestation</th>
                <th>Type</th>
                <th style="text-align: right;">Montant Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>{{ $invoice->item_title }}</strong>
                </td>
                <td>{{ ucfirst($invoice->item_type) }}</td>
                <td style="text-align: right; font-weight: bold;">
                    {{ number_format($invoice->amount, 2) }} {{ $invoice->currency }}
                </td>
            </tr>
        </tbody>
    </table>

    <div class="total-box">
        Total Net Payé : {{ number_format($invoice->amount, 2) }} {{ $invoice->currency }}
    </div>

    <div class="footer">
        Document généré électroniquement par {{ $instituteName }} • Fait valoir ce que de droit.<br/>
        Vérification et conformité monétique garantie • Algérie.
    </div>
</body>
</html>
