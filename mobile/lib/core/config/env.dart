import 'package:flutter/foundation.dart';
import 'dart:io' show Platform;

class EnvConfig {
  /// Base API URL dynamically handling Web vs Android Emulator vs iOS Simulator
  static String get apiBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:8001/api/v1';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:8001/api/v1';
    } else {
      return 'http://localhost:8001/api/v1';
    }
  }

  static const String appName = 'EduTech Starter';
}
