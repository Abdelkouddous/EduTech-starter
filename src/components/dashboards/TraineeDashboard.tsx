import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Course, Enrollment, PaymentReceipt } from '../../types';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Award,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronLeft,
  X,
  QrCode,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { LessonNotesWorkspace } from '../study/LessonNotesWorkspace';
import { AcademicProfileHub } from '../profile/AcademicProfileHub';

interface TraineeDashboardProps {
  onExploreMoreCourses: () => void;
}

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({ onExploreMoreCourses }) => {
  const { currentUser } = useAuth();
  const { courses, enrollments, paymentReceipts, markLessonComplete } = useData();

  // Find enrollments for current trainee
  const myEnrollments = enrollments.filter(e => e.traineeId === currentUser?.id || true);

  const [activeCourseId, setActiveCourseId] = useState<string | null>(
    myEnrollments.find(e => e.status === 'approved')?.courseId || courses[0]?.id || null
  );

  const [activeLessonVideo, setActiveLessonVideo] = useState<string>(
    'https://www.w3schools.com/html/mov_bbb.mp4'
  );

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'study' | 'profile'>('study');

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeEnrollment = myEnrollments.find(e => e.courseId === activeCourseId);
  const activeReceipt = paymentReceipts.find(
    r => r.courseId === activeCourseId && (r.traineeId === currentUser?.id || true)
  );

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Trainee Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                لوحة المتدرب والطالب (Trainee Portal)
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">مرحباً بك، {currentUser?.name}</h1>
              <p className="text-xs text-slate-500">متابعة حالة التسجيل، الاطلاع على الدروس، وتحميل الشهادات المعتمدة.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrentView('study')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'study' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مسار الدراسة والدروس
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'profile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الملف الأكاديمي والشهادات
              </button>
            </div>

            <button
              onClick={onExploreMoreCourses}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل الدورات</span>
            </button>
          </div>
        </div>

        {currentView === 'profile' ? (
          <AcademicProfileHub onBackToCourses={() => setCurrentView('study')} />
        ) : (
          <>

        {/* Enrollments Status Bar */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">حالة اشتراكاتك والدورات المسجل بها:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myEnrollments.map(enroll => {
              const course = courses.find(c => c.id === enroll.courseId);
              if (!course) return null;
              const isSelected = activeCourseId === course.id;

              return (
                <div
                  key={enroll.id}
                  onClick={() => setActiveCourseId(course.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{course.title}</h4>
                      <p className="text-[10px] text-slate-500">المدرب: {course.instructorName}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">حالة الطلب:</span>
                    {enroll.status === 'pending' && (
                      <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> قيد المراجعة ⏳
                      </span>
                    )}
                    {enroll.status === 'approved' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> مفعّل وتعمل 🟢
                      </span>
                    )}
                    {enroll.status === 'rejected' && (
                      <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> مرفوض 🔴
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Course Hub */}
        {activeCourse && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            
            {/* Header Status */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {activeCourse.category}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">{activeCourse.title}</h2>
              </div>

              {/* Progress & Certificate Button */}
              {activeEnrollment?.status === 'approved' && (
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="text-[11px] text-slate-500">نسبة التقدم بالمحتوى</div>
                    <div className="text-sm font-black text-indigo-600 font-mono">
                      {activeEnrollment.progressPercent}% مكتمل
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>عرض شهادة التخرج المعتمدة</span>
                  </button>
                </div>
              )}
            </div>

            {/* IF STATUS IS PENDING */}
            {activeEnrollment?.status === 'pending' && (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                <Clock className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="text-base font-bold text-amber-900">طلب الاشتراك قيد الفحص والمراجعة ⏳</h3>
                <p className="text-xs text-amber-800 max-w-lg mx-auto leading-relaxed">
                  تم استلام بيانات تحويلك بنجاح وسيقوم مسؤول الحسابات بتدقيق الإيصال وتفعيل وصولك لمحتوى الدورة خلال أقل من ساعة.
                </p>
                {activeReceipt && (
                  <div className="inline-block text-[11px] bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-mono text-amber-900">
                    رقم المعاملة: {activeReceipt.transactionRef} • الوسيلة: {activeReceipt.method}
                  </div>
                )}
              </div>
            )}

            {/* IF STATUS IS APPROVED: LEARNING PORTAL */}
            {activeEnrollment?.status === 'approved' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Video Player */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800">
                    <video
                      src={activeLessonVideo}
                      controls
                      autoPlay={false}
                      className="w-full max-h-96 object-cover"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-indigo-600" /> مشاهدة المحاضرة الحالية
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      شاهد المحاضرة بتركيز وقُم بالتطبيق العملي المباشر. يمكنك تعليم الدرس كمكتمل لتحديث نسبة التقدم وتأهيل الشهادة.
                    </p>
                  </div>

                  {/* Downloads & Attachments */}
                  {activeCourse.attachments && activeCourse.attachments.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" /> المرفقات والملفات القابلة للتحميل:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCourse.attachments.map(att => (
                          <a
                            key={att.id}
                            href="#"
                            onClick={e => e.preventDefault()}
                            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-slate-800 truncate">{att.name}</span>
                            <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Study Notes (EDU-07) */}
                  <LessonNotesWorkspace
                    lessonId={activeCourse.id}
                    lessonTitle={activeCourse.title}
                  />
                </div>

                {/* Lessons Playlist Sidebar */}
                <div className="lg:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                    قائمة دروس ومحاضرات الدورة:
                  </h4>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {activeCourse.modules?.map(mod => (
                      <div key={mod.id} className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-500 bg-slate-200/60 p-2 rounded-lg">
                          {mod.title}
                        </div>
                        {mod.lessons?.map(les => {
                          const isDone = activeEnrollment.completedLessons.includes(les.id);
                          return (
                            <div
                              key={les.id}
                              onClick={() => les.videoUrl && setActiveLessonVideo(les.videoUrl)}
                              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <PlayCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">{les.title}</span>
                              </div>

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  markLessonComplete(currentUser?.id || '', activeCourse.id, les.id);
                                }}
                                className={`p-1 rounded cursor-pointer ${
                                  isDone ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-slate-500'
                                }`}
                                title={isDone ? 'إكمال الدرس' : 'حدد كمكتمل'}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        </>
        )}

      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border-4 border-amber-400 text-center space-y-6">
            
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Branding */}
            <div className="space-y-2 border-b border-amber-200 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-900 mx-auto flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">شهادة إتمام وتخرج معتمدة</h2>
              <p className="text-xs text-amber-700 font-bold">أكاديمية التعلم للتدريب الإلكتروني والتأهيل المباشر</p>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-3 py-2 text-slate-800">
              <p className="text-xs text-slate-500">تشهد إدارة الأكاديمية بأن المتدرب/ـة:</p>
              <h3 className="text-2xl font-black text-indigo-900">{currentUser?.name}</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                قد أتم بنجاح كافة المتطلبات التدريبية والتطبيقات العملية الخاصة بدورة:
              </p>
              <h4 className="text-lg font-black text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                {activeCourse.title}
              </h4>
            </div>

            {/* Footer Signatures & QR Code Verification */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="text-right space-y-1">
                <div className="font-bold text-slate-900">اعتماد مدير الأكاديمية:</div>
                <div className="text-slate-500 italic">د. أحمد منصور</div>
              </div>

              <div className="text-center space-y-1">
                <QrCode className="w-10 h-10 mx-auto text-slate-800" />
                <span className="text-[10px] text-slate-400 font-mono">رقم التوثيق: ACAD-2026-99214</span>
              </div>

              <div className="text-left space-y-1">
                <div className="font-bold text-slate-900">اعتماد مدرب الدورة:</div>
                <div className="text-slate-500 italic">{activeCourse.instructorName}</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              طباعة / حفظ الشهادة PDF
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
