import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/localization/language_provider.dart';
import 'core/theme/theme_provider.dart';
import 'features/consultations/screens/consultations_screen.dart';
import 'features/courses/screens/home_screen.dart';
import 'features/enrollments/screens/my_courses_screen.dart';
import 'features/profile/screens/profile_hub_screen.dart';
import 'features/splash/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: EduTechApp()));
}

class EduTechApp extends ConsumerWidget {
  const EduTechApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeData = ref.watch(appThemeDataProvider);
    final langState = ref.watch(languageProvider);

    return MaterialApp(
      title: 'EduTech Starter',
      debugShowCheckedModeBanner: false,
      theme: themeData,
      locale: langState.locale,
      supportedLocales: const [
        Locale('ar'),
        Locale('fr'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const SplashScreen(),
    );
  }
}

class MainNavigationScreen extends ConsumerStatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  ConsumerState<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends ConsumerState<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    ConsultationsScreen(),
    MyCoursesScreen(),
    ProfileHubScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final langState = ref.watch(languageProvider);
    final langNotifier = ref.read(languageProvider.notifier);

    return Directionality(
      textDirection: langState.direction,
      child: Scaffold(
        body: _screens[_currentIndex],
        bottomNavigationBar: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) => setState(() => _currentIndex = index),
          destinations: [
            NavigationDestination(
              icon: const Icon(Icons.school_outlined),
              selectedIcon: const Icon(Icons.school),
              label: langNotifier.t('home'),
            ),
            NavigationDestination(
              icon: const Icon(Icons.calendar_month_outlined),
              selectedIcon: const Icon(Icons.calendar_month),
              label: langNotifier.t('consultations'),
            ),
            NavigationDestination(
              icon: const Icon(Icons.menu_book_outlined),
              selectedIcon: const Icon(Icons.menu_book),
              label: langNotifier.t('myCourses'),
            ),
            NavigationDestination(
              icon: const Icon(Icons.person_outline),
              selectedIcon: const Icon(Icons.person),
              label: langNotifier.t('profile'),
            ),
          ],
        ),
      ),
    );
  }
}
