import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, MessageSquare, X } from 'lucide-react';

interface FloatingChatbotWidgetProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const FloatingChatbotWidget: React.FC<FloatingChatbotWidgetProps> = ({ onOpen, isOpen }) => {
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    // Show bubble after 2 seconds to attract attention gently
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2.5 font-sans pointer-events-auto" dir="rtl">
      {/* Speech Bubble Prompt */}
      {showBubble && (
        <div className="relative bg-white border border-indigo-100 shadow-xl rounded-2xl p-3 text-xs max-w-[240px] text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
            title="إغلاق التنبيه"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 font-extrabold text-indigo-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>محتار في اختيار الدورة؟</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            تحدث مع مستشارنا الذكي لمساعدتك في اختيار المسار التدريبي الأنسب لمستواك وسوق العمل!
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b border-l border-indigo-100 transform -rotate-45"></div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={onOpen}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white pl-4 pr-3 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border border-indigo-400/30"
        title="تحدث مع مستشار التدريب الذكي"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-inner ring-2 ring-amber-300/60 group-hover:rotate-6 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </div>

        <div className="text-right">
          <div className="text-xs font-black text-white flex items-center gap-1">
            <span>مستشار التدريب AI</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <p className="text-[10px] text-indigo-200 font-medium">اسأل عن المناهج والشهادات</p>
        </div>
      </button>
    </div>
  );
};
