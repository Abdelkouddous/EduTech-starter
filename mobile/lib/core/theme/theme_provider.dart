import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../network/api_client.dart';

class InstituteThemeState {
  final String instituteName;
  final Color primaryColor;
  final Color accentColor;
  final String currencySymbol;
  final Map<String, dynamic> offlinePaymentMethods;
  final bool isLoading;

  const InstituteThemeState({
    this.instituteName = 'EduTech Starter',
    this.primaryColor = const Color(0xFF2563EB),
    this.accentColor = const Color(0xFFF59E0B),
    this.currencySymbol = 'د.ج',
    this.offlinePaymentMethods = const {},
    this.isLoading = true,
  });

  InstituteThemeState copyWith({
    String? instituteName,
    Color? primaryColor,
    Color? accentColor,
    String? currencySymbol,
    Map<String, dynamic>? offlinePaymentMethods,
    bool? isLoading,
  }) {
    return InstituteThemeState(
      instituteName: instituteName ?? this.instituteName,
      primaryColor: primaryColor ?? this.primaryColor,
      accentColor: accentColor ?? this.accentColor,
      currencySymbol: currencySymbol ?? this.currencySymbol,
      offlinePaymentMethods: offlinePaymentMethods ?? this.offlinePaymentMethods,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class ThemeNotifier extends StateNotifier<InstituteThemeState> {
  ThemeNotifier() : super(const InstituteThemeState()) {
    fetchBootstrap();
  }

  Future<void> fetchBootstrap() async {
    try {
      final response = await ApiClient().dio.get('/institute/bootstrap');
      final data = response.data;
      if (data['status'] == 'success' && data['institute'] != null) {
        final inst = data['institute'];
        final theme = inst['theme'] ?? {};
        final curr = inst['currency'] ?? {};

        state = state.copyWith(
          instituteName: inst['name'] ?? state.instituteName,
          primaryColor: _hexToColor(theme['primary_color']) ?? state.primaryColor,
          accentColor: _hexToColor(theme['accent_color']) ?? state.accentColor,
          currencySymbol: curr['symbol'] ?? state.currencySymbol,
          offlinePaymentMethods: Map<String, dynamic>.from(inst['offline_payment_methods'] ?? {}),
          isLoading: false,
        );
      }
    } catch (_) {
      state = state.copyWith(isLoading: false);
    }
  }

  Color? _hexToColor(String? hexString) {
    if (hexString == null || hexString.isEmpty) return null;
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    try {
      return Color(int.parse(buffer.toString(), radix: 16));
    } catch (_) {
      return null;
    }
  }
}

final themeProvider = StateNotifierProvider<ThemeNotifier, InstituteThemeState>((ref) {
  return ThemeNotifier();
});

/// Material ThemeData generated dynamically based on active institute branding
final appThemeDataProvider = Provider<ThemeData>((ref) {
  final themeState = ref.watch(themeProvider);

  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: themeState.primaryColor,
      primary: themeState.primaryColor,
      secondary: themeState.accentColor,
      surface: Colors.white,
    ),
    scaffoldBackgroundColor: const Color(0xFFF8FAFC),
    textTheme: GoogleFonts.cairoTextTheme(),
    appBarTheme: AppBarTheme(
      backgroundColor: themeState.primaryColor,
      foregroundColor: Colors.white,
      centerTitle: true,
      elevation: 0,
    ),
  );
});
