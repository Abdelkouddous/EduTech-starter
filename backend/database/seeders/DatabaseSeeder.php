<?php

namespace Database\Seeders;

use App\Models\AcademicTerm;
use App\Models\Certificate;
use App\Models\Cohort;
use App\Models\CohortAnnouncement;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\InstituteSetting;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\PaymentReceipt;
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
            'institute_name' => 'أكاديمية التعلم - منصة التدريب الإلكتروني',
            'institute_tagline' => 'صرح التدريب والتعليم المهني المعتمد للأفراد والمؤسسات',
            'institute_description' => 'منصة متخصصة في تقديم دبلومات تدريبية مكثفة وبرامج تأهيل مهني متوافقة مع متطلبات سوق العمل.',
            'primary_color' => '#2563eb',
            'accent_color' => '#f59e0b',
            'logo_url' => '/assets/logo.png',
            'currency_code' => 'EGP',
            'currency_symbol' => 'ج.م',
            'contact_email' => 'admin@academy.com',
            'contact_phone' => '+20 100 123 4567',
            'whatsapp_number' => '+201001234567',
            'default_video_driver' => 'embedded', // embedded, youtube, vimeo, bunny
            'allow_manual_receipts' => true,
            'allow_announcement_feeds' => true,
            'auto_issue_certificates' => true,
            'offline_payment_methods' => [
                'instapay' => [
                    'name' => 'InstaPay (إنستاباي)',
                    'account' => 'academy@instapay',
                    'receiver' => 'أكاديمية التعلم للتدريب والتطوير'
                ],
                'vodafone_cash' => [
                    'name' => 'Vodafone Cash (فودافون كاش)',
                    'account' => '01001234567',
                    'receiver' => 'حساب التحويلات المالية للأكاديمية'
                ],
                'fawry' => [
                    'name' => 'Fawry (فوري)',
                    'account' => '98452',
                    'receiver' => 'كود خدمة أكاديمية التعلم'
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
    }
}
