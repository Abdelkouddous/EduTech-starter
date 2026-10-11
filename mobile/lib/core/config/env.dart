import 'dart:io';

class EnvConfig {
  /// Base API URL dynamically handling Android Emulator vs iOS Simulator vs Production
  static String get apiBaseUrl {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:8000/api/v1';
    } else {
      return 'http://localhost:8000/api/v1';
    }
  }

  static const String appName = 'أكاديمية التعلم';
}
