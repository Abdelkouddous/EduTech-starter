import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  PaymentReceipt,
  Enrollment,
  FAQItem,
  Testimonial,
  ContactMessage,
  VPSSettings,
  PaymentStatus,
  PaymentMethodType,
  FileAttachment
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_PAYMENT_RECEIPTS,
  INITIAL_ENROLLMENTS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS
} from '../data/initialData';

interface DataContextType {
  courses: Course[];
  paymentReceipts: PaymentReceipt[];
  enrollments: Enrollment[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
  vpsSettings: VPSSettings;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'reviewsCount' | 'studentsCount' | 'rating'>) => Course;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  submitPaymentReceipt: (data: {
    traineeId: string;
    traineeName: string;
    traineeEmail: string;
    traineePhone: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    method: PaymentMethodType;
    senderAccountOrNumber: string;
    transactionRef: string;
    receiptImageUrl: string;
  }) => PaymentReceipt;
  reviewPaymentReceipt: (receiptId: string, status: PaymentStatus, rejectionReason?: string) => void;
  submitContactMessage: (msg: { name: string; email: string; phone: string; subject: string; message: string }) => void;
  updateVPSSettings: (newSettings: Partial<VPSSettings>) => void;
  addCourseAttachment: (courseId: string, attachment: Omit<FileAttachment, 'id' | 'uploadedAt'>) => void;
  markLessonComplete: (traineeId: string, courseId: string, lessonId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('academy_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(() => {
    const saved = localStorage.getItem('academy_payment_receipts');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_RECEIPTS;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('academy_enrollments');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLMENTS;
  });

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [testimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('academy_contact_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [vpsSettings, setVpsSettings] = useState<VPSSettings>(() => {
    const saved = localStorage.getItem('academy_vps_settings');
    return saved
      ? JSON.parse(saved)
      : {
          domainName: 'academy.example.com',
          serverIp: '185.220.101.45',
          port: 3000,
          sslEnabled: true,
          pm2ProcessName: 'academy-platform',
          nodeEnv: 'production'
        };
  });

  useEffect(() => {
    localStorage.setItem('academy_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('academy_payment_receipts', JSON.stringify(paymentReceipts));
  }, [paymentReceipts]);

  useEffect(() => {
    localStorage.setItem('academy_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('academy_contact_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('academy_vps_settings', JSON.stringify(vpsSettings));
  }, [vpsSettings]);

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'reviewsCount' | 'studentsCount' | 'rating'>): Course => {
    const newCourse: Course = {
      ...courseData,
      id: `course_${Date.now()}`,
      createdAt: new Date().toISOString(),
      reviewsCount: 0,
      studentsCount: 0,
      rating: 5.0
    };
    setCourses(prev => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const submitPaymentReceipt = (data: {
    traineeId: string;
    traineeName: string;
    traineeEmail: string;
    traineePhone: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    method: PaymentMethodType;
    senderAccountOrNumber: string;
    transactionRef: string;
    receiptImageUrl: string;
  }): PaymentReceipt => {
    const newReceipt: PaymentReceipt = {
      id: `receipt_${Date.now()}`,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const newEnrollment: Enrollment = {
      id: `enroll_${Date.now()}`,
      traineeId: data.traineeId,
      courseId: data.courseId,
      status: 'pending',
      paymentReceiptId: newReceipt.id,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      completedLessons: [],
      certificateIssued: false
    };

    setPaymentReceipts(prev => [newReceipt, ...prev]);
    setEnrollments(prev => [newEnrollment, ...prev]);
    return newReceipt;
  };

  const reviewPaymentReceipt = (receiptId: string, status: PaymentStatus, rejectionReason?: string) => {
    const reviewedAt = new Date().toISOString();
    
    setPaymentReceipts(prev =>
      prev.map(r => (r.id === receiptId ? { ...r, status, rejectionReason, reviewedAt } : r))
    );

    // Also update associated enrollment
    const receipt = paymentReceipts.find(r => r.id === receiptId);
    if (receipt) {
      setEnrollments(prev =>
        prev.map(e =>
          e.paymentReceiptId === receiptId || (e.traineeId === receipt.traineeId && e.courseId === receipt.courseId)
            ? { ...e, status }
            : e
        )
      );

      // Increment course student count if approved
      if (status === 'approved') {
        setCourses(prev =>
          prev.map(c => c.id === receipt.courseId ? { ...c, studentsCount: c.studentsCount + 1 } : c)
        );
      }
    }
  };

  const submitContactMessage = (msg: { name: string; email: string; phone: string; subject: string; message: string }) => {
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      ...msg,
      submittedAt: new Date().toISOString(),
      read: false
    };
    setContactMessages(prev => [newMessage, ...prev]);
  };

  const updateVPSSettings = (newSettings: Partial<VPSSettings>) => {
    setVpsSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addCourseAttachment = (courseId: string, attachment: Omit<FileAttachment, 'id' | 'uploadedAt'>) => {
    const newAtt: FileAttachment = {
      id: `att_${Date.now()}`,
      ...attachment,
      uploadedAt: new Date().toISOString()
    };
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, attachments: [...c.attachments, newAtt] } : c))
    );
  };

  const markLessonComplete = (traineeId: string, courseId: string, lessonId: string) => {
    setEnrollments(prev =>
      prev.map(e => {
        if (e.traineeId === traineeId && e.courseId === courseId) {
          const completed = e.completedLessons.includes(lessonId)
            ? e.completedLessons
            : [...e.completedLessons, lessonId];
          
          const course = courses.find(c => c.id === courseId);
          const totalLessons = course ? course.lessonsCount || 10 : 10;
          const progressPercent = Math.min(100, Math.round((completed.length / totalLessons) * 100));
          const certificateIssued = progressPercent >= 80;

          return {
            ...e,
            completedLessons: completed,
            progressPercent,
            certificateIssued
          };
        }
        return e;
      })
    );
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        paymentReceipts,
        enrollments,
        faqs,
        testimonials,
        contactMessages,
        vpsSettings,
        addCourse,
        updateCourse,
        deleteCourse,
        submitPaymentReceipt,
        reviewPaymentReceipt,
        submitContactMessage,
        updateVPSSettings,
        addCourseAttachment,
        markLessonComplete
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
