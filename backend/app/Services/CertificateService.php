<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\InstituteSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class CertificateService
{
    /**
     * Issue a certificate for a completed enrollment
     */
    public function issueCertificate(Enrollment $enrollment): Certificate
    {
        if ($enrollment->certificate) {
            return $enrollment->certificate;
        }

        $code = 'CERT-' . date('Y') . '-' . strtoupper(Str::random(6));

        $certificate = Certificate::create([
            'certificate_code' => $code,
            'enrollment_id' => $enrollment->id,
            'trainee_id' => $enrollment->trainee_id,
            'course_id' => $enrollment->course_id,
            'trainee_name' => $enrollment->trainee->name,
            'course_title' => $enrollment->course->title,
            'issued_date' => now()->toDateString(),
        ]);

        $enrollment->update([
            'certificate_issued' => true,
            'certificate_id' => $code,
        ]);

        return $certificate;
    }

    /**
     * Generate PDF binary stream for a certificate
     */
    public function generatePdf(Certificate $certificate)
    {
        $settings = InstituteSetting::allCached();
        $instituteName = $settings['institute_name'] ?? 'EduTech Starter';

        $data = [
            'certificate' => $certificate,
            'instituteName' => $instituteName,
            'traineeName' => $certificate->trainee_name,
            'courseTitle' => $certificate->course_title,
            'issuedDate' => $certificate->issued_date->format('d/m/Y'),
            'code' => $certificate->certificate_code,
            'verifyUrl' => url('/api/v1/certificates/' . $certificate->certificate_code),
        ];

        return Pdf::loadView('certificates.template', $data)
            ->setPaper('a4', 'landscape');
    }
}
