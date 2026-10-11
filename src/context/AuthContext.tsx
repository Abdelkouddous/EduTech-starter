import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  activeRole: UserRole;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, phone?: string) => User;
  switchDemoRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  addUserByAdmin: (user: Omit<User, 'id' | 'createdAt'>) => User;
  deleteUser: (userId: string) => void;
  resetPasswordEmail: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('academy_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('academy_current_user');
    if (savedUser) return JSON.parse(savedUser);
    // Default logged in user for smooth evaluation: Trainee or Admin
    return INITIAL_USERS.find(u => u.role === 'trainee') || INITIAL_USERS[0];
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  useEffect(() => {
    localStorage.setItem('academy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('academy_current_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    } else {
      localStorage.removeItem('academy_current_user');
      setActiveRole('guest');
    }
  }, [currentUser]);

  const login = (email: string, preferredRole?: UserRole): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // If not found, create a demo user with requested role
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0] || 'مستخدم جديد',
      email,
      role: preferredRole || 'trainee',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('guest');
  };

  const register = (name: string, email: string, role: UserRole, phone?: string): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      setActiveRole('guest');
      return;
    }
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      // Create fallback user for this role
      const roleUser: User = {
        id: `user_demo_${role}`,
        name: role === 'admin' ? 'د. أحمد منصور (مدير)' : role === 'instructor' ? 'م. طارق فاروق (مدرب)' : 'محمود حسن (متدرب)',
        email: `${role}@academy.com`,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, roleUser]);
      setCurrentUser(roleUser);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const addUserByAdmin = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const resetPasswordEmail = (email: string): boolean => {
    console.log(`Password reset link sent to: ${email}`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        activeRole,
        login,
        logout,
        register,
        switchDemoRole,
        updateProfile,
        updateUserRole,
        addUserByAdmin,
        deleteUser,
        resetPasswordEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
