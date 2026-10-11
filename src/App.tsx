import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Course } from './types';

import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { Hero } from './components/public/Hero';
import { CoursesList } from './components/public/CoursesList';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { FAQSection } from './components/public/FAQSection';
import { ContactSection } from './components/public/ContactSection';
import { CourseDetailModal } from './components/public/CourseDetailModal';

import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ManualPaymentModal } from './components/payment/ManualPaymentModal';

import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { InstructorDashboard } from './components/dashboards/InstructorDashboard';
import { TraineeDashboard } from './components/dashboards/TraineeDashboard';
import { TrainingAdvisorChatbot } from './components/ai/TrainingAdvisorChatbot';
import { FloatingChatbotWidget } from './components/ai/FloatingChatbotWidget';

import { useData } from './context/DataContext';

const MainAppContent: React.FC = () => {
  const { activeRole } = useAuth();
  const { courses } = useData();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const handleEnrollCourse = (course: Course) => {
    setSelectedCourseForPayment(course);
  };

  const handlePaymentSuccess = () => {
    setSelectedCourseForPayment(null);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900" dir="rtl">
      
      {/* Floating Demo Role Switcher Bar */}
      <DemoRoleSwitcher onSwitchTab={tab => setCurrentTab(tab)} />

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero
              onSearch={term => setSearchTerm(term)}
              onExploreCourses={() => setCurrentTab('courses')}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
            
            {/* Featured Courses Overview */}
            <CoursesList
              courses={courses.slice(0, 3)}
              onSelectCourse={c => setSelectedCourseForDetails(c)}
              onEnrollCourse={handleEnrollCourse}
              initialSearchTerm={searchTerm}
            />

            <ServicesSection />
            <AboutSection />
            <FAQSection />
            <ContactSection />
          </>
        )}

        {currentTab === 'courses' && (
          <CoursesList
            courses={courses}
            onSelectCourse={c => setSelectedCourseForDetails(c)}
            onEnrollCourse={handleEnrollCourse}
            initialSearchTerm={searchTerm}
          />
        )}

        {currentTab === 'services' && <ServicesSection />}
        {currentTab === 'about' && <AboutSection />}
        {currentTab === 'faq' && <FAQSection />}
        {currentTab === 'contact' && <ContactSection />}

        {currentTab === 'dashboard' && (
          <>
            {activeRole === 'admin' && <AdminDashboard />}
            {activeRole === 'instructor' && <InstructorDashboard />}
            {(activeRole === 'trainee' || activeRole === 'guest') && (
              <TraineeDashboard onExploreMoreCourses={() => setCurrentTab('courses')} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsLoginOpen(false);
          setIsForgotPasswordOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <CourseDetailModal
        course={selectedCourseForDetails}
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={handleEnrollCourse}
      />

      <ManualPaymentModal
        course={selectedCourseForPayment}
        isOpen={!!selectedCourseForPayment}
        onClose={() => setSelectedCourseForPayment(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* AI Training Advisor Chatbot Modal & Floating Launcher */}
      <TrainingAdvisorChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onSelectCourse={c => {
          setIsAIChatOpen(false);
          setSelectedCourseForDetails(c);
        }}
        onEnrollCourse={c => {
          setIsAIChatOpen(false);
          handleEnrollCourse(c);
        }}
      />

      <FloatingChatbotWidget
        isOpen={isAIChatOpen}
        onOpen={() => setIsAIChatOpen(true)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
