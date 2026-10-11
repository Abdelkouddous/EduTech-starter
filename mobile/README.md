# 📱 EduTech Mobile App — Flutter, FVM & Riverpod Starter

تطبيق الموبايل الاحترافي المعتمد على **Flutter** مع نظام إدارة الإصدارات الافتراضية **FVM (Flutter Version Management)** وحزم إدارة الحالة **Riverpod 2.x**.

---

## 🔒 حماية بيئة التشغيل وعدم التعليق عند الاستنساخ (Clone Protection)

تم تجهيز هذا المشروع بحيث يمكنك استنساخه على أي جهاز جديد (أو تسليمه لعميل) وتشغيله فوراً دون تعارض في إصدارات Flutter أو Dart:

1. **إصدار Flutter مثبت مسبقاً**: ملف `.fvm/fvm_config.json` و `.fvmrc` يحددان إصدار Flutter الموحد لكافة أعضاء الفريق.
2. **الربط التلقائي في VS Code**: مجلد `.vscode/settings.json` مبرمج مسبقاً للإشارة إلى `.fvm/flutter_sdk`.
3. **سكربت التشغيل الآلي**: تم تضمين `scripts/setup.sh` لتنزيل إصدار Flutter المطابق وربطه وجلب الحزم بأمر واحد.

---

## 🚀 التثبيت والتشغيل السريع (Quickstart)

### 1. إعداد البيئة الافتراضية لأول مرة
من المجلد الرئيسي للمشروع، نفذ:
```bash
make mobile-setup
# أو من داخل مجلد mobile:
./scripts/setup.sh
```

### 2. تشغيل التطبيق
```bash
make mobile
# أو عبر FVM مباشرة:
cd mobile
fvm flutter run
```

* **محاكي Android**: يتصل تلقائياً بالواجهة الخلفية عبر `http://10.0.2.2:8000/api/v1`.
* **محاكي iOS**: يتصل تلقائياً بالواجهة الخلفية عبر `http://localhost:8000/api/v1`.

---

## 🏗️ الهيكلية المعمارية وحزم العمل (Architecture & Riverpod)

```
mobile/lib/
├── core/
│   ├── config/env.dart          # اكتشاف عنوان السيرفر حسب نظام التشغيل (Android vs iOS)
│   ├── network/api_client.dart  # عميل Dio مع حقن Bearer Token التلقائي
│   └── theme/theme_provider.dart# محرك Riverpod لجلب هوية الأكاديمية وألوان البراند
├── features/
│   ├── auth/providers/          # إدارة جلسات تسجيل الدخول وتخزين التوكن في Keychain
│   ├── courses/                 # شاشات ونماذج تصفح الكتالوج والدروس المجانية
│   ├── payments/                # شاشة رفع إيصالات التحويل البنكي (ImagePicker + Dio FormData)
│   └── enrollments/             # متابعة نسبة الإنجاز والشهادات الصادرة
└── main.dart                    # نقطة الدخول الرئيسية مع ProviderScope والتعريب RTL
```

---

## 🛠️ أوامر FVM الشائعة
* فحص الإصدار الحالي: `fvm flutter --version`
* تحديث الحزم: `fvm flutter pub get`
* بناء نسخة Android APK: `fvm flutter build apk --release`
* بناء نسخة iOS: `fvm flutter build ipa --release`
