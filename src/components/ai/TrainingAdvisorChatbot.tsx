import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Course } from '../../types';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  BookOpen,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Award,
  CreditCard,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Flame,
  BadgeCheck
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendedCourses?: Course[];
}

interface TrainingAdvisorChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export const TrainingAdvisorChatbot: React.FC<TrainingAdvisorChatbotProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onEnrollCourse
}) => {
  const { courses } = useData();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCareerQuiz, setShowCareerQuiz] = useState(false);

  // Career Matcher Quiz State
  const [quizStep, setQuizStep] = useState<1 | 2 | 3>(1);
  const [quizInterest, setQuizInterest] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  const [quizGoal, setQuizGoal] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `مرحباً بك في أكاديمية التعلم! 🎓✨\n\nأنا **المستشار التعليمي والمهني الذكي**. هنا لمساعدتك في فهم جميع البرامج التدريبية المتاحة، مقارنة المناهج، واختيار الدورة التدريبية الأنسب لأهدافك وسوق العمل.\n\nكيف يمكنني توجيهك اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      recommendedCourses: [courses[0], courses[1]].filter(Boolean)
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-5).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/ai/training-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'شكراً لسؤالك! يمكنك استكشاف دوراتنا بالتفصيل.';

      // Map recommended IDs to course objects
      const matchedCourses: Course[] = [];
      if (Array.isArray(data.recommendedCourseIds)) {
        for (const id of data.recommendedCourseIds) {
          const found = courses.find(c => c.id === id);
          if (found && !matchedCourses.some(m => m.id === found.id)) {
            matchedCourses.push(found);
          }
        }
      }

      // If no explicit IDs, match by keyword in response
      if (matchedCourses.length === 0) {
        if (replyText.includes('Full-Stack') || replyText.includes('تطوير تطبيقات الويب')) {
          const c = courses.find(item => item.id === 'course_fullstack');
          if (c) matchedCourses.push(c);
        }
        if (replyText.includes('UI/UX') || replyText.includes('تصميم واجهات')) {
          const c = courses.find(item => item.id === 'course_uiux');
          if (c) matchedCourses.push(c);
        }
        if (replyText.includes('تحليل البيانات') || replyText.includes('Power BI') || replyText.includes('Python')) {
          const c = courses.find(item => item.id === 'course_ai_data');
          if (c) matchedCourses.push(c);
        }
        if (replyText.includes('Flutter') || replyText.includes('الموبايل')) {
          const c = courses.find(item => item.id === 'course_flutter');
          if (c) matchedCourses.push(c);
        }
        if (replyText.includes('التسويق الرقمي') || replyText.includes('Marketing')) {
          const c = courses.find(item => item.id === 'course_digital_marketing');
          if (c) matchedCourses.push(c);
        }
      }

      const aiMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        recommendedCourses: matchedCourses.length > 0 ? matchedCourses : undefined
      };

      setMessages(prev => [...prev, aiMsg]);
      playChime();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: 'ai',
        text: 'يسعدنا دائماً خدمتك! جميع دوراتنا في (تطوير الويب، UI/UX، تحليل البيانات، تطبيقات الموبايل، والتسويق الرقمي) معتمدة ومفتوحة للتسجيل الفوري مع سداد مرن بالجنيه المصري عبر InstaPay وفودافون كاش وفوري.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        recommendedCourses: courses.slice(0, 2)
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleFinishQuiz = () => {
    setShowCareerQuiz(false);
    const quizSummaryPrompt = `أنا مهتم بمجال "${quizInterest}"، ومستواي الحالي "${quizLevel}"، وهدفي هو "${quizGoal}". ما هي الدورة التدريبية الأنسب لي في الأكاديمية وما هي خارطة الطريق التي تنصحني باتباعها؟`;
    handleSendMessage(quizSummaryPrompt);
    // Reset
    setQuizStep(1);
    setQuizInterest('');
    setQuizLevel('');
    setQuizGoal('');
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'ai',
        text: `تم إعادة ضبط المحادثة بنجاح! 🚀\n\nأنا جاهز للإجابة عن أي استفسار حول دوراتنا التدريبية، الأسعار، المناهج، أو خطوات السداد والتسجيل.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-all text-right font-sans" dir="rtl">
      <div
        className={`bg-white w-full sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 overflow-hidden ${
          isExpanded
            ? 'h-[95vh] sm:max-w-4xl max-w-full'
            : 'h-[85vh] sm:max-h-[700px] sm:max-w-2xl max-w-full'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-inner ring-2 ring-amber-300/40">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">مستشار التدريب والتوجيه المهني الذكي</h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>متصل الآن • اسأل عن الدورات، المناهج، الشهادات وطرق الدفع</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            {/* Career Quiz Trigger */}
            <button
              onClick={() => setShowCareerQuiz(true)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="اختبار تحديد المسار الأنسب"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تحديد مساري</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white cursor-pointer"
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل نغمة التنبيه'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Expand / Minimize Window */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white cursor-pointer"
              title={isExpanded ? 'تصغير النافذة' : 'تكبير النافذة'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Reset Chat */}
            <button
              onClick={handleResetChat}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white cursor-pointer"
              title="إعادة ضبط المحادثة"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl transition-colors text-slate-300 cursor-pointer"
              title="إغلاق المحادثة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Career Quiz Mini Modal / Overlay */}
        {showCareerQuiz && (
          <div className="bg-indigo-50 border-b border-indigo-200 p-4 sm:p-5 text-xs text-slate-800 space-y-3 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-indigo-950 text-sm">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>اختبار سريع لتحديد الدورة الأنسب لك (خطوة {quizStep} من 3)</span>
              </div>
              <button
                onClick={() => setShowCareerQuiz(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {quizStep === 1 && (
              <div className="space-y-2">
                <p className="font-bold text-slate-700">1. ما هو المجال الأكثر جذباً لاهتمامك؟</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'web', label: '💻 برمجة مواقع وتطبيقات الويب' },
                    { id: 'uiux', label: '🎨 تصميم واجهات وتجربة المستخدم' },
                    { id: 'data', label: '📊 تحليل البيانات وذكاء الأعمال' },
                    { id: 'mobile', label: '📱 تطبيقات الهواتف الذكية' },
                    { id: 'marketing', label: '🚀 التسويق الرقمي والإعلانات' },
                    { id: 'cloud', label: '☁️ الخوادم وهندسة السحابة DevOps' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuizInterest(opt.label);
                        setQuizStep(2);
                      }}
                      className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl font-bold text-slate-800 text-right transition-all cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-2">
                <p className="font-bold text-slate-700">2. ما هو مستواك وخبرتك السابقة في هذا المجال؟</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'beginner', label: '🌱 مبتدئ تماماً (من الصفر)' },
                    { id: 'basics', label: '📚 لدي مبادئ ومعرفة نظرية بسيطة' },
                    { id: 'intermediate', label: '⚡ متوسط وأسعى للعمل الاحترافي' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuizLevel(opt.label);
                        setQuizStep(3);
                      }}
                      className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl font-bold text-slate-800 text-right transition-all cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-2">
                <p className="font-bold text-slate-700">3. ما هو هدفك الرئيسي من التدريب؟</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'job', label: '💼 الحصول على وظيفة في شركة تقنية' },
                    { id: 'freelance', label: '🌍 العمل الحر (Freelancing) مع عملاء دوليين' },
                    { id: 'startup', label: '🚀 بناء مشروعي التجاري الخاص' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuizGoal(opt.label);
                        setTimeout(handleFinishQuiz, 100);
                      }}
                      className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl font-bold text-slate-800 text-right transition-all cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Chips Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center gap-2 text-xs shrink-0 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>أسئلة شائعة:</span>
          </span>
          {[
            'ما هو المسار الأفضل للمبتدئين؟',
            'ما هي تفاصيل دبلومة الـ Full-Stack؟',
            'كيف أسدد الرسوم عبر InstaPay وفودافون كاش؟',
            'هل توجد شهادات معتمدة ومشاريع؟',
            'ما الفرق بين UI/UX وتطوير الويب؟'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${
                msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-400 text-slate-950 font-black'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble & Content */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tl-none font-medium'
                      : 'bg-white text-slate-800 rounded-tr-none border border-slate-200/80 whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Course Recommendation Cards (if provided) */}
                {msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-extrabold text-indigo-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>الدورات التدريبية الموصى بها لك:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recommendedCourses.map(c => (
                        <div
                          key={c.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-2 group"
                        >
                          <div className="flex gap-2.5 items-start">
                            <img
                              src={c.coverImage}
                              alt={c.title}
                              className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                                {c.category}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 truncate mt-1 group-hover:text-indigo-600 transition-colors">
                                {c.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                                <span className="font-extrabold text-emerald-700">{c.price.toLocaleString()} ج.م</span>
                                {c.originalPrice && (
                                  <span className="text-slate-400 line-through text-[10px]">
                                    {c.originalPrice.toLocaleString()} ج.م
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                            <button
                              onClick={() => onSelectCourse(c)}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-center"
                            >
                              تفاصيل المنهج
                            </button>
                            <button
                              onClick={() => onEnrollCourse(c)}
                              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                            >
                              <span>سجل الآن</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[10px] text-slate-400 px-1 ${
                    msg.sender === 'user' ? 'text-left' : 'text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-2xl bg-amber-400/20 text-amber-600 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tr-none border border-slate-200 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-600 font-medium mr-1">
                  يقوم المستشار الذكي بمراجعة البرامج التدريبية لإفادتك...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="اكتب استفسارك هنا (مثلاً: ما هي متطلبات دبلومة الويب، أو كيف أسدد الرسوم؟)..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
            <BadgeCheck className="w-3 h-3 text-emerald-500" />
            <span>مدعوم بنموذج الذكاء الاصطناعي Gemini ومحدث بجميع مسارات وأسعار أكاديمية التعلم 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};
