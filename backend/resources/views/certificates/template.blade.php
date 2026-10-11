<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>شهادة إتمام تدريب - {{ $traineeName }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #f8fafc;
            color: #1e293b;
            text-align: center;
        }
        .border-outer {
            border: 8px double #1e3a8a;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
            height: 90%;
            box-sizing: border-box;
            position: relative;
        }
        .header {
            margin-top: 10px;
        }
        .institute-title {
            font-size: 26px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
        }
        .cert-label {
            font-size: 18px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 5px;
        }
        .cert-title {
            font-size: 36px;
            color: #b45309;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }
        .subtitle {
            font-size: 16px;
            color: #475569;
            margin-bottom: 25px;
        }
        .trainee-name {
            font-size: 32px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 2px solid #cbd5e1;
            display: inline-block;
            padding: 0 40px 10px 40px;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.8;
            color: #334155;
            max-width: 80%;
            margin: 0 auto 30px auto;
        }
        .course-title {
            font-weight: bold;
            color: #1e3a8a;
            font-size: 18px;
        }
        .footer {
            margin-top: 30px;
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
            width: 160px;
            margin: 10px auto 5px auto;
        }
        .cert-code {
            font-size: 12px;
            color: #64748b;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="border-outer">
        <div class="header">
            <div class="institute-title">{{ $instituteName }}</div>
            <div class="cert-label">شهادة إتمام برنامج تدريبي معتمد</div>
        </div>

        <div class="cert-title">شهادة تفوق وإنجاز</div>
        <div class="subtitle">تشهد إدارة الأكاديمية بأن المتدرب:</div>

        <div class="trainee-name">{{ $traineeName }}</div>

        <div class="content">
            قد اجتاز بنجاح كافة المتطلبات التدريبية والتطبيقية المقررة في:
            <br/>
            <span class="course-title">{{ $courseTitle }}</span>
            <br/>
            بمعدل إنجاز 100% واستحق هذه الشهادة المعتمدة تقديراً لتميزه وجهوده.
        </div>

        <div class="footer">
            <div class="footer-col">
                <div style="font-weight: bold;">تاريخ الإصدار</div>
                <div style="margin-top: 5px;">{{ $issuedDate }}</div>
            </div>
            <div class="footer-col">
                <div class="cert-code">كود التحقق الرقمي:</div>
                <div class="cert-code" style="font-weight: bold; color: #1e3a8a;">{{ $code }}</div>
            </div>
            <div class="footer-col">
                <div style="font-weight: bold;">إدارة التدريب والتطوير</div>
                <div class="signature-line"></div>
                <div style="font-size: 13px; color: #64748b;">الختم والتوقيع الرسمي</div>
            </div>
        </div>
    </div>
</body>
</html>
