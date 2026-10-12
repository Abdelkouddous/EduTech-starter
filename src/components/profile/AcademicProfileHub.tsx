import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  GraduationCap,
  Award,
  Download,
  QrCode,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  ExternalLink,
  ChevronLeft,
  Share2,
} from 'lucide-react';

interface AcademicProfileHubProps {
  onBackToCourses?: () => void;
}

export const AcademicProfileHub: React.FC<AcademicProfileHubProps> = ({ onBackToCourses }) => {
  const { currentUser } = useAuth();
  const { courses, enrollments, paymentReceipts } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'payments'>('overview');

  const myEnrollments = enrollments.filter(e => e.traineeId === currentUser?.id || true);
  const completedEnrollments = myEnrollments.filter(e => e.progressPercentage >= 100);

  // Mocked/Derived certificates
  const certificates = [
    {
      id: 'CERT-EDU-2026-901',
      code: 'CERT-EDU-2026-901',
      courseTitle: 'دبلوم تطوير تطبيقات الويب الحديثة (Full Stack Web Development)',
      issueDate: '15 أكتوبر 2026',
      verificationUrl: 'http://localhost:8000/api/v1/certificates/CERT-EDU-2026-901',
      downloadUrl: 'http://localhost:8000/api/v1/certificates/CERT-EDU-2026-901/download',
      hours: 48,
    },
    {
      id: 'CERT-EDU-2026-442',
      code: 'CERT-EDU-2026-442',
      courseTitle: 'أساسيات وتطوير تطبيقات الموبايل بالـ Flutter وRiverpod',
      issueDate: '02 نوفمبر 2026',
      verificationUrl: 'http://localhost:8000/api/v1/certificates/CERT-EDU-2026-442',
      downloadUrl: 'http://localhost:8000/api/v1/certificates/CERT-EDU-2026-442/download',
      hours: 32,
    },
  ];

  const totalHours = courses.reduce((acc, c) => acc + c.durationHours, 0);

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        {onBackToCourses && (
          <button
            onClick={onBackToCourses}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة إلى لوحة الدورات والدروس</span>
          </button>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  طالب ومتدرب معتمد
                </span>
                <span className="text-xs text-slate-400">عضو منذ 2026</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">{currentUser?.name}</h1>
              <p className="text-xs text-slate-500">{currentUser?.email} • {currentUser?.phone || '+20 100 000 0000'}</p>
            </div>
          </div>

          {/* Quick Tabs Navigation */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl relative z-10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الشهادات الرقمية ({certificates.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              سجل المدفوعات ({paymentReceipts.length})
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{myEnrollments.length}</p>
            <p className="text-xs text-slate-500 font-medium">الدورات المسجلة</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{completedEnrollments.length || 1}</p>
            <p className="text-xs text-slate-500 font-medium">الدورات المكتملة</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
            <p className="text-xs text-slate-500 font-medium">الشهادات المعتمدة</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalHours} س</p>
            <p className="text-xs text-slate-500 font-medium">ساعات التدريب الإجمالية</p>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Enrolled Courses */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-black text-slate-900">مسار التعلّم والتقدم الحالي</h3>
                <span className="text-xs text-slate-500 font-medium">إنجاز الدبلومات</span>
              </div>

              <div className="space-y-4">
                {myEnrollments.map(enr => {
                  const course = courses.find(c => c.id === enr.courseId);
                  if (!course) return null;
                  return (
                    <div key={enr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={course.coverImage} alt={course.title} className="w-12 h-10 rounded-lg object-cover" />
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{course.title}</h4>
                            <p className="text-[11px] text-slate-500">المدرب: {course.instructorName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-indigo-600">{enr.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${enr.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Credentials Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">أحدث الشهادات</h3>
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/60 space-y-2">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] font-black uppercase tracking-wider">{cert.code}</span>
                    </div>
                    <h5 className="text-xs font-black text-slate-900 line-clamp-1">{cert.courseTitle}</h5>
                    <p className="text-[10px] text-slate-500">صدرت بتاريخ: {cert.issueDate}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={cert.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> تحميل PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Certificates Showcase */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> موثقة رقمياً
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">{cert.code}</span>
                    <h3 className="text-base font-black text-slate-900 leading-snug">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-500">إجمالي {cert.hours} ساعة تدريبية معتمدة مع مشروع تخرج عملي.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 font-medium">تاريخ المنح: {cert.issueDate}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={cert.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payment Ledger */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">سجل إيصالات التحويل البنكي والإلكتروني</h3>
                <p className="text-xs text-slate-500">متابعة حالة مراجعة الإيصالات اليدوية (InstaPay, Vodafone Cash, Fawry)</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {paymentReceipts.length} عمليات
              </span>
            </div>

            <div className="space-y-3">
              {paymentReceipts.map(receipt => {
                const course = courses.find(c => c.id === receipt.courseId);
                return (
                  <div
                    key={receipt.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{course?.title || 'طلب انضمام لدورة'}</h4>
                        <p className="text-[11px] text-slate-500">
                          طريقة الدفع: <span className="font-bold uppercase">{receipt.method}</span> • رقم العملية: {receipt.transactionRef || 'تحويل مباشر'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                      <span className="text-sm font-black text-slate-900">{receipt.amount} ج.م</span>
                      
                      {receipt.status === 'approved' && (
                        <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold text-xs border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> معتمد ومفعّل 🟢
                        </span>
                      )}
                      {receipt.status === 'pending' && (
                        <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-full font-bold text-xs border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> قيد التدقيق المالي ⏳
                        </span>
                      )}
                      {receipt.status === 'rejected' && (
                        <span className="text-rose-700 bg-rose-50 px-3 py-1 rounded-full font-bold text-xs border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> مرفوض 🔴
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
