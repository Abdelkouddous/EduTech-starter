import React, { useState } from 'react';
import { Course } from '../../types';
import { Search, Filter, Star, Clock, Users, BookOpen, ChevronRight, Check } from 'lucide-react';

interface CoursesListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  initialSearchTerm?: string;
}

export const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  onSelectCourse,
  onEnrollCourse,
  initialSearchTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('جميع المجالات');
  const [selectedLevel, setSelectedLevel] = useState<string>('جميع المستويات');

  const categories = ['جميع المجالات', 'برمجة وتطوير', 'بيانات وذكاء اصطناعي', 'تصميم وجرافيك', 'تسويق وأعمال'];
  const levels = ['جميع المستويات', 'مبتدئ', 'متوسط', 'متقدم'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'جميع المجالات' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'جميع المستويات' || c.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div id="courses-section" className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            دليل الدورات التدريبية المتاحة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            اختر الدورة المناسبة لبدء مسارك المهني
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            جميع الدورات تشمل محتوى متجدد، مرفقات وتطبيقات عملي، وشهادة إتمام معتمدة بعد القبول.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث عن اسم الدورة أو المدرب..."
                className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Level Filter Dropdown */}
            <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> المستوى:
              </span>
              {levels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">لم يتم العثور على دورات تدريبية مطابقة</h3>
            <p className="text-xs text-slate-500">جرب البحث بكلمات مختلفة أو اختر تصفية أخرى</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Course Image & Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {course.category}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                    {course.price.toLocaleString()} ج.م
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {course.rating} ({course.reviewsCount})
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectCourse(course)}
                      className="text-base font-extrabold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Details Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.durationHours} ساعة
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {course.studentsCount} طالب
                      </span>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-bold text-slate-700">{course.instructorName}</span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                      >
                        تفاصيل الدورة
                      </button>
                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
                      >
                        <span>اشترك الآن</span>
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
