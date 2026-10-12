class LessonNoteModel {
  final int id;
  final int lessonId;
  final int? timestampSeconds;
  final String content;
  final String? createdAt;

  LessonNoteModel({
    required this.id,
    required this.lessonId,
    this.timestampSeconds,
    required this.content,
    this.createdAt,
  });

  factory LessonNoteModel.fromJson(Map<String, dynamic> json) {
    return LessonNoteModel(
      id: json['id'] as int,
      lessonId: json['lesson_id'] as int,
      timestampSeconds: json['timestamp_seconds'] as int?,
      content: json['content'] as String,
      createdAt: json['created_at'] as String?,
    );
  }

  String? get formattedTime {
    if (timestampSeconds == null) return null;
    final mins = (timestampSeconds! / 60).floor();
    final secs = (timestampSeconds! % 60);
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}
