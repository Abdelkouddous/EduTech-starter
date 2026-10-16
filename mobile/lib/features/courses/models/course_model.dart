class LessonModel {
  final int id;
  final String title;
  final String duration;
  final String? videoUrl;
  final String videoDriver;
  final bool isFreePreview;
  final String? description;

  LessonModel({
    required this.id,
    required this.title,
    required this.duration,
    this.videoUrl,
    this.videoDriver = 'embedded',
    this.isFreePreview = false,
    this.description,
  });

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    return LessonModel(
      id: json['id'],
      title: json['title'] ?? '',
      duration: json['duration'] ?? '15:00',
      videoUrl: json['video_url'],
      videoDriver: json['video_driver'] ?? 'embedded',
      isFreePreview: json['is_free_preview'] == true || json['is_free_preview'] == 1,
      description: json['description'],
    );
  }
}

class CourseModuleModel {
  final int id;
  final String title;
  final List<LessonModel> lessons;

  CourseModuleModel({required this.id, required this.title, required this.lessons});

  factory CourseModuleModel.fromJson(Map<String, dynamic> json) {
    var rawLessons = json['lessons'] as List? ?? [];
    return CourseModuleModel(
      id: json['id'],
      title: json['title'] ?? '',
      lessons: rawLessons.map((l) => LessonModel.fromJson(l)).toList(),
    );
  }
}

class InstructorModel {
  final int id;
  final String name;
  final String avatar;
  final String specialization;

  InstructorModel({
    required this.id,
    required this.name,
    required this.avatar,
    required this.specialization,
  });

  factory InstructorModel.fromJson(Map<String, dynamic> json) {
    return InstructorModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? 'مدرب معتمد',
      avatar: json['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      specialization: json['specialization'] ?? json['title'] ?? 'خبير أكاديمي معتمد',
    );
  }
}

class CourseModel {
  final int id;
  final String title;
  final String slug;
  final String description;
  final String? fullDescription;
  final String category;
  final String level;
  final double price;
  final double? originalPrice;
  final int durationHours;
  final String? coverImage;
  final String? instructorName;
  final double rating;
  final int reviewsCount;
  final InstructorModel instructor;
  final List<CourseModuleModel> modules;

  CourseModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    this.fullDescription,
    required this.category,
    required this.level,
    required this.price,
    this.originalPrice,
    required this.durationHours,
    this.coverImage,
    this.instructorName,
    this.rating = 5.0,
    this.reviewsCount = 0,
    required this.instructor,
    this.modules = const [],
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    var rawModules = json['modules'] as List? ?? [];
    var instructorJson = json['instructor'] as Map<String, dynamic>?;

    final instructorObj = instructorJson != null
        ? InstructorModel.fromJson(instructorJson)
        : InstructorModel(
            id: 0,
            name: json['instructor_name'] ?? 'مدرب معتمد',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            specialization: 'خبير تدريب وتطوير برمجيات',
          );

    return CourseModel(
      id: json['id'],
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? '',
      fullDescription: json['full_description'],
      category: json['category'] ?? 'عام',
      level: json['level'] ?? 'جميع المستويات',
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      originalPrice: json['original_price'] != null ? double.tryParse(json['original_price'].toString()) : null,
      durationHours: json['duration_hours'] ?? 0,
      coverImage: json['cover_image'],
      instructorName: instructorObj.name,
      rating: double.tryParse(json['rating']?.toString() ?? '5.0') ?? 5.0,
      reviewsCount: json['reviews_count'] ?? (json['reviews'] as List?)?.length ?? 0,
      instructor: instructorObj,
      modules: rawModules.map((m) => CourseModuleModel.fromJson(m)).toList(),
    );
  }
}
