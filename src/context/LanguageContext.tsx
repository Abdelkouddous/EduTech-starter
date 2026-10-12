import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand
    brandName: 'EduTech Starter',
    brandTagline: 'منصة التدريب والتأهيل الإلكتروني المعتمد',
    
    // Nav
    navHome: 'الرئيسية',
    navCourses: 'دليل الدورات',
    navServices: 'خدمات المنصة',
    navAbout: 'عن الأكاديمية',
    navFAQ: 'الأسئلة الشائعة',
    navContact: 'تواصل معنا',
    navLogin: 'تسجيل الدخول',
    navRegister: 'إنشاء حساب',
    navDashboard: 'لوحة التحكم',
    navLogout: 'تسجيل الخروج',
    navProfile: 'الملف الأكاديمي والشهادات',

    // Hero
    heroBadge: '🇩🇿 صرح التدريب المعتمد في الجزائر والوطن العربي',
    heroTitle: 'ارتقِ بمسارك المهني مع برامج ودبلومات تدريبية معتمدة',
    heroSubtitle: 'تعلم أحدث المهارات العملية في البرمجة، التصميم، وإدارة الأعمال بإشراف نخبة من الخبراء والمدربين المعتمدين مع شهادات رقمية فورية.',
    heroStartLearning: 'ابدأ التعلم الآن',
    heroExploreCourses: 'استعراض الدليل الأكاديمي',
    heroStat1: 'متدرب نشط',
    heroStat2: 'دورة وبرنامج تدريبي',
    heroStat3: 'شهادة رقمية معتمدة',
    heroStat4: 'نسبة رضا الخريجين',

    // Course Section
    coursesTitle: 'الدورات والبرامج التدريبية المتاحة',
    coursesSubtitle: 'دبلومات مهنية متكاملة ومصممة لمواكبة متطلبات سوق العمل المعاصر',
    courseHours: 'ساعة تدريبية',
    courseLessons: 'درساً',
    courseInstructor: 'المدرب',
    courseDetails: 'تفاصيل البرنامج',
    courseEnroll: 'التسجيل والاشتراك',
    courseFreePreview: 'معاينة مجانية',
    currencyDZD: 'د.ج',

    // Payment
    paymentTitle: 'تأكيد التسجيل والدفع اليدوي',
    paymentNotice: 'طرق الدفع المتاحة في الجزائر: بريدي موب (BaridiMob)، حساب جاري (CCP)، أو بطاقة ذهبية (CIB)',
    paymentUploadReceipt: 'رفع صورة الإشعار أو وصل التحويل',
    paymentSubmit: 'إرسال الإشعار للمراجعة',

    // Study & Profile
    studyNotesTitle: 'مفكرة المذاكرة اللحظية',
    studyNotesSubtitle: 'دوّن ملخصاتك واربطها بدقيقة الشرح في المحاضرة',
    profileHubTitle: 'الملف الأكاديمي وحقيبة الإنجازات',
    verifiedCertificates: 'الشهادات الأكاديمية المعتمدة',
    paymentLedger: 'سجل إيصالات الدفع والتحويل',
    downloadPDF: 'تحميل PDF',
    verifyQR: 'توثيق رقمي QR',
  },
  fr: {
    // Brand
    brandName: 'EduTech Starter',
    brandTagline: "Plateforme d'Apprentissage & Formation Professionnelle Certifiée",

    // Nav
    navHome: 'Accueil',
    navCourses: 'Catalogue des Cours',
    navServices: 'Nos Services',
    navAbout: 'À Propos',
    navFAQ: 'FAQ',
    navContact: 'Contactez-nous',
    navLogin: 'Connexion',
    navRegister: 'Inscription',
    navDashboard: 'Tableau de Bord',
    navLogout: 'Déconnexion',
    navProfile: 'Profil & Certifications',

    // Hero
    heroBadge: '🇩🇿 Formation certifiée pour l’Algérie et l’International',
    heroTitle: 'Propulsez votre carrière avec des formations professionnelles certifiées',
    heroSubtitle: 'Maîtrisez les compétences clés du numérique, du développement et du management avec des experts reconnus et obtenez des diplômes vérifiables.',
    heroStartLearning: 'Commencer maintenant',
    heroExploreCourses: 'Explorer le catalogue',
    heroStat1: 'Apprenants actifs',
    heroStat2: 'Programmes certifiants',
    heroStat3: 'Certificats délivrés',
    heroStat4: 'Taux de satisfaction',

    // Course Section
    coursesTitle: 'Programmes de Formation Disponibles',
    coursesSubtitle: 'Des cursus complets conçus pour répondre aux besoins concrets du marché du travail',
    courseHours: 'heures',
    courseLessons: 'leçons',
    courseInstructor: 'Formateur',
    courseDetails: 'Détails du cours',
    courseEnroll: "S'inscrire au cours",
    courseFreePreview: 'Aperçu gratuit',
    currencyDZD: 'DZD',

    // Payment
    paymentTitle: "Validation d'inscription et Paiement",
    paymentNotice: 'Paiement disponible en Algérie via BaridiMob, CCP ou virement sécurisé (Edahabia/CIB)',
    paymentUploadReceipt: 'Téléverser le reçu de versement',
    paymentSubmit: 'Envoyer pour validation',

    // Study & Profile
    studyNotesTitle: "Espace de Notes d'Étude",
    studyNotesSubtitle: 'Enregistrez vos résumés synchronisés avec le minutage de la vidéo',
    profileHubTitle: 'Profil Académique & Certifications',
    verifiedCertificates: 'Certificats Officiels Vérifiés',
    paymentLedger: 'Historique des Paiements & Reçus',
    downloadPDF: 'Télécharger PDF',
    verifyQR: 'Vérification QR',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('edutech_lang');
    return saved === 'fr' ? 'fr' : 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('edutech_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
