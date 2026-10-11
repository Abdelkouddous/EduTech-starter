import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, UserCheck, GraduationCap, Eye, Zap } from 'lucide-react';

interface DemoRoleSwitcherProps {
  onSwitchTab?: (tab: string) => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onSwitchTab }) => {
  const { activeRole, switchDemoRole, currentUser } = useAuth();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'admin', label: 'مدير النظام (Admin)', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-purple-600' },
    { role: 'instructor', label: 'مدرب (Instructor)', icon: <UserCheck className="w-4 h-4" />, color: 'bg-blue-600' },
    { role: 'trainee', label: 'متدرب (Trainee)', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-emerald-600' },
    { role: 'guest', label: 'زائر / الموقع التعريفي', icon: <Eye className="w-4 h-4" />, color: 'bg-slate-600' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchDemoRole(role);
    if (onSwitchTab) {
      if (role === 'guest') {
        onSwitchTab('home');
      } else {
        onSwitchTab('dashboard');
      }
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Zap className="w-3.5 h-3.5" /> تبديل الصلاحيات للتجربة السريعة:
          </span>
          {currentUser && (
            <span className="text-slate-300 hidden md:inline">
              المستخدم الحالي: <strong className="text-white">{currentUser.name}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map(r => {
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleRoleSelect(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `${r.color} text-white shadow-sm ring-2 ring-white/20 font-bold`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
