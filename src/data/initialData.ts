import { User, Course, PaymentReceipt, Enrollment, FAQItem, Testimonial } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'د. أحمد منصور',
    email: 'admin@academy.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+20 100 123 4567',
    bio: 'مدير الأكاديمية والمدير التنفيذي لبرامج التدريب والتأهيل المهني.',
    specialization: 'إدارة التعليم والتطوير المؤسسي',
    createdAt: '2025-01-01T08:00:00.000Z'
  },
  {
    id: 'user_inst_1',
    name: 'م. طارق فاروق',
    email: 'tarek@academy.com',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+20 111 234 5678',
    bio: 'خبير تطوير برمجيات بمهندس حلول سابق في شركات تقنية عالمية بأكثر من 12 عاماً خبرة.',
    specialization: 'تطوير الويب المتقدم والنظم الموزعة',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'user_inst_2',
    name: 'د. سارة عبد الله',
    email: 'sara@academy.com',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+20 122 345 6789',
    bio: 'باحثة واستشارية في علم البيانات والذكاء الاصطناعي، حاصلة على الدكتوراه في علوم الحاسب.',
    specialization: 'تعلم الآلة وتحليل البيانات المتقدم',
    createdAt: '2025-01-15T12:00:00.000Z'
  },
  {
    id: 'user_trainee_1',
    name: 'محمود حسن',
    email: 'mahmoud@gmail.com',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+20 101 987 6543',
    bio: 'مهندس حاسبات شغوف بتعلم برمجة Full Stack والتحول الرقمي.',
    createdAt: '2025-02-01T09:30:00.000Z'
  },
  {
    id: 'user_trainee_2',
    name: 'آية الكردي',
    email: 'aya@gmail.com',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+20 109 876 5432',
    bio: 'مصممة جرافيك متطلعة للاحتراف في مجال تصميم تجربة المستخدم UI/UX.',
    createdAt: '2025-02-05T14:20:00.000Z'
  },
  {
    id: 'user_trainee_3',
    name: 'عمر خالد',
    email: 'omar.khaled@gmail.com',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+20 102 334 5566',
    bio: 'مطوّر واجهات مبتدئ يسعى لاحتراف React & Node.js',
    createdAt: '2025-02-12T11:00:00.000Z'
  },
  {
    id: 'user_trainee_4',
    name: 'نور الدين علي',
    email: 'nour.ali@outlook.com',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+20 115 443 2211',
    bio: 'مهتم بعلوم البيانات وتحليل النظم الاستثمارية',
    createdAt: '2025-02-14T16:45:00.000Z'
  }
];

