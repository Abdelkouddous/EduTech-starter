import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/theme/theme_provider.dart';
import '../../auth/providers/auth_provider.dart';
import '../../payments/screens/payment_receipt_screen.dart';
import '../providers/courses_provider.dart';
import '../../../core/network/api_client.dart';
import '../../notes/screens/lesson_notes_sheet.dart';

class CourseDetailScreen extends ConsumerWidget {
  final String slug;

  const CourseDetailScreen({super.key, required this.slug});

  void _playLesson(BuildContext context, int lessonId, String lessonTitle, WidgetRef ref) async {
    final authState = ref.read(authProvider);

    try {
      final res = await ApiClient().dio.get('/lessons/$lessonId/play');
      final data = res.data;
      final video = data['video'];

      if (!context.mounted) return;
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(lessonTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // V4 Anti-Capture Video Player Container with Dynamic Watermark Overlay
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: double.infinity,
                    height: 180,
                    decoration: BoxDecoration(
                      color: Colors.black87,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.play_circle_filled, size: 54, color: Colors.white),
                        const SizedBox(height: 8),
                        Text(
                          'Lecture Sécurisée (${video['type']})',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),

                  // Floating Student ID Watermark (Requirement V4)
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Opacity(
                      opacity: 0.35,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'EDU-STUDENT: #${authState.user?.id ?? 'GUEST'} • ${authState.user?.email ?? 'anonymous'}',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontFamily: 'monospace'),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                'Source de diffusion :\n${video['src']}',
                style: const TextStyle(fontSize: 11, color: Colors.grey),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Fermer / إغلاق'),
            ),
          ],
        ),
      );
    } on DioException catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Accès non autorisé: ${e.response?.data?['message'] ?? e.message}')),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
    }
  }

  void _showAddReviewDialog(BuildContext context, int courseId, WidgetRef ref) {
    int rating = 5;
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Évaluer la formation / تقييم الدورة', style: TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  return IconButton(
                    icon: Icon(
                      index < rating ? Icons.star_rounded : Icons.star_border_rounded,
                      color: Colors.amber,
                      size: 32,
                    ),
                    onPressed: () => setDialogState(() => rating = index + 1),
                  );
                }),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: commentController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Votre retour d\'expérience... / ملاحظاتك حول الدورة',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Annuler / إلغاء'),
            ),
            ElevatedButton(
              onPressed: () async {
                try {
                  final res = await ApiClient().dio.post('/courses/$courseId/reviews', data: {
                    'rating': rating,
                    'comment': commentController.text,
                  });
                  if (context.mounted) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(backgroundColor: Colors.green, content: Text(res.data['message'] ?? 'Avis enregistré !')),
                    );
                    ref.invalidate(courseDetailProvider(slug));
                  }
                } catch (err) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(backgroundColor: Colors.red, content: Text('Erreur: $err')),
                    );
                  }
                }
              },
              child: const Text('Envoyer / إرسال'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeState = ref.watch(themeProvider);
    final authState = ref.watch(authProvider);
    final langState = ref.watch(languageProvider);
    final courseAsync = ref.watch(courseDetailProvider(slug));

    return Directionality(
      textDirection: langState.direction,
      child: Scaffold(
        appBar: AppBar(
          title: Text(langState.isArabic ? 'تفاصيل البرنامج التدريبي' : 'Détails de la Formation'),
        ),
        body: courseAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Center(child: Text('خطأ: $err')),
          data: (course) => SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Cover Image / Header
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: course.coverImage != null
                      ? Image.network(
                          course.coverImage!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: themeState.primaryColor.withAlpha(25),
                            child: Icon(Icons.school, size: 64, color: themeState.primaryColor),
                          ),
                        )
                      : Container(
                          color: themeState.primaryColor.withAlpha(25),
                          child: Icon(Icons.school, size: 64, color: themeState.primaryColor),
                        ),
                ),

                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge & Category
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: themeState.primaryColor.withAlpha(25),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              course.category,
                              style: TextStyle(
                                color: themeState.primaryColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.star_rounded, color: Colors.amber, size: 20),
                              const SizedBox(width: 4),
                              Text(
                                '${course.rating}',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                ' (${course.reviewsCount})',
                                style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Title
                      Text(
                        course.title,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Description
                      Text(
                        course.description,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Instructor Card
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 20,
                              backgroundImage: NetworkImage(course.instructor.avatar),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    course.instructor.name,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  Text(
                                    course.instructor.specialization,
                                    style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Price & Enroll CTA
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: themeState.primaryColor.withAlpha(15),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: themeState.primaryColor.withAlpha(40)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  langState.isArabic ? 'سعر الاستثمار' : 'Prix',
                                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                ),
                                Text(
                                  '${course.price} ${themeState.currencySymbol}',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: themeState.primaryColor,
                                  ),
                                ),
                              ],
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: themeState.primaryColor,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              onPressed: () {
                                if (!authState.isAuthenticated) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('يرجى تسجيل الدخول أولاً لإتمام التسجيل')),
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
                              child: Text(langState.isArabic ? 'سجل الآن' : 'S\'inscrire'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Curriculum Modules (V1, V2)
                      Text(
                        langState.isArabic ? 'منهاج الدورة والدروس' : 'Programme de Formation',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      ...course.modules.map((module) => Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
                                        child: Text(
                                          langState.isArabic ? 'معاينة مجانية' : 'Aperçu gratuit',
                                          style: const TextStyle(color: Colors.green, fontSize: 10),
                                        ),
                                      ),
                                    IconButton(
                                      icon: const Icon(Icons.note_alt_outlined, size: 18, color: Colors.indigo),
                                      tooltip: 'مفكرة الدرس',
                                      onPressed: () => LessonNotesSheet.show(context, lesson.id, lesson.title),
                                    ),
                                  ],
                                ),
                                onTap: () => _playLesson(context, lesson.id, lesson.title, ref),
                              )),
                            ],
                          ),
                        ),
                      )),

                      const SizedBox(height: 24),

                      // Verified Reviews Section (C4)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            langState.isArabic ? 'تقييمات وآراء المتدربين' : 'Avis des Stagiaires',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          if (authState.isAuthenticated)
                            TextButton.icon(
                              icon: const Icon(Icons.rate_review_outlined, size: 16),
                              label: Text(langState.isArabic ? 'كتابة تقييم' : 'Évaluer'),
                              onPressed: () => _showAddReviewDialog(context, course.id, ref),
                            ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade50.withAlpha(100),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.amber.shade200),
                        ),
                        child: Row(
                          children: [
                            Text(
                              '${course.rating}',
                              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.amber),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: List.generate(5, (index) => const Icon(Icons.star_rounded, color: Colors.amber, size: 18)),
                                ),
                                Text(
                                  '${course.reviewsCount} avis certifiés d\'étudiants',
                                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
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
