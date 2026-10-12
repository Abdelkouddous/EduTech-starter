import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LanguageState {
  final Locale locale;
  final TextDirection direction;

  const LanguageState({
    required this.locale,
    required this.direction,
  });

  bool get isArabic => locale.languageCode == 'ar';
}

class LanguageNotifier extends StateNotifier<LanguageState> {
  LanguageNotifier()
      : super(const LanguageState(
          locale: Locale('ar'),
          direction: TextDirection.rtl,
        ));

  void toggleLanguage() {
    if (state.isArabic) {
      state = const LanguageState(
        locale: Locale('fr'),
        direction: TextDirection.ltr,
      );
    } else {
      state = const LanguageState(
        locale: Locale('ar'),
        direction: TextDirection.rtl,
      );
    }
  }

  void setLocale(String languageCode) {
    if (languageCode == 'fr') {
      state = const LanguageState(
        locale: Locale('fr'),
        direction: TextDirection.ltr,
      );
    } else {
      state = const LanguageState(
        locale: Locale('ar'),
        direction: TextDirection.rtl,
      );
    }
  }

  String t(String key) {
    final lang = state.locale.languageCode;
    return _dictionary[lang]?[key] ?? key;
  }

  static const Map<String, Map<String, String>> _dictionary = {
    'ar': {
      'appName': 'EduTech Starter',
      'appTagline': 'منصة التدريب والتأهيل الإلكتروني المعتمد 🇩🇿',
      'home': 'الرئيسية',
      'myCourses': 'دوراتي',
      'profile': 'الملف والشهادات',
      'login': 'تسجيل الدخول',
      'register': 'إنشاء حساب جديد',
      'logout': 'تسجيل الخروج',
      'studyNotes': 'مفكرة الدرس',
      'freePreview': 'معاينة مجانية',
      'currency': 'د.ج',
      'statsCourses': 'الدورات',
      'statsCompleted': 'المكتملة',
      'statsCertificates': 'الشهادات',
      'statsNotes': 'الملاحظات',
      'certificatesTitle': 'الشهادات الأكاديمية المعتمدة',
      'paymentsTitle': 'سجل إيصالات الدفع والتحويل',
      'download': 'تحميل PDF',
      'verified': 'معتمد وموثق 🟢',
      'pending': 'قيد المراجعة ⏳',
      'rejected': 'مرفوض 🔴',
      'switchLang': 'FR 🇫🇷',
    },
    'fr': {
      'appName': 'EduTech Starter',
      'appTagline': "Plateforme de Formation & Certifications 🇩🇿",
      'home': 'Accueil',
      'myCourses': 'Mes Cours',
      'profile': 'Profil & Diplômes',
      'login': 'Connexion',
      'register': 'Inscription',
      'logout': 'Déconnexion',
      'studyNotes': 'Notes de cours',
      'freePreview': 'Aperçu gratuit',
      'currency': 'DZD',
      'statsCourses': 'Cours',
      'statsCompleted': 'Complétés',
      'statsCertificates': 'Diplômes',
      'statsNotes': 'Notes',
      'certificatesTitle': 'Certificats Officiels Vérifiés',
      'paymentsTitle': 'Historique des Paiements (BaridiMob/CCP)',
      'download': 'Télécharger PDF',
      'verified': 'Validé 🟢',
      'pending': 'En attente ⏳',
      'rejected': 'Rejeté 🔴',
      'switchLang': 'عربي 🇩🇿',
    },
  };
}

final languageProvider = StateNotifierProvider<LanguageNotifier, LanguageState>((ref) {
  return LanguageNotifier();
});