export const PAYMENT_METHODS_CONFIG = {
  instapay: {
    title: 'InstaPay (إنستا باي)',
    handle: 'academy@instapay',
    accountName: 'أكاديمية التعلم للتدريب الإلكتروني',
    phone: '01001234567',
    iconColor: 'bg-purple-600',
    instructions: 'قم بتحويل المبلغ المطلوب عبر تطبيق InstaPay إلى عنوان الدفع اللحظي أو رقم التليفون الموضح، ثم احفظ إيصال التحويل ورقم العملية.'
  },
  vodafone_cash: {
    title: 'Vodafone Cash (فودافون كاش)',
    phone: '01099887766',
    accountName: 'أكاديمية التعلم المعتمدة',
    iconColor: 'bg-red-600',
    instructions: 'قم بتحويل قيمة الدورة من محفظتك إلى الرقم 01099887766 عبر كود *9*7# أو تطبيق أنا فودافون، ثم خذ لقطة شاشة للرسالة التأكيدية.'
  },
  fawry: {
    title: 'Fawry (فوري)',
    serviceCode: '98452',
    accountName: 'كود خدمة أكاديمية التعلم',
    iconColor: 'bg-amber-500',
    instructions: 'توجه لأقرب منفذ فوري واطلب دفع خدمة "أكاديمية التعلم" بكود الخدمة (98452) باستخدام رقم هاتفك المسجل لدينا، واحتفظ بإيصال فوري.'
  }
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_fullstack',
    title: 'الدبلومة الشاملة لتطوير تطبيقات الويب (Full-Stack Web Development)',
    slug: 'fullstack-web-development',
    description: 'تعلم بناء تطبيقات الويب الحديثة والمتكاملة من الصفر حتى الاحتراف باستخدام React, Node.js, TypeScript, PostgreSQL و REST APIs.',
    fullDescription: 'تهدف هذه الدبلومة التدريبية المكثفة إلى إعدادك كمهندس تطوير تطبيقات متكامل (Full-Stack Developer) قادر على بناء منصات ومواقع ويب احترافية، آمنة ومتحملة للضغط العالي. تغطي الدبلومة أساسيات HTML5, CSS3, TailwindCSS, JavaScript ES6+, TypeScript, React 19, Node.js, Express, بالإضافة إلى قواعد البيانات وحلول النشر والتطوير على خوادم Cloud & VPS.',
    category: 'برمجة وتطوير',
    level: 'جميع المستويات',
    price: 3500,
    originalPrice: 5000,
    durationHours: 60,
    lessonsCount: 42,
    instructorId: 'user_inst_1',
    instructorName: 'م. طارق فاروق',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    rating: 4.9,
    reviewsCount: 128,
    studentsCount: 342,
    isPublished: true,
    createdAt: '2025-01-10T12:00:00.000Z',
    prerequisites: [
      'معرفة أساسية بمهارات استخدام الحاسوب',
      'الإلمام باللغة الإنجليزية في حدها الأدنى'
    ],
    learningOutcomes: [
      'بناء واجهات مستخدم تفاعلية وجذابة باستخدام React & TailwindCSS',
      'تطوير سيرفرات مخصصة وقواعد بيانات علاقية باستخدام Express & Node.js',
      'إدارة أمان البيانات وعمليات المصادقة (Auth & Roles)',
      'نشر التطبيقات على خوادم VPS وإعداد النطاق وشهادة SSL'
    ],
    modules: [
      {
        id: 'mod_1',
        title: 'الوحدة الأولى: أساسيات الويب الحديثة و React 19',
        lessons: [
          {
            id: 'les_1',
            title: 'المقدمة وهيكلة بيئة العمل وتطبيقات الويب الحديثة',
            duration: '25 دقيقة',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isFreePreview: true,
            description: 'تعرف على خارطة الطريق والأدوات المطلوبة لبدء الدورة بشكل احترافي.'
          },
          {
            id: 'les_2',
            title: 'أساسيات TailwindCSS و بناء واجهات متجاوبة RTL',
            duration: '45 دقيقة',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isFreePreview: true,
            description: 'شرح مفصل لبناء صفحات سريعة ومتوافقة مع الهواتف والشاشات المختلفة.'
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'الوحدة الثانية: بناء السيرفر وقواعد البيانات ونشر المشروع',
        lessons: [
          {
            id: 'les_3',
            title: 'إنشاء APIs باستخدام Express & Node.js',
            duration: '50 دقيقة',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isFreePreview: false,
            description: 'ربط الواجهة الأمامية بالخلفية وإدارة الطلبات واستجابات JSON.'
          },
          {
            id: 'les_4',
            title: 'إعداد خادم VPS والنشر النهائي مع Nginx & SSL',
            duration: '60 دقيقة',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isFreePreview: false,
            description: 'خطوات إعداد الخادم الحقيقي وربط الدومين مع شهادة التشفير SSL.'
          }
        ]
      }
    ],
    attachments: [
      {
        id: 'att_1',
        name: 'دليل_تأهيل_مطور_الويب_المتكامل.pdf',
        size: '3.4 MB',
        type: 'pdf',
        url: '#',
        uploadedAt: '2025-01-12T10:00:00.000Z'
      },
      {
        id: 'att_2',
        name: 'قوالب_المشروعات_واختبارات_الكود.zip',
        size: '12.8 MB',
        type: 'zip',
        url: '#',
        uploadedAt: '2025-01-15T14:30:00.000Z'
      }
    ]
  },
  {
    id: 'course_ai_data',
    title: 'ذكاء الأعمال وتحليل البيانات المتقدم بـ Python & Power BI',
    slug: 'data-analysis-power-bi',
    description: 'تحويل البيانات الخام إلى رؤى استراتيجية ولوحات تحكم تفاعلية لاتخاذ القرارات باستخدام Python, Pandas, SQL & Power BI.',
    fullDescription: 'برنامج تدريبي متخصص يزودك بالمهارات العلمية والعملية اللازمة لتحليل البيانات واكتشاف الأنماط الإحصائية. ستتعلم استخراج البيانات من مصادر متعددة، تنظيفها وترتيبها بـ Python، وإعداد التقارير الديناميكية بـ Power BI للشركات والمؤسسات.',
    category: 'بيانات وذكاء اصطناعي',
    level: 'متوسط',
    price: 2800,
    originalPrice: 4200,
    durationHours: 45,
    lessonsCount: 30,
    instructorId: 'user_inst_2',
    instructorName: 'د. سارة عبد الله',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    rating: 4.8,
    reviewsCount: 94,
    studentsCount: 215,
    isPublished: true,
    createdAt: '2025-01-15T10:00:00.000Z',
    prerequisites: [
      'أساسيات التعامل مع برنامج Excel',
      'التفكير التحليلي والمنطقي'
    ],
    learningOutcomes: [
      'معالجة البيانات الضخمة وتنظيفها باستخدام Python Pandas & NumPy',
      'كتابة استعلامات SQL متقدمة لاستخراج واستعلام قواعد البيانات',
      'بناء Dashboards تفاعلية ولوحات قيادة بـ Power BI'
    ],
    modules: [
      {
        id: 'mod_ai_1',
        title: 'الوحدة الأولى: أساسيات Python وتجميع البيانات',
        lessons: [
          {
            id: 'les_ai_1',
            title: 'مقدمة في علم البيانات وأدوات الملاحظة Jupyter',
            duration: '30 دقيقة',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isFreePreview: true
          }
        ]
      }
    ],
    attachments: [
      {
        id: 'att_ai_1',
        name: 'ملفات_البيانات_التدريبية_Superstore.xlsx',
        size: '5.1 MB',
        type: 'excel',
        url: '#',
        uploadedAt: '2025-01-18T09:00:00.000Z'
      }
    ]
  },
  {
    id: 'course_uiux',
    title: 'تصميم واجهات وتجربة المستخدم المحترفة - UI/UX Design Masterclass',
    slug: 'ui-ux-design-masterclass',
    description: 'تعلم منهجيات البحث، بناء رحلة المستخدم، Wireframing، وتصميم واجهات تطبيق ومواقع ويب جذابة بـ Figma.',
    fullDescription: 'تعلم كيف تفكر كمصمم تجربة مستخدم عالمي، واكتشف أسرار علم النفس السلوكي ونظرية الألوان وتوزيع العناصر البصرية لإنشاء تطبيقات سهلة الاستخدام وممتعة.',
    category: 'تصميم وجرافيك',
    level: 'مبتدئ',
    price: 2200,
    originalPrice: 3000,
    durationHours: 35,
    lessonsCount: 24,
    instructorId: 'user_inst_2',
    instructorName: 'د. سارة عبد الله',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    rating: 4.9,
    reviewsCount: 86,
    studentsCount: 198,
    isPublished: true,
    createdAt: '2025-01-20T11:00:00.000Z',
    prerequisites: ['لا تتطلب خبرة سابقة في التصميم'],
    learningOutcomes: [
      'فهم سلوك ورغبات المستخدمين وتصميم Wireframes و Prototypes',
      'احتراف استخدام Figma وإنشاء Design Systems قابلة للتوسع'
    ],
    modules: [],
    attachments: []
  },
  {
    id: 'course_digital_marketing',
    title: 'التسويق الرقمي وإدارة الحملات الإعلانية - Digital Marketing',
    slug: 'digital-marketing-mastery',
    description: 'تخطيط وإدارة الحملات الإعلانية الممولة على Meta, Google Ads, TikTok, وتحسين محركات البحث SEO.',
    fullDescription: 'دورة شاملة تغطي استراتيجيات التسويق عبر منصات التواصل الاجتماعي، كتابة المحتوى البيعي، الاستهداف الدقيق للعملاء، وتتبع العائد على الاستثمار ROI.',
    category: 'تسويق وأعمال',
    level: 'جميع المستويات',
    price: 1900,
    originalPrice: 2800,
    durationHours: 30,
    lessonsCount: 20,
    instructorId: 'user_inst_1',
    instructorName: 'م. طارق فاروق',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    rating: 4.7,
    reviewsCount: 65,
    studentsCount: 154,
    isPublished: true,
    createdAt: '2025-01-22T08:00:00.000Z',
    prerequisites: ['معرفة أساسية بإنشاء شبكات التواصل الاجتماعي'],
    learningOutcomes: [
      'إطلاق حملات ناجحة بـ Google Ads & Facebook Ads Manager',
      'تحسين ظهور المواقع في محركات البحث SEO'
    ],
    modules: [],
    attachments: []
  }
];

export const INITIAL_PAYMENT_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'receipt_1',
    traineeId: 'user_trainee_1',
    traineeName: 'محمود حسن',
    traineeEmail: 'mahmoud@gmail.com',
    traineePhone: '+20 101 987 6543',
    courseId: 'course_fullstack',
    courseTitle: 'الدبلومة الشاملة لتطوير تطبيقات الويب (Full-Stack Web Development)',
    amount: 3500,
    method: 'instapay',
    senderAccountOrNumber: 'mahmoud@instapay',
    transactionRef: 'INSTA-88741259',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    submittedAt: '2025-02-10T14:30:00.000Z'
  },
  {
    id: 'receipt_2',
    traineeId: 'user_trainee_2',
    traineeName: 'آية الكردي',
    traineeEmail: 'aya@gmail.com',
    traineePhone: '+20 109 876 5432',
    courseId: 'course_uiux',
    courseTitle: 'تصميم واجهات وتجربة المستخدم المحترفة - UI/UX Design Masterclass',
    amount: 2200,
    method: 'vodafone_cash',
    senderAccountOrNumber: '01098765432',
    transactionRef: 'VODA-99382104',
    receiptImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    submittedAt: '2025-02-08T11:15:00.000Z',
    reviewedAt: '2025-02-08T12:00:00.000Z'
  },
  {
    id: 'receipt_3',
    traineeId: 'user_trainee_3',
    traineeName: 'عمر خالد',
    traineeEmail: 'omar.khaled@gmail.com',
    traineePhone: '+20 102 334 5566',
    courseId: 'course_fullstack',
    courseTitle: 'الدبلومة الشاملة لتطوير تطبيقات الويب (Full-Stack Web Development)',
    amount: 3500,
    method: 'instapay',
    senderAccountOrNumber: 'omar.k@instapay',
    transactionRef: 'INSTA-99218340',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    submittedAt: '2025-02-12T11:20:00.000Z',
    reviewedAt: '2025-02-12T11:45:00.000Z'
  },
  {
    id: 'receipt_4',
    traineeId: 'user_trainee_4',
    traineeName: 'نور الدين علي',
    traineeEmail: 'nour.ali@outlook.com',
    traineePhone: '+20 115 443 2211',
    courseId: 'course_ai_data',
    courseTitle: 'ذكاء الأعمال وتحليل البيانات المتقدم بـ Python & Power BI',
    amount: 2800,
    method: 'fawry',
    senderAccountOrNumber: 'Ref# 98452109',
    transactionRef: 'FAWRY-77319022',
    receiptImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    submittedAt: '2025-02-14T17:00:00.000Z',
    reviewedAt: '2025-02-14T17:30:00.000Z'
  },
  {
    id: 'receipt_5',
    traineeId: 'user_trainee_1',
    traineeName: 'محمود حسن',
    traineeEmail: 'mahmoud@gmail.com',
    traineePhone: '+20 101 987 6543',
    courseId: 'course_digital_marketing',
    courseTitle: 'التسويق الرقمي وإدارة الحملات الإعلانية - Digital Marketing',
    amount: 1900,
    method: 'vodafone_cash',
    senderAccountOrNumber: '01019876543',
    transactionRef: 'VODA-11209844',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    submittedAt: '2025-02-15T09:10:00.000Z'
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll_1',
    traineeId: 'user_trainee_2',
    courseId: 'course_uiux',
    status: 'approved',
    paymentReceiptId: 'receipt_2',
    enrolledAt: '2025-02-08T12:00:00.000Z',
    progressPercent: 35,
    completedLessons: ['les_1'],
    certificateIssued: false
  },
  {
    id: 'enroll_2',
    traineeId: 'user_trainee_1',
    courseId: 'course_fullstack',
    status: 'pending',
    paymentReceiptId: 'receipt_1',
    enrolledAt: '2025-02-10T14:30:00.000Z',
    progressPercent: 0,
    completedLessons: [],
    certificateIssued: false
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'التسجيل',
    question: 'كيف يمكنني التسجيل في أحد الدورات التدريبية؟',
    answer: 'يمكنك اختيار الدورة المطلوبة من صفحة "الدورات"، ثم الضغط على زر "اشترك الآن"، واتباع خطوات الدفع اليدوي بإرسال قيمة المبلغ عبر InstaPay أو Vodafone Cash أو Fawry ورفع صورة إيصال الدفع.'
  },
  {
    id: 'faq_2',
    category: 'طرق الدفع',
    question: 'ما هي طرق الدفع المتاحة وكيف يتم تأكيد اشتراكي؟',
    answer: 'نوفر طرق دفع محلي يدوي مريحة: InstaPay (إنستا باي)، Vodafone Cash (فودافون كاش)، وكود خدمة Fawry (فوري). بعد رفع إيصال التحويل، يقوم فريق الإدارة بمراجعته وتفعيل الدورة في حسابك خلال أقل من ساعة.'
  },
  {
    id: 'faq_3',
    category: 'شهادات الأكاديمية',
    question: 'هل يحصل المتدرب على شهادة بعد إتمام الدورة؟',
    answer: 'نعم! يحصل جميع المتدربين الذين يكملون نسبة 80% وأكثر من الدروس على شهادة تخرج معتمدة برقم تسلسلي مخصص ورمز QR يمكن طباعته أو مشاركته على LinkedIn.'
  },
  {
    id: 'faq_4',
    category: 'الدعم الفني',
    question: 'هل يمكنني التواصل المباشر مع مدرب الدورة؟',
    answer: 'نعم، تحتوي كل دورة على مرفقات تواصل وملفات تفاعلية بالإضافة لمنتدى الملاحظات والاستفسارات المباشرة مع المدرب.'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'مهندس عمر الشريف',
    role: 'خريج دبلومة Web Development',
    courseName: 'Full-Stack Development',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    comment: 'تجربة ممتازة جداً! التطبيق العملي والدعم المستمر من المهندس طارق مكنني من الحصول على أول وظيفة كـ Full-Stack Developer في أقل من شهرين.',
    rating: 5
  },
  {
    id: 'test_2',
    name: 'م. مريم الفقي',
    role: 'متدربة في دورة UI/UX',
    courseName: 'UI/UX Masterclass',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    comment: 'الشرح سلس والمنهج منظم بعناية. الشراكة بين النظرية والتطبيق ببرنامج Figma جعلتني أبني معرض أعمال احترافي جذاب.',
    rating: 5
  },
  {
    id: 'test_3',
    name: 'أحمد القاضي',
    role: 'محلل بيانات بشركة استشارات',
    courseName: 'Data Analysis & Power BI',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    comment: 'سهولة التسجيل وتفعيل الاشتراك عبر InstaPay كانت سريعة للغاية، والمحتوى التعليمي من الدكتورة سارة فوق الممتاز.',
    rating: 5
  }
];
