import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/theme/theme_provider.dart';
import '../../auth/providers/auth_provider.dart';
import '../../payments/screens/payment_receipt_screen.dart';
import '../providers/courses_provider.dart';
import '../../../core/network/api_client.dart';
import '../../notes/screens/lesson_notes_sheet.dart';

class CourseDetailScreen extends ConsumerWidget {
  final String slug;

  const CourseDetailScreen({super.key, required this.slug});

  void _playLesson(BuildContext context, int lessonId, String lessonTitle) async {
    try {
      final res = await ApiClient().dio.get('/lessons/$lessonId/play');
      final data = res.data;
      final video = data['video'];

      if (!context.mounted) return;
      showDialog(
        context: context,
        builder: (_) => Directionality(
          textDirection: TextDirection.rtl,
          child: AlertDialog(
            title: Text(lessonTitle),
            content: Text(
              'نوع البث: ${video['type']}\nرابط البث:\n${video['src']}',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('إغلاق'),
              ),
            ],
          ),
        ),
      );
    } on DioException catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('تعذر تشغيل الدرس: ${e.response?.data?['message'] ?? e.message}')),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('تعذر تشغيل الدرس: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeState = ref.watch(themeProvider);
    final authState = ref.watch(authProvider);
    final courseAsync = ref.watch(courseDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(
        title: const Text('تفاصيل البرنامج التدريبي'),
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: courseAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Center(child: Text('خطأ: $err')),
          data: (course) => SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (course.coverImage != null)
                  Image.network(
                    course.coverImage!,
                    height: 220,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        course.title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${course.price.toStringAsFixed(0)} ${themeState.currencySymbol}',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: themeState.primaryColor,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        course.description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF475569),
                          height: 1.6,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Enrollment CTA
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: themeState.primaryColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: () {
                            if (!authState.isAuthenticated) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('يرجى تسجيل الدخول أولاً لإتمام الاشتراك')),
                              );
                              return;
                            }
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PaymentReceiptScreen(
                                  courseId: course.id,
                                  courseTitle: course.title,
                                  amount: course.price,
                                ),
                              ),
                            );
                          },
                          child: const Text(
                            'الاشتراك وسداد الرسوم عبر التحويل البنكي',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Modules Syllabus
                      const Text(
                        'الخطة التدريبية والوحدات',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...course.modules.map((module) => Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                module.title,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1E3A8A),
                                ),
                              ),
                              const Divider(height: 20),
                              ...module.lessons.map((lesson) => ListTile(
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                                leading: Icon(
                                  lesson.isFreePreview ? Icons.play_circle_outline : Icons.lock_outline,
                                  color: lesson.isFreePreview ? Colors.green : Colors.grey,
                                ),
                                title: Text(lesson.title),
                                subtitle: Text(lesson.duration),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (lesson.isFreePreview)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        margin: const EdgeInsets.only(left: 6),
                                        decoration: BoxDecoration(
                                          color: Colors.green[50],
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: const Text(
                                          'معاينة مجانية',
                                          style: TextStyle(color: Colors.green, fontSize: 10),
                                        ),
                                      ),
                                    IconButton(
                                      icon: const Icon(Icons.note_alt_outlined, size: 18, color: Colors.indigo),
                                      tooltip: 'مفكرة الدرس',
                                      onPressed: () => LessonNotesSheet.show(context, lesson.id, lesson.title),
                                    ),
                                  ],
                                ),
                                onTap: () => _playLesson(context, lesson.id, lesson.title),
                              )),
                            ],
                          ),
                        ),
                      )),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
