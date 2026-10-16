import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../models/course_model.dart';

final courseSearchQueryProvider = StateProvider<String>((ref) => '');

final coursesListProvider = FutureProvider<List<CourseModel>>((ref) async {
  final query = ref.watch(courseSearchQueryProvider).trim();
  final path = query.isNotEmpty
      ? '/courses?q=${Uri.encodeComponent(query)}'
      : '/courses';

  final response = await ApiClient().dio.get(path);
  final list = response.data['data'] as List;
  return list.map((json) => CourseModel.fromJson(json)).toList();
});

final courseDetailProvider = FutureProvider.family<CourseModel, String>((ref, slug) async {
  final response = await ApiClient().dio.get('/courses/$slug');
  return CourseModel.fromJson(response.data['data']);
});

