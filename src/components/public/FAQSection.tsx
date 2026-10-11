import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { HelpCircle, ChevronDown, CreditCard, ShieldCheck } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs } = useData();
  const [openId, setOpenId] = useState<string | null>('faq_1');

  return (
    <div id="faq" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            الأسئلة الشائعة والإجابات
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            كل ما تود معرفته عن التسجيل وطرق الدفع والشهادات
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            إليك الإجابات الشافية عن أكثر الاستفسارات شيوعاً بين الطلاب والمتدربين.
          </p>
        </div>

        {/* Manual Payment Highlight Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 font-extrabold flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-300">طرق السداد المتاحة بدون بطاقة ائتمان</h4>
              <p className="text-xs text-slate-300">يدعم النظام InstaPay, Vodafone Cash, Fawry مع رفع لقطة شاشة الإيصال.</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold whitespace-nowrap">
            مراجعة فورية خلال دقائق ⚡
          </span>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-right flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
