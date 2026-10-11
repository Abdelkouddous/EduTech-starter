import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { X, Mail, Lock, LogIn, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('الرجاء إدخال البريد الإلكتروني');
      return;
    }
    const ok = login(email, selectedRole);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    }
  };

  const handleQuickDemoLogin = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setSelectedRole(role);
    login(demoEmail, role);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">تسجيل الدخول إلى الأكاديمية</h3>
          <p className="text-xs text-slate-500 mt-1">مرحباً بك مجدداً، أدخل بياناتك للمتابعة</p>
        </div>

        {/* Quick Demo Selector */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5">
          <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> دخول سريع بحسابات التجربة:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin', 'admin@academy.com')}
              className="px-2 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg text-center cursor-pointer transition-colors"
            >
              مدير النظام
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('instructor', 'tarek@academy.com')}
              className="px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg text-center cursor-pointer transition-colors"
            >
              مدرب معتمد
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('trainee', 'mahmoud@gmail.com')}
              className="px-2 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-center cursor-pointer transition-colors"
            >
              حساب متدرب
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg font-bold border border-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> تم تسجيل الدخول بنجاح!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="example@domain.com"
                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">كلمة المرور</label>
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          ليس لديك حساب بعد؟{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            إنشاء حساب جديد
          </button>
        </div>

      </div>
    </div>
  );
};
