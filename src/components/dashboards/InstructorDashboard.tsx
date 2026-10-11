import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Course, FileAttachment, Lesson } from '../../types';
import {
  BookOpen,
  Image as ImageIcon,
  Video,
  FileText,
  Upload,
  Plus,
  Users,
  CheckCircle,
  PlayCircle,
  Clock,
  Save,
  Trash2
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, updateCourse, addCourseAttachment } = useData();

  // Instructor courses
  const myCourses = courses.filter(
    c => c.instructorId === currentUser?.id || c.instructorName === currentUser?.name || true
  );

  const [selectedCourse, setSelectedCourse] = useState<Course>(myCourses[0] || courses[0]);

  // Video Upload State
  const [promoVideoUrl, setPromoVideoUrl] = useState(selectedCourse?.promoVideoUrl || '');
  const [coverImageUrl, setCoverImageUrl] = useState(selectedCourse?.coverImage || '');

  // Attachment Upload State
  const [attName, setAttName] = useState('');
  const [attSize, setAttSize] = useState('2.5 MB');
  const [attType, setAttType] = useState('pdf');

  // New Lesson State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('30 دقيقة');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateCourseMedia = () => {
    updateCourse(selectedCourse.id, {
      coverImage: coverImageUrl || selectedCourse.coverImage,
      promoVideoUrl: promoVideoUrl || selectedCourse.promoVideoUrl
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attName) return;
    addCourseAttachment(selectedCourse.id, {
      name: attName,
      size: attSize,
      type: attType,
      url: '#'
    });
    setAttName('');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle) return;

    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      title: lessonTitle,
      duration: lessonDuration,
      videoUrl: lessonVideoUrl,
      isFreePreview: false
    };

    const existingModules = selectedCourse.modules || [];
    let updatedModules = [...existingModules];

    if (updatedModules.length === 0) {
      updatedModules = [
        {
          id: `mod_${Date.now()}`,
          title: 'الوحدة التدريبية الرئيسية',
          lessons: [newLesson]
        }
      ];
    } else {
      updatedModules[0] = {
        ...updatedModules[0],
        lessons: [...updatedModules[0].lessons, newLesson]
      };
    }

    updateCourse(selectedCourse.id, {
      modules: updatedModules,
      lessonsCount: selectedCourse.lessonsCount + 1
    });

    setLessonTitle('');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                لوحة تحكم المدرب المعتقد (Instructor Dashboard)
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">مرحباً {currentUser?.name}</h1>
              <p className="text-xs text-slate-500">إدارة الدورات، رفع الصور، مقاطع الفيديو التعريفية، والملفات المرفقة.</p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: My Courses Selection */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              الدورات الخاصة بك ({myCourses.length})
            </h3>

            <div className="space-y-2">
              {myCourses.map(course => {
                const isSelected = selectedCourse?.id === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setCoverImageUrl(course.coverImage);
                      setPromoVideoUrl(course.promoVideoUrl || '');
                    }}
                    className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{course.title}</div>
                        <div className="text-[10px] text-slate-500">{course.studentsCount} متدرب</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Manage Selected Course Details */}
          {selectedCourse && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Media Upload Section: Cover & Promo Video */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-600" />
                    <span>إدارة الصور والفيديوهات التعريفية/الترويجية للدورة</span>
                  </h3>
                  {savedSuccess && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> تم حفظ الوسائط بنجاح!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cover Image Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">رابط صورة غلاف الدورة (Cover Image):</label>
                    <input
                      type="text"
                      value={coverImageUrl}
                      onChange={e => setCoverImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      placeholder="https://..."
                    />
                    <img
                      src={coverImageUrl || selectedCourse.coverImage}
                      alt="الغلاف"
                      className="w-full h-32 rounded-xl object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Promo Video Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">رابط الفيديو الترويجي / التعريفي للدورة:</label>
                    <input
                      type="text"
                      value={promoVideoUrl}
                      onChange={e => setPromoVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                    />
                    <div className="p-3 bg-slate-900 text-white rounded-xl text-center text-xs space-y-1">
                      <Video className="w-6 h-6 text-amber-400 mx-auto" />
                      <p className="text-[11px] text-slate-300">يظهر الفيديو الترويجي للمستخدمين عند استعراض تفاصيل الدورة.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdateCourseMedia}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>تحديث الوسائط والغلاف</span>
                </button>
              </div>

              {/* Course Attachments & Files Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>رفع ملفات ومرفقات الدورة (PDF, Slides, Zip)</span>
                </h3>

                {/* Upload New Attachment Form */}
                <form onSubmit={handleAddAttachment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">اسم الملف / المرفق *</label>
                      <input
                        type="text"
                        value={attName}
                        onChange={e => setAttName(e.target.value)}
                        placeholder="مثال: ملخص_الدروس_العملية.pdf"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الحجم التقديري</label>
                      <input
                        type="text"
                        value={attSize}
                        onChange={e => setAttSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">نوع الملف</label>
                      <select
                        value={attType}
                        onChange={e => setAttType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="zip">ZIP Archive</option>
                        <option value="excel">Excel Sheet</option>
                        <option value="powerpoint">PowerPoint Presentation</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع وإرفاق الملف للطلاب</span>
                  </button>
                </form>

                {/* List Current Attachments */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600">الملفات المتاحة حالياً للمتدربين:</span>
                  {selectedCourse.attachments && selectedCourse.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCourse.attachments.map(att => (
                        <div key={att.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{att.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">لا توجد ملفات مرفقة بعد لهذه الدورة.</p>
                  )}
                </div>
              </div>

              {/* Course Lessons / Content Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                  <span>إضافة وتحديث الدروس والفيديوهات التعليمية</span>
                </h3>

                <form onSubmit={handleAddLesson} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">عنوان الدرس الجديد *</label>
                      <input
                        type="text"
                        value={lessonTitle}
                        onChange={e => setLessonTitle(e.target.value)}
                        placeholder="مثال: تطبيق عملي على بناء السيرفر وإدارة الاستجابات"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">مدة الفيديو</label>
                      <input
                        type="text"
                        value={lessonDuration}
                        onChange={e => setLessonDuration(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رابط الفيديو (Video URL)</label>
                    <input
                      type="text"
                      value={lessonVideoUrl}
                      onChange={e => setLessonVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة الدرس لقائمة المحاضرات</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
