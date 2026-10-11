import React from 'react';
import { GraduationCap, ShieldCheck, Award, Users, Search, ArrowLeft } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
  onExploreCourses: () => void;
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onExploreCourses, onOpenRegister }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onExploreCourses();
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text (RTL Right) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>أكاديمية التدريب والتأهيل المعتمدة رسمياً</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              طور مهاراتك مع أقوى <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-emerald-300">الدورات التدريبية المعتمدة</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              منصة تدريب إلكترونية متخصصة تقدم برامج عملية في البرمجة، تحليل البيانات، الذكاء الاصطناعي والتسويق مع شهادات معتمدة وتسهيلات دفع يدوي عبر InstaPay و Vodafone Cash و Fawry.
            </p>

            {/* Course Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 flex items-center gap-2 shadow-xl">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن اسم الدورة أو المجال (مثال: Full-Stack, UI/UX, Python)..."
                  className="w-full bg-transparent text-white text-sm placeholder-slate-400 focus:outline-none px-2 py-2"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                >
                  بحث
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreCourses}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5" />
                <span>استعراض الدورات المتاحة</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>انضم كمتدرب جديد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">+1,200</div>
                <div className="text-xs text-slate-400">متدرب معتمد</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">98%</div>
                <div className="text-xs text-slate-400">نسبة رضا المتدربين</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">+25</div>
                <div className="text-xs text-slate-400">دورة متخصصة</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="الأكاديمية"
                className="w-full h-80 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-5 -right-5 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold">اعتماد حقيقي ورسمي</div>
                  <div className="text-[10px] text-slate-500">شهادات قابلة للتحقق الفوري</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
