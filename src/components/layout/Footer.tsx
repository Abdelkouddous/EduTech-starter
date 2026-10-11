import React from 'react';
import { GraduationCap, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">أكاديمية التعلم</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة إلكترونية متكاملة لتقديم الدورات التدريبية المعتمدة في مجالات البرمجة، إدارة الأعمال، الذكاء الاصطناعي، والتصميم لربط المتدرب بسوق العمل الحديث.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> شهادات معتمدة ورسمية
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-indigo-500 pr-2">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('courses')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  استعراض جميع الدورات المتاحة
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('services')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  خدمات التدريب المؤسسي والشخصي
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  رؤية الأكاديمية واعتماداتنا
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('faq')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  أسئلة وتأكيد المدفوعات اليدوية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  تواصل مع إدارة القبول والتسجيل
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Manual Payment Accepted Methods */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-amber-500 pr-2">طرق الدفع اليدوي المتاحة</h4>
            <p className="text-xs text-slate-400 mb-3">
              نقبل التحويل المباشر عبر الوسائل التالية مع مراجعة فورية وتأكيد اشتراكك:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-xs font-bold text-white">InstaPay (إنستا باي)</span>
                <span className="text-[10px] text-purple-300 mr-auto">تحويل لحظي</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-xs font-bold text-white">Vodafone Cash (فودافون كاش)</span>
                <span className="text-[10px] text-red-300 mr-auto">محفظة إلكترونية</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-white">Fawry (فوري)</span>
                <span className="text-[10px] text-amber-300 mr-auto">كود خدمة</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-emerald-500 pr-2">معلومات الاتصال والدعم</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@academy-learning.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>القاهرة، مصر - المقر الرئيسي لأكاديمية التعلم</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} أكاديمية التعلم للتدريب والتأهيل. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>تم التطوير والنشر بجودة عالية</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>جاهز للربط على خوادم VPS والنشر المباشر.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
