import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface AICourseAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICourseAssistantModal: React.FC<AICourseAssistantModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [contextType, setContextType] = useState<'qa' | 'syllabus'>('qa');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'مرحباً بك! أنا المستشار التعليمي المعتمد بأكاديمية التعلم. كيف يمكنني مساعدتك اليوم؟ يمكنك اختباري في وضع المنهج التدريبي أو الإجابة عن الاستفسارات الدراسية.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, contextType })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: data.reply || 'تم استلام استفسارك بنجاح!' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'عذراً، حدث خطأ في معالجة طلب الذكاء الاصطناعي. أعد المحاولة لاحقاً.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative border border-slate-100 flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">مساعد الأكاديمية الذكي (Gemini AI)</h3>
              <p className="text-[11px] text-slate-500">تخطيط المناهج والإجابة عن الاستفسارات التدريبية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="py-3 shrink-0 flex items-center gap-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-600">نوع الطلب:</span>
          <button
            type="button"
            onClick={() => setContextType('qa')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              contextType === 'qa' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            استفسار عام دراسي
          </button>
          <button
            type="button"
            onClick={() => setContextType('syllabus')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              contextType === 'syllabus' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            إعداد هيكل دورة جديدة
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-500 text-slate-900 font-bold'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tl-none'
                    : 'bg-slate-100 text-slate-800 rounded-tr-none border border-slate-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>جاري تفكير وصياغة الرد الذكي...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={
              contextType === 'syllabus'
                ? 'اكتب عنوان الدورة المراد إعداد منهجها (مثال: الذكاء الاصطناعي لتطبيقات الجوال)...'
                : 'اكتب سؤالك أو استفسارك التعليمي هنا...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>إرسال</span>
          </button>
        </form>

      </div>
    </div>
  );
};
