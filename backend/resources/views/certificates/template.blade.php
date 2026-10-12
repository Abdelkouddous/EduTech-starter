<!DOCTYPE html>
<html dir="ltr" lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Certificat de Réussite - {{ $traineeName }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 35px;
            background-color: #f8fafc;
            color: #0f172a;
            text-align: center;
        }
        .border-outer {
            border: 8px double #1e3a8a;
            padding: 30px;
            background: #ffffff;
            border-radius: 14px;
            height: 90%;
            box-sizing: border-box;
            position: relative;
        }
        .republic-header {
            font-size: 11px;
            letter-spacing: 2px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .institute-title {
            font-size: 26px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .cert-badge {
            display: inline-block;
            background-color: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 4px;
        }
        .cert-title {
            font-size: 34px;
            color: #b45309;
            font-weight: 900;
            letter-spacing: 1px;
            margin: 22px 0 8px 0;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 15px;
            color: #475569;
            margin-bottom: 18px;
            font-style: italic;
        }
        .trainee-name {
            font-size: 32px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 2px solid #cbd5e1;
            display: inline-block;
            padding: 0 45px 8px 45px;
            margin-bottom: 18px;
        }
        .content {
            font-size: 15px;
            line-height: 1.7;
            color: #334155;
            max-width: 82%;
            margin: 0 auto 24px auto;
        }
        .course-title {
            font-weight: bold;
            color: #1e3a8a;
            font-size: 19px;
            display: block;
            margin: 6px 0;
        }
        .footer {
            margin-top: 25px;
            display: table;
            width: 100%;
        }
        .footer-col {
            display: table-cell;
            width: 33.33%;
            vertical-align: bottom;
        }
        .signature-line {
            border-top: 1px solid #94a3b8;
            width: 170px;
            margin: 12px auto 4px auto;
        }
        .cert-code-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cert-code-value {
            font-size: 13px;
            font-weight: bold;
            color: #1e3a8a;
            font-family: monospace;
            margin-top: 2px;
        }
        .verification-tag {
            font-size: 10px;
            color: #16a34a;
            font-weight: bold;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="border-outer">
        <div class="republic-header">République Algérienne Démocratique et Populaire</div>
        <div class="institute-title">{{ $instituteName }}</div>
        <div class="cert-badge">Établissement d'Enseignement & Formation Professionnelle Continue</div>

        <div class="cert-title">Certificat de Réussite</div>
        <div class="subtitle">La Direction Pédagogique atteste par la présente que :</div>

        <div class="trainee-name">{{ $traineeName }}</div>

        <div class="content">
            A suivi et validé avec succès l'ensemble du cursus théorique et pratique de la formation spécialisée :
            <span class="course-title">« {{ $courseTitle }} »</span>
            avec un taux d'assiduité et d'évaluation de 100%, et a fait preuve des compétences requises selon les normes académiques établies.
        </div>

        <div class="footer">
            <div class="footer-col" style="text-align: left; padding-left: 15px;">
                <div style="font-size: 12px; font-weight: bold; color: #334155;">Date de Délivrance :</div>
                <div style="margin-top: 4px; font-size: 13px; color: #0f172a;">{{ $issuedDate }}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Alger, Algérie</div>
            </div>

            <div class="footer-col">
                <div class="cert-code-label">Identifiant Numérique Officiel</div>
                <div class="cert-code-value">{{ $code }}</div>
                <div class="verification-tag">● Vérification Numérique Authentifiée</div>
            </div>

            <div class="footer-col" style="text-align: right; padding-right: 15px;">
                <div style="font-size: 12px; font-weight: bold; color: #334155;">Direction des Études & Certification</div>
                <div class="signature-line"></div>
                <div style="font-size: 11px; color: #64748b;">Cachet & Signature Électronique</div>
            </div>
        </div>
    </div>
</body>
</html>
