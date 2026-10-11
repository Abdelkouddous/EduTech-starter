import React from 'react';
import { Target, Lightbulb, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div id="about" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-right">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              من نحن - رؤيتنا وقيمنا
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              أكاديمية التعلم: جسرك الحقيقي نحو الوظيفة والتميز المهاراتي
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تأسست أكاديمية التعلم بهدف تقديم تدريب إلكتروني عملي ومبسط في الوطن العربي. نحن نركز على جودة المحتوى، كفاءة المدربين الميدانية، ومتابعة كل متدرب حتى تمكنه الكامل من المهارة المطلوب تعلمها.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <Target className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">رسالتنا</h4>
                  <p className="text-xs text-slate-600">تمكين الشباب العربي من اكتساب المهارات الأكثر طلباً في سوق العمل المحلي والدولي.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">رؤيتنا</h4>
                  <p className="text-xs text-slate-600">أن نكون الأكاديمية الأولى والموثوقة في تقديم البرامج التدريبية المعتمدة عالية الجودة.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
                alt="عن الأكاديمية"
                className="rounded-2xl shadow-xl w-full h-80 object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 space-y-1 max-w-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                  <ShieldCheck className="w-5 h-5" /> الاعتماد والتأهيل
                </div>
                <p className="text-[11px] text-slate-300">نظام متابعة مستمر ومناهج تواكب أحدث المستجدات التقنية لعام 2026.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
