export type UserRole = 'admin' | 'instructor' | 'trainee' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  createdAt: string;
}

export type CourseLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'جميع المستويات';

export type PaymentMethodType = 'instapay' | 'vodafone_cash' | 'fawry';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isFreePreview?: boolean;
  fileUrl?: string;
  fileName?: string;
  description?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: string;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  durationHours: number;
  lessonsCount: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  coverImage: string;
  promoVideoUrl?: string;
  modules: CourseModule[];
  attachments: FileAttachment[];
  prerequisites: string[];
  learningOutcomes: string[];
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
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
  status: PaymentStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Enrollment {
  id: string;
  traineeId: string;
  courseId: string;
  status: PaymentStatus;
  paymentReceiptId: string;
  enrolledAt: string;
  progressPercent: number;
  completedLessons: string[];
  certificateIssued: boolean;
  certificateId?: string;
}

export interface FAQItem {
  id: string;
  category: 'التسجيل' | 'طرق الدفع' | 'شهادات الأكاديمية' | 'الدعم الفني';
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  courseName: string;
  avatar: string;
  comment: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface VPSSettings {
  domainName: string;
  serverIp: string;
  port: number;
  sslEnabled: boolean;
  pm2ProcessName: string;
  nodeEnv: string;
}
