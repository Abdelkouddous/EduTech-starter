import React from 'react';
import { Course } from '../../types';
import {
  X,
  Clock,
  BookOpen,
  Users,
  Star,
  CheckCircle2,
  FileText,
  PlayCircle,
  Download,
  CreditCard,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Promo Video Player / Image Banner */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 mb-6">
          {course.promoVideoUrl ? (
            <video
              src={course.promoVideoUrl}
              controls
              poster={course.coverImage}
              className="w-full max-h-72 object-cover"
            />
          ) : (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-64 object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
            {course.category} • {course.level}
          </div>
        </div>

        {/* Header Info */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> {course.lessonsCount} درس
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-indigo-600" /> {course.durationHours} ساعة تدريبية
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.reviewsCount} تقييم)
                </span>
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-center shrink-0">
              <div className="text-[10px] text-emerald-700 font-bold">رسوم الاشتراك الكاملة</div>
              <div className="text-2xl font-black text-emerald-600 font-mono">{course.price.toLocaleString()} ج.م</div>
              {course.originalPrice && (
                <div className="text-xs text-slate-400 line-through">{course.originalPrice.toLocaleString()} ج.م</div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {course.fullDescription || course.description}
          </p>
        </div>

        {/* Grid Sections: Learning Outcomes & Prerequisites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-3">
            <h4 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> ماذا ستتعلم في هذه الدورة؟
            </h4>
            <ul className="space-y-2 text-xs text-indigo-950">
              {course.learningOutcomes?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> متطلبات الدورة والمستلزمات:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {course.prerequisites?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Syllabus / Curriculum Accordion */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" /> فهرس ومحتويات الدورة التدريبية:
          </h4>
          
          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-2">
              {course.modules.map((mod, idx) => (
                <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="bg-slate-50 p-3 font-bold text-xs text-slate-800 flex items-center justify-between">
                    <span>{mod.title}</span>
                    <span className="text-[11px] text-slate-500">{mod.lessons?.length || 0} دروس</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {mod.lessons?.map(les => (
                      <div key={les.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{les.title}</span>
                          {les.isFreePreview && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              معاينة مجانية
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{les.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
              تم تقسيم هذه الدورة إلى محاضرات تفاعلية مباشرة ومقاطع مسجلة يتم إتاحتها فور قبول التسجيل.
            </p>
          )}
        </div>

        {/* Course Attachments Preview */}
        {course.attachments && course.attachments.length > 0 && (
          <div className="space-y-2 mb-6">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> الملفات والمرفقات المتاحة للدورة:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.attachments.map(att => (
                <div key={att.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{att.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{att.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructor Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 mb-6">
          <img
            src={course.instructorAvatar}
            alt={course.instructorName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-xs font-bold text-slate-900">{course.instructorName}</div>
            <div className="text-[11px] text-slate-500">مدرب معتمد بالأكاديمية</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            قبول وتأكيد الاشتراك الفوري عبر InstaPay, Vodafone Cash, Fawry
          </div>
          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>اشترك الآن وادفع إلكترونياً / يدوي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
