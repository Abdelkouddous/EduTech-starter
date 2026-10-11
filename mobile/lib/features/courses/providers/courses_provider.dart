import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../models/course_model.dart';

final coursesListProvider = FutureProvider<List<CourseModel>>((ref) async {
  final response = await ApiClient().dio.get('/courses');
  final list = response.data['data'] as List;
  return list.map((json) => CourseModel.fromJson(json)).toList();
});

final courseDetailProvider = FutureProvider.family<CourseModel, String>((ref, slug) async {
  final response = await ApiClient().dio.get('/courses/$slug');
  return CourseModel.fromJson(response.data['data']);
});
