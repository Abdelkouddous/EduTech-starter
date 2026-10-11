import React from 'react';
import { Video, Award, Users2, Laptop, Clock, ShieldCheck } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Video className="w-8 h-8 text-indigo-600" />,
      title: 'دورات تفاعلية مباشرة ومسجلة',
      desc: 'محاضرات لايف أسبوعية مع تطبيق عملي مباشر، وتسجيلات فائقة الجودة متاحة طوال فترة التدريب.'
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      title: 'شهادات تخرج معتمدة برقم توثيق',
      desc: 'تحصل على شهادة رسمية قابلة للطباعة والتحقق الفوري كدليل على المهارات التي اكتسبتها.'
    },
    {
      icon: <Users2 className="w-8 h-8 text-amber-600" />,
      title: 'تدريب واختبارات الشركات والمؤسسات',
      desc: 'برامج مخصصة لتدريب كوادر الشركات وفرق العمل وتأهيلهم بأحدث المهارات التقنية والتسويقية.'
    },
    {
      icon: <Laptop className="w-8 h-8 text-blue-600" />,
      title: 'مراجعة معارض الأعمال (Portfolio Review)',
      desc: 'تقييم شامل ومباشر من المدربين لمشروعاتك مع توجيهات لتحسين معارض أعمالك على GitHub أو Behance.'
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: 'تأكيد ودفع يدوي مرن',
      desc: 'إمكانية السداد السريع والآمن عبر InstaPay و Vodafone Cash و Fawry دون تعقيدات وبمراجعة سريعة.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-rose-600" />,
      title: 'استشارات وتوجيه مهني فردي (1-on-1)',
      desc: 'جلسات استشارية مع خبراء المجال لمساعدتك في اجتياز مقابلات العمل وبناء السيرة الذاتية.'
    }
  ];

  return (
    <div id="services" className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            خدمات أكاديمية التعلم
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            خدمات متكاملة تضمن لك التفوق المهني والتقني
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            نقدم حلولاً تعليمية متقدمة للمتسابقين، الطلاب، والمؤسسات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3 group"
            >
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
                {srv.icon}
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{srv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
