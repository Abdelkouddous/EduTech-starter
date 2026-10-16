<?php

namespace Database\Seeders;

use App\Models\AcademicTerm;
use App\Models\AvailabilitySlot;
use App\Models\Certificate;
use App\Models\Cohort;
use App\Models\CohortAnnouncement;
use App\Models\ConsultationBooking;
use App\Models\ConsultationType;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\InstituteSetting;
use App\Models\Invoice;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\PaymentReceipt;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions setup
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $instructorRole = Role::firstOrCreate(['name' => 'instructor']);
        $traineeRole = Role::firstOrCreate(['name' => 'trainee']);

        // 2. White-Label Settings (EDU-02)
        $settings = [
            'institute_name' => 'EduTech Starter',
            'institute_tagline' => "Plateforme d'Apprentissage & Formation Professionnelle | منصة التدريب والتأهيل الإلكتروني",
            'institute_description' => 'Plateforme complète de formation professionnelle et de certifications pour instituts et académies.',
            'primary_color' => '#2563eb',
            'accent_color' => '#10b981',
            'logo_url' => '/assets/logo.png',
            'currency_code' => 'DZD',
            'currency_symbol' => 'د.ج',
            'contact_email' => 'contact@edutech-starter.com',
            'contact_phone' => '+213 555 123 456',
            'whatsapp_number' => '+213555123456',
            'default_video_driver' => 'embedded', // embedded, youtube, vimeo, bunny
            'allow_manual_receipts' => true,
            'allow_announcement_feeds' => true,
            'auto_issue_certificates' => true,
            'offline_payment_methods' => [
                'baridimob' => [
                    'name' => 'BaridiMob (بريدي موب)',
                    'account' => 'RIP: 00799999000123456789',
                    'receiver' => 'EduTech Starter Algérie'
                ],
                'ccp' => [
                    'name' => 'Compte CCP (الحساب البريدي الجاري)',
                    'account' => 'CCP: 12345678 Clé 99',
                    'receiver' => 'Algérie Poste - EduTech Starter'
                ],
                'edahabia' => [
                    'name' => 'Carte Edahabia / CIB (البطاقة الذهبية)',
                    'account' => 'Virement Bancaire / CIB',
                    'receiver' => 'Paiement Sécurisé'
                ]
            ]
        ];

        foreach ($settings as $key => $val) {
            InstituteSetting::set($key, $val, 'general');
        }

        // 3. Initial Users (EDU-01)
        $admin = User::firstOrCreate(
            ['email' => 'admin@academy.com'],
            [
                'name' => 'د. أحمد منصور',
                'password' => Hash::make('password123'),
                'phone' => '+20 100 123 4567',
                'role' => 'admin',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'bio' => 'مدير الأكاديمية والمدير التنفيذي لبرامج التدريب والتأهيل المهني.',
                'specialization' => 'إدارة التعليم والتطوير المؤسسي',
            ]
        );
        $admin->assignRole($adminRole);

        $inst1 = User::firstOrCreate(
            ['email' => 'tarek@academy.com'],
            [
                'name' => 'م. طارق فاروق',
                'password' => Hash::make('password123'),
                'phone' => '+20 111 234 5678',
                'role' => 'instructor',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'bio' => 'خبير تطوير برمجيات ومهندس حلول سابق في شركات تقنية عالمية بأكثر من 12 عاماً خبرة.',
                'specialization' => 'تطوير الويب المتقدم والنظم الموزعة',
            ]
        );
        $inst1->assignRole($instructorRole);

        $inst2 = User::firstOrCreate(
            ['email' => 'sara@academy.com'],
            [
                'name' => 'د. سارة عبد الله',
                'password' => Hash::make('password123'),
                'phone' => '+20 122 345 6789',
                'role' => 'instructor',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'bio' => 'باحثة واستشارية في علم البيانات والذكاء الاصطناعي، حاصلة على الدكتوراه في علوم الحاسب.',
                'specialization' => 'تعلم الآلة وتحليل البيانات المتقدم',
            ]
        );
        $inst2->assignRole($instructorRole);

        $trainee1 = User::firstOrCreate(
            ['email' => 'mahmoud@gmail.com'],
            [
                'name' => 'محمود حسن',
                'password' => Hash::make('password123'),
                'phone' => '+20 101 987 6543',
                'role' => 'trainee',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'bio' => 'مهندس حاسبات شغوف بتعلم برمجة Full Stack والتحول الرقمي.',
            ]
        );
        $trainee1->assignRole($traineeRole);

        $trainee2 = User::firstOrCreate(
            ['email' => 'aya@gmail.com'],
            [
                'name' => 'آية الكردي',
                'password' => Hash::make('password123'),
                'phone' => '+20 109 876 5432',
                'role' => 'trainee',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'bio' => 'مصممة جرافيك متطلعة للاحتراف في مجال تصميم تجربة المستخدم UI/UX.',
            ]
        );
        $trainee2->assignRole($traineeRole);

        // 4. Academic Terms (EDU-01)
        $termFall = AcademicTerm::firstOrCreate(
            ['code' => 'FALL-2025'],
            [
                'name' => 'فصل الخريف الأكاديمي 2025',
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-30',
                'is_active' => true,
            ]
        );

        $termSpring = AcademicTerm::firstOrCreate(
            ['code' => 'SPRING-2026'],
            [
                'name' => 'فصل الربيع الأكاديمي 2026',
                'start_date' => '2026-02-01',
                'end_date' => '2026-06-30',
                'is_active' => true,
            ]
        );

        // 5. Courses (EDU-01)
        $course1 = Course::firstOrCreate(
            ['slug' => 'fullstack-web-development'],
            [
                'title' => 'الدبلومة الشاملة لتطوير تطبيقات الويب (Full-Stack Web Development)',
                'description' => 'تعلم بناء تطبيقات الويب الحديثة والمتكاملة من الصفر حتى الاحتراف باستخدام React, Node.js, TypeScript, PostgreSQL و REST APIs.',
                'full_description' => 'تهدف هذه الدبلومة التدريبية المكثفة إلى إعدادك كمهندس تطوير تطبيقات متكامل (Full-Stack Developer) قادر على بناء منصات ومواقع ويب احترافية، آمنة ومتحملة للضغط العالي.',
                'category' => 'برمجة وتطوير',
                'level' => 'جميع المستويات',
                'price' => 3500.00,
                'original_price' => 5000.00,
                'duration_hours' => 60,
                'instructor_id' => $inst1->id,
                'cover_image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
                'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'rating' => 4.90,
                'reviews_count' => 128,
                'students_count' => 342,
                'is_published' => true,
                'prerequisites' => ['معرفة أساسية بمهارات استخدام الحاسوب', 'الإلمام باللغة الإنجليزية في حدها الأدنى'],
                'learning_outcomes' => [
                    'بناء واجهات مستخدم تفاعلية وجذابة باستخدام React & TailwindCSS',
                    'تطوير سيرفرات مخصصة وقواعد بيانات علاقية باستخدام Express & Node.js',
                    'إدارة أمان البيانات وعمليات المصادقة (Auth & Roles)',
                    'نشر التطبيقات على خوادم VPS وإعداد النطاق وشهادة SSL'
                ],
            ]
        );

        $course2 = Course::firstOrCreate(
            ['slug' => 'data-science-ai-python'],
            [
                'title' => 'دبلومة علم البيانات والذكاء الاصطناعي التطبيقي مع بايثون (Data Science & AI)',
                'description' => 'احتراف تحليل البيانات الضخمة، بناء نماذج التعلم الآلي والشبكات العصبية باستخدام Python, Pandas, Scikit-Learn و PyTorch.',
                'full_description' => 'دبلومة عملية تركز على تأهيلك لسوق عمل علم البيانات والذكاء الاصطناعي مع مشاريع واقعية في تحليل بيانات الأعمال وبناء أنظمة التوصية والتنبؤ.',
                'category' => 'ذكاء اصطناعي وبيانات',
                'level' => 'متوسط',
                'price' => 3800.00,
                'original_price' => 5500.00,
                'duration_hours' => 55,
                'instructor_id' => $inst2->id,
                'cover_image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
                'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'rating' => 4.95,
                'reviews_count' => 95,
                'students_count' => 210,
                'is_published' => true,
                'prerequisites' => ['أساسيات لغة بايثون', 'مفاهيم الجبر الخطي والإحصاء الأساسية'],
                'learning_outcomes' => [
                    'تنظيف وتحليل البيانات واستخراج الرؤى التحليلية',
                    'بناء نماذج Machine Learning متقدمة',
                    'بناء ونشر نماذج Deep Learning'
                ],
            ]
        );

        // Modules & Lessons for Course 1
        $mod1 = CourseModule::firstOrCreate(
            ['course_id' => $course1->id, 'title' => 'الوحدة الأولى: أساسيات الويب الحديثة و React 19'],
            ['order' => 1]
        );
        $lesson1 = Lesson::firstOrCreate(
            ['module_id' => $mod1->id, 'title' => 'المقدمة وهيكلة بيئة العمل وتطبيقات الويب الحديثة'],
            [
                'duration' => '25 دقيقة',
                'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'video_driver' => 'embedded',
                'is_free_preview' => true,
                'description' => 'تعرف على خارطة الطريق والأدوات المطلوبة لبدء الدورة بشكل احترافي.',
                'order' => 1
            ]
        );
        $lesson2 = Lesson::firstOrCreate(
            ['module_id' => $mod1->id, 'title' => 'أساسيات TailwindCSS وبناء واجهات متجاوبة RTL'],
            [
                'duration' => '45 دقيقة',
                'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'video_driver' => 'embedded',
                'is_free_preview' => true,
                'description' => 'شرح مفصل لبناء صفحات سريعة ومتوافقة مع الهواتف والشاشات المختلفة.',
                'order' => 2
            ]
        );

        $mod2 = CourseModule::firstOrCreate(
            ['course_id' => $course1->id, 'title' => 'الوحدة الثانية: بناء السيرفر وقواعد البيانات ونشر المشروع'],
            ['order' => 2]
        );
        $lesson3 = Lesson::firstOrCreate(
            ['module_id' => $mod2->id, 'title' => 'إنشاء APIs باستخدام Express & Node.js'],
            [
                'duration' => '50 دقيقة',
                'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'video_driver' => 'embedded',
                'is_free_preview' => false,
                'description' => 'ربط الواجهة الأمامية بالخلفية وإدارة الطلبات واستجابات JSON.',
                'order' => 1
            ]
        );
        $lesson4 = Lesson::firstOrCreate(
            ['module_id' => $mod2->id, 'title' => 'إعداد خادم VPS والنشر النهائي مع Nginx & SSL'],
            [
                'duration' => '60 دقيقة',
                'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'video_driver' => 'embedded',
                'is_free_preview' => false,
                'description' => 'خطوات إعداد الخادم الحقيقي وربط الدومين مع شهادة التشفير SSL.',
                'order' => 2
            ]
        );

        // 6. Cohorts & Announcements with Meet Links (EDU-01 senior decision)
        $cohort1 = Cohort::firstOrCreate(
            ['course_id' => $course1->id, 'name' => 'دفعة خريف 2025 - النخبة البرمجية'],
            [
                'academic_term_id' => $termFall->id,
                'capacity' => 40,
                'start_date' => '2025-10-01',
                'end_date' => '2025-12-25',
                'is_active' => true,
            ]
        );

        CohortAnnouncement::firstOrCreate(
            ['cohort_id' => $cohort1->id, 'title' => 'ترحيب بالمتدربين وموعد جلسة التعارف المباشرة عبر Google Meet'],
            [
                'instructor_id' => $inst1->id,
                'content' => 'أهلاً وسهلاً بجميع متدربي الدفعة الجديدة. يسعدني انطلاق رحلتنا التدريبية. يرجى الانضمام للجلسة التمهيدية عبر الرابط المرفق للإجابة عن استفساراتكم ومناقشة بيئة التطوير.',
                'meeting_url' => 'https://meet.google.com/abc-edut-ech',
                'scheduled_at' => now()->addDays(2),
                'is_pinned' => true,
            ]
        );

        // 7. Payment Receipts & Enrollments (EDU-03 & EDU-05 demo data)
        $receipt1 = PaymentReceipt::firstOrCreate(
            ['transaction_ref' => 'INSTA-9872615'],
            [
                'trainee_id' => $trainee1->id,
                'course_id' => $course1->id,
                'cohort_id' => $cohort1->id,
                'amount' => 3500.00,
                'method' => 'instapay',
                'sender_account_or_number' => 'mahmoud@instapay',
                'receipt_image_path' => 'receipts/demo_receipt_1.png',
                'status' => 'approved',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now()->subDays(5),
            ]
        );

        $enrollment1 = Enrollment::firstOrCreate(
            ['trainee_id' => $trainee1->id, 'course_id' => $course1->id, 'cohort_id' => $cohort1->id],
            [
                'payment_receipt_id' => $receipt1->id,
                'status' => 'approved',
                'progress_percent' => 50,
                'enrolled_at' => now()->subDays(5),
            ]
        );

        LessonProgress::firstOrCreate(
            ['enrollment_id' => $enrollment1->id, 'lesson_id' => $lesson1->id],
            ['is_completed' => true, 'completed_at' => now()->subDays(4)]
        );
        LessonProgress::firstOrCreate(
            ['enrollment_id' => $enrollment1->id, 'lesson_id' => $lesson2->id],
            ['is_completed' => true, 'completed_at' => now()->subDays(2)]
        );

        // Certificate demo (EDU-05)
        Certificate::firstOrCreate(
            ['certificate_code' => 'CERT-2025-0001'],
            [
                'enrollment_id' => $enrollment1->id,
                'trainee_id' => $trainee1->id,
                'course_id' => $course1->id,
                'trainee_name' => $trainee1->name,
                'course_title' => $course1->title,
                'issued_date' => now()->toDateString(),
                'pdf_path' => 'certificates/CERT-2025-0001.pdf',
            ]
        );

        // 8. Reviews (EDU-11, C4)
        Review::firstOrCreate(
            ['user_id' => $trainee1->id, 'course_id' => $course1->id],
            [
                'rating' => 5,
                'comment' => 'دورة استثنائية وشرح عملي ومبسط جداً، استفدت كثيراً من التطبيقات العملية وشهادة معتمدة ممتازة.',
                'is_approved' => true,
            ]
        );
        $course1->recalculateRating();

        // 9. Consultations & 1-on-1 Availability Slots (EDU-12, K1, K2)
        $consultationType1 = ConsultationType::firstOrCreate(
            ['slug' => 'career-guidance-fullstack'],
            [
                'specialist_id' => $inst1->id,
                'title' => 'جلسة استشارية وتوجيه مهني: مطور الويب المتكامل',
                'description' => 'جلسة خاصة 1-on-1 لمراجعة مسارك المهني، سيرتك الذاتية، وتحليل مشاريعك البرمجية لتأهيلك لسوق العمل والعمل الحر.',
                'duration_minutes' => 45,
                'price' => 4500.00,
                'is_active' => true,
            ]
        );

        $consultationType2 = ConsultationType::firstOrCreate(
            ['slug' => 'ai-ml-architecture-consultation'],
            [
                'specialist_id' => $inst2->id,
                'title' => 'استشارة تقنية متقدمة: هندسة وتدريب نماذج الذكاء الاصطناعي',
                'description' => 'جلسة استشارية متخصصة لحل مشاكل البيانات، اختيار خوارزميات الـ Machine Learning و Deep Learning ونشرها على السحابة.',
                'duration_minutes' => 60,
                'price' => 7000.00,
                'is_active' => true,
            ]
        );

        // Add availability slots for the upcoming days
        $slot1 = AvailabilitySlot::firstOrCreate(
            [
                'consultation_type_id' => $consultationType1->id,
                'start_time' => now()->addDays(2)->setHour(14)->setMinute(0)->setSecond(0),
            ],
            [
                'specialist_id' => $inst1->id,
                'end_time' => now()->addDays(2)->setHour(14)->setMinute(45)->setSecond(0),
                'is_booked' => false,
            ]
        );

        $slot2 = AvailabilitySlot::firstOrCreate(
            [
                'consultation_type_id' => $consultationType1->id,
                'start_time' => now()->addDays(3)->setHour(16)->setMinute(0)->setSecond(0),
            ],
            [
                'specialist_id' => $inst1->id,
                'end_time' => now()->addDays(3)->setHour(16)->setMinute(45)->setSecond(0),
                'is_booked' => false,
            ]
        );

        // 10. Electronic Invoices Demo (EDU-13, P7)
        Invoice::firstOrCreate(
            ['invoice_number' => 'INV-2026-0001'],
            [
                'trainee_id' => $trainee1->id,
                'payment_receipt_id' => $receipt1->id,
                'item_type' => 'course',
                'item_id' => $course1->id,
                'item_title' => $course1->title,
                'amount' => $receipt1->amount,
                'currency' => 'DZD',
                'payment_method' => 'instapay',
                'issued_at' => now()->subDays(5),
            ]
        );

        // 11. Promotional Discount Coupons (EDU-15, D7)
        Coupon::firstOrCreate(
            ['code' => 'EDUTECH20'],
            [
                'discount_type' => 'percentage',
                'discount_value' => 20.00,
                'max_uses' => 100,
                'used_count' => 12,
                'expires_at' => now()->addMonths(6),
                'is_active' => true,
            ]
        );

        Coupon::firstOrCreate(
            ['code' => 'DZPROMO1000'],
            [
                'discount_type' => 'fixed',
                'discount_value' => 1000.00,
                'max_uses' => 50,
                'used_count' => 4,
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
            ]
        );
    }
}
