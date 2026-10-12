<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passerelle de Paiement Électronique SATIM / CIB</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 40px 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .gateway-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            max-width: 480px;
            width: 100%;
            padding: 32px;
            border: 1px solid #e2e8f0;
        }
        .header {
            text-align: center;
            margin-bottom: 24px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 20px;
        }
        .brand {
            font-size: 20px;
            font-weight: 800;
            color: #1e3a8a;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .tagline {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
        }
        .badges {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 14px;
        }
        .badge {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
        }
        .order-info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 10px;
            padding: 14px 18px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .order-label {
            font-size: 13px;
            color: #1e40af;
        }
        .order-id {
            font-family: monospace;
            font-weight: bold;
            font-size: 13px;
            color: #1e3a8a;
        }
        .form-group {
            margin-bottom: 16px;
        }
        label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 6px;
        }
        input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            background: #f8fafc;
        }
        .row {
            display: flex;
            gap: 12px;
        }
        .btn-pay {
            width: 100%;
            background: #2563eb;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.2s;
        }
        .btn-pay:hover {
            background: #1d4ed8;
        }
        .btn-cancel {
            width: 100%;
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
        }
        .security-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
        }
        #result-box {
            display: none;
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            font-size: 13px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="gateway-card">
        <div class="header">
            <div class="brand">
                <span>🏛️ SATIM / CIB</span>
            </div>
            <div class="tagline">Plateforme Monétique Interbancaire Sécurisée d'Algérie</div>
            <div class="badges">
                <span class="badge">💳 CIB</span>
                <span class="badge">💛 EDAHABIA</span>
                <span class="badge">🇩🇿 DZD</span>
            </div>
        </div>

        <div class="order-info">
            <span class="order-label">Référence Commande :</span>
            <span class="order-id">{{ $orderId }}</span>
        </div>

        <form id="satim-form" onsubmit="handlePayment(event, 'APPROVED')">
            <div class="form-group">
                <label>Numéro de Carte (16 chiffres)</label>
                <input type="text" value="6280 4400 1234 5678" readonly>
            </div>

            <div class="row">
                <div class="form-group" style="flex: 2;">
                    <label>Date d'expiration</label>
                    <input type="text" value="12/28" readonly>
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>CVV2</label>
                    <input type="password" value="123" readonly>
                </div>
            </div>

            <div class="form-group">
                <label>Nom du Porteur</label>
                <input type="text" value="MAHMOUD ALGERIE" readonly>
            </div>

            <button type="submit" class="btn-pay" id="btn-submit">
                ✓ Valider le Paiement (Simulation SATIM)
            </button>

            <button type="button" class="btn-cancel" onclick="handlePayment(event, 'DECLINED')">
                ✕ Simuler un Refus / Annulation
            </button>
        </form>

        <div id="result-box"></div>

        <div class="security-footer">
            🔒 Transaction protégée par protocole 3D-Secure SATIM • Algérie Poste & Banques Algériennes
        </div>
    </div>

    <script>
        async function handlePayment(e, status) {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            const resultBox = document.getElementById('result-box');
            btn.disabled = true;
            btn.innerText = 'Traitement en cours...';

            try {
                const res = await fetch('/api/v1/payments/satim/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        order_id: '{{ $orderId }}',
                        amount: 15000,
                        status: status,
                        response_code: status === 'APPROVED' ? '00' : '05'
                    })
                });

                const data = await res.json();
                resultBox.style.display = 'block';

                if (status === 'APPROVED') {
                    resultBox.style.background = '#dcfce7';
                    resultBox.style.color = '#15803d';
                    resultBox.innerText = 'Paiement validé avec succès ! Accès au cours activé. Redirection...';
                    setTimeout(() => {
                        window.location.href = '/courses';
                    }, 1500);
                } else {
                    resultBox.style.background = '#fee2e2';
                    resultBox.style.color = '#b91c1c';
                    resultBox.innerText = 'Paiement rejeté ou annulé.';
                    btn.disabled = false;
                    btn.innerText = 'Réessayer';
                }
            } catch (err) {
                resultBox.style.display = 'block';
                resultBox.style.background = '#fee2e2';
                resultBox.style.color = '#b91c1c';
                resultBox.innerText = 'Erreur technique de communication : ' + err.message;
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>
