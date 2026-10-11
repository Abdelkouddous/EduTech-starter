import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  PhoneCall,
  Info,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAIChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogin,
  onOpenRegister,
  onOpenAIChat
}) => {
  const { currentUser, activeRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'courses', label: 'الدورات التدريبية', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'services', label: 'الخدمات', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'about', label: 'عن الأكاديمية', icon: <Info className="w-4 h-4" /> },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'contact', label: 'اتصل بنا', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-9 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Academy Logo */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                أكاديمية التعلم
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                  الاعتماد المباشر
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">منصة التدريب والتأهيل الرقمي</div>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* AI Assistant Button */}
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
                title="مساعد الذكاء الاصطناعي لتخطيط الدراسات"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>المساعد الذكي</span>
              </button>
            )}

            {activeRole !== 'guest' && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] font-semibold text-indigo-600">
                      {activeRole === 'admin' ? 'مدير النظام' : activeRole === 'instructor' ? 'مدرب معتمد' : 'متدرب'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 text-right cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>لوحة التحكم الخاصة بك</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-right cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>انضم كمتدرب</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-right cursor-pointer ${
                currentTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {activeRole !== 'guest' && currentUser ? (
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>الذهاب للوحة التحكم</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-sm font-bold border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                >
                  دخول
                </button>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-sm font-bold bg-indigo-600 text-white rounded-lg cursor-pointer"
                >
                  تسجيل حساب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
