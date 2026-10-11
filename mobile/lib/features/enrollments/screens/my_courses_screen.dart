import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';
import '../../auth/providers/auth_provider.dart';

final myEnrollmentsProvider = FutureProvider<List<dynamic>>((ref) async {
  final response = await ApiClient().dio.get('/my-courses');
  return response.data['data'] as List<dynamic>;
});

class MyCoursesScreen extends ConsumerWidget {
  const MyCoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeState = ref.watch(themeProvider);
    final authState = ref.watch(authProvider);

    if (!authState.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('دوراتي التدريبية')),
        body: const Center(
          child: Text('يرجى تسجيل الدخول أولاً لعرض دوراتك ونسبة إنجازك.'),
        ),
      );
    }

    final enrollmentsAsync = ref.watch(myEnrollmentsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('دوراتي التدريبية'),
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: enrollmentsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Center(child: Text('خطأ في تحميل الدورات: $err')),
          data: (enrollments) {
            if (enrollments.isEmpty) {
              return const Center(child: Text('لست مسجلاً في أي دورات حالياً.'));
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: enrollments.length,
              itemBuilder: (context, index) {
                final item = enrollments[index];
                final course = item['course'] ?? {};
                final cohort = item['cohort'] ?? {};
                final progress = (item['progress_percent'] ?? 0) as int;
                final certIssued = item['certificate_issued'] == true || item['certificate_issued'] == 1;

                return Card(
                  margin: const EdgeInsets.only(bottom: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          course['title'] ?? '',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'الدفعة: ${cohort['name'] ?? 'دفعة عامة'}',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        const SizedBox(height: 12),

                        // Progress Bar
                        LinearProgressIndicator(
                          value: progress / 100,
                          backgroundColor: Colors.grey[200],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            progress >= 100 ? Colors.green : themeState.primaryColor,
                          ),
                          minHeight: 8,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('$progress% مكتمل', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            if (certIssued)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.green[50],
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: Colors.green.shade300),
                                ),
                                child: Text(
                                  '🎓 شهادة صادرة: ${item['certificate_id'] ?? ''}',
                                  style: const TextStyle(color: Colors.green, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
