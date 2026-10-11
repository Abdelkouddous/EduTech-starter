import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Course, PaymentReceipt, PaymentStatus, UserRole, User } from '../../types';
import { VPSDeploymentGuide } from '../vps/VPSDeploymentGuide';
import {
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Eye,
  CreditCard,
  Building2,
  Server,
  ShieldCheck,
  Search,
  Check,
  X,
  FileText,
  Video,
  TrendingUp,
  Award,
  BarChart3,
  Percent,
  Activity,
  ArrowUpRight,
  RefreshCw,
  UserPlus,
  ShieldAlert,
  Sliders,
  DollarSign,
  Smartphone,
  ExternalLink,
  Code
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    courses,
    paymentReceipts,
    enrollments,
    addCourse,
    updateCourse,
    deleteCourse,
    reviewPaymentReceipt
  } = useData();

  const { users, updateUserRole, addUserByAdmin, deleteUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'courses' | 'users' | 'analytics' | 'vps'>('overview');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('pending');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'all'>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('برمجة وتطوير');
  const [coursePrice, setCoursePrice] = useState(3000);
  const [courseInstructor, setCourseInstructor] = useState('م. طارق فاروق');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCover, setCourseCover] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80');

  // User Add/Edit Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('trainee');
  const [newUserPhone, setNewUserPhone] = useState('');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  // Computed Analytical Metrics
  const pendingReceipts = paymentReceipts.filter(r => r.status === 'pending');
  const pendingReceiptsCount = pendingReceipts.length;
  const approvedReceipts = paymentReceipts.filter(r => r.status === 'approved');

  const totalApprovedRevenue = approvedReceipts.reduce((sum, r) => sum + r.amount, 0);

  // Method Breakdown Statistics
  const instaPayRevenue = approvedReceipts
    .filter(r => r.method === 'instapay')
    .reduce((sum, r) => sum + r.amount, 0);
  const vodafoneRevenue = approvedReceipts
    .filter(r => r.method === 'vodafone_cash')
    .reduce((sum, r) => sum + r.amount, 0);
  const fawryRevenue = approvedReceipts
    .filter(r => r.method === 'fawry')
    .reduce((sum, r) => sum + r.amount, 0);

  const instaPayCount = approvedReceipts.filter(r => r.method === 'instapay').length;
  const vodafoneCount = approvedReceipts.filter(r => r.method === 'vodafone_cash').length;
  const fawryCount = approvedReceipts.filter(r => r.method === 'fawry').length;

  // Monthly Analytics Mock Bar Data
  const monthlyData = [
    { month: 'يناير', revenue: 24500, students: 42 },
    { month: 'فبراير', revenue: 38200, students: 68 },
    { month: 'مارس', revenue: 45000, students: 85 },
    { month: 'أبريل', revenue: 52000, students: 96 },
    { month: 'مايو', revenue: 61000, students: 110 },
    { month: 'يونيو', revenue: 78500, students: 145 },
    { month: 'يوليو', revenue: 92000, students: 172 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  // Handlers
  const handleOpenCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseTitle(course.title);
      setCourseCategory(course.category);
      setCoursePrice(course.price);
      setCourseInstructor(course.instructorName);
      setCourseDesc(course.description);
      setCourseCover(course.coverImage);
    } else {
      setEditingCourse(null);
      setCourseTitle('');
      setCourseCategory('برمجة وتطوير');
      setCoursePrice(2500);
      setCourseInstructor('م. طارق فاروق');
      setCourseDesc('');
      setCourseCover('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80');
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        title: courseTitle,
        category: courseCategory,
        price: Number(coursePrice),
        instructorName: courseInstructor,
        description: courseDesc,
        coverImage: courseCover
      });
    } else {
      addCourse({
        title: courseTitle,
        slug: courseTitle.toLowerCase().replace(/\s+/g, '-'),
        description: courseDesc || 'دورة تدريبية احترافية معتمدة بأكاديمية التعلم.',
        fullDescription: courseDesc || 'شرح عملي ومبسط مع مراجعات مستمرة.',
        category: courseCategory,
        level: 'جميع المستويات',
        price: Number(coursePrice),
        durationHours: 40,
        lessonsCount: 20,
        instructorId: 'user_inst_1',
        instructorName: courseInstructor,
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        coverImage: courseCover,
        modules: [],
        attachments: [],
        prerequisites: ['لا تتطلب خبرة سابقة'],
        learningOutcomes: ['إتقان العمل والتطبيق المباشر'],
        isPublished: true
      });
    }
    setShowCourseModal(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUserByAdmin({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      phone: newUserPhone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUserEmail}`
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setShowUserModal(false);
  };

  // Filtered Payments
  const filteredReceipts = paymentReceipts.filter(r => {
    const matchesStatus = paymentFilter === 'all' ? true : r.status === paymentFilter;
    const matchesMethod = methodFilter === 'all' ? true : r.method === methodFilter;
    return matchesStatus && matchesMethod;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'all' ? true : u.role === userRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearchTerm));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card with Laravel Backend Integration Note */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> لوحة تحكم الإدارة العليا (Admin MVP)
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> جاهز للربط مع Laravel Backend REST APIs
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">إدارة المنصة، الإحصائيات الشاملة والمدفوعات اليدوية</h1>
            <p className="text-xs text-slate-500">
              واجهة تفاعلية متكاملة لإدارة المتدربين، مراجعة إيصالات التحويل (InstaPay, Vodafone Cash, Fawry)، وتأهيل النظام للربط بـ Laravel API.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenCourseModal()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة دورة جديدة</span>
            </button>
            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>إضافة مستخدم</span>
            </button>
          </div>
        </div>

        {/* Developer Integration Callout Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-900/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
              <Code className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-slate-100">هيكل البيانات البرمجي جاهز للاستبدال بـ Laravel Controllers & Services:</p>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Routes: GET /api/v1/admin/stats • GET /api/v1/admin/payments • POST /api/v1/admin/payments/review • GET /api/v1/admin/users
              </p>
            </div>
          </div>
          <a
            href="#vps"
            onClick={() => setActiveTab('vps')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px] whitespace-nowrap"
          >
            <span>استعراض ملف التكوين النشر</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 الإحصائيات والنظرة العامة</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 relative ${
              activeTab === 'payments' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>💳 مراجعة التحويلات المالية</span>
            {pendingReceiptsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full font-black animate-pulse">
                {pendingReceiptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 إدارة الدورات ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 المستخدمين والأدوار ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>📈 تحليلات النمو والإيرادات</span>
          </button>

          <button
            onClick={() => setActiveTab('vps')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vps' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>⚙️ إعدادات VPS و Laravel</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & COMPREHENSIVE STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Major Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Trainees */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>إجمالي المتدربين المسجلين</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">1,248</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.2% نمو هذا الشهر</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                  <span>المتدربين النشطين: 890</span>
                  <span>الخريجين: 358</span>
                </div>
              </div>

              {/* Card 2: Active Courses */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>الدورات التدريبية المتاحة</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">{courses.length}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mt-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>جميعها معتمدة ومفتوحة للتسجيل</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                  <span>دورات برمجة: 14</span>
                  <span>بيانات وتصنيف: 10</span>
                </div>
              </div>

              {/* Card 3: Pending Payments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>طلبات تحويل معلقة</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600 font-mono">{pendingReceiptsCount}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
                    <span>تتطلب مراجعة صورة الإيصال</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                  <span>متوسط زمن المراجعة: 18 دقيقة</span>
                </div>
              </div>

              {/* Card 4: Net Approved Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>إجمالي الإيرادات المعتمدة</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    {totalApprovedRevenue > 0 ? totalApprovedRevenue.toLocaleString() : '184,500'} ج.م
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.5% ارتفاع في التحصيل اليدوي</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                  <span>InstaPay • Vodafone Cash • Fawry</span>
                </div>
              </div>

            </div>

            {/* Payment Method Distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Payment Methods Breakdown Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span>توزيع الإيرادات حسب وسيلة التحويل اليدوي</span>
                    </h3>
                    <p className="text-xs text-slate-500">إحصائيات المدفوعات المعتمدة المقبولة عبر الوسائل المصرية الثلاث.</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-mono">
                    3 وسائل مفعّلة
                  </span>
                </div>

                <div className="space-y-4">
                  {/* InstaPay */}
                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                        <span className="text-purple-900 font-extrabold">InstaPay (إنستا باي - تحويل لحظي)</span>
                      </div>
                      <span className="text-purple-950 font-mono font-black">{instaPayRevenue > 0 ? instaPayRevenue.toLocaleString() : '83,025'} ج.م (45%)</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-[11px] text-purple-700 flex justify-between">
                      <span>عدد المعاملات المقبولة: {instaPayCount || 18} عملية</span>
                      <span>الرسوم: 0.00 ج.م (مجاني)</span>
                    </p>
                  </div>

                  {/* Vodafone Cash */}
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-600"></span>
                        <span className="text-red-900 font-extrabold">Vodafone Cash (فودافون كاش)</span>
                      </div>
                      <span className="text-red-950 font-mono font-black">{vodafoneRevenue > 0 ? vodafoneRevenue.toLocaleString() : '64,575'} ج.م (35%)</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <p className="text-[11px] text-red-700 flex justify-between">
                      <span>عدد المعاملات المقبولة: {vodafoneCount || 14} عملية</span>
                      <span>رقم الاستلام: 01099887766</span>
                    </p>
                  </div>

                  {/* Fawry */}
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="text-amber-900 font-extrabold">Fawry Pay (كود خدمة فوري)</span>
                      </div>
                      <span className="text-amber-950 font-mono font-black">{fawryRevenue > 0 ? fawryRevenue.toLocaleString() : '36,900'} ج.م (20%)</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <p className="text-[11px] text-amber-700 flex justify-between">
                      <span>عدد المعاملات المقبولة: {fawryCount || 8} عملية</span>
                      <span>كود الخدمة: 98452</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* System & VPS Status Overview */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-600" />
                    <span>حالة خادم النشر VPS & Laravel</span>
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>يعمل بكفاءة</span>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-bold">عنوان الخادم (IP Address):</span>
                    <span className="font-mono font-black text-slate-900">185.220.101.45</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-bold">بيئة التشغيل (Environment):</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Production (Node 20 + Laravel Proxy)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-bold">شهادة التشفير (SSL Certificate):</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> صالحة (Let's Encrypt)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-bold">عمليات PM2 Process:</span>
                    <span className="font-mono font-bold text-slate-800">academy-platform (Online)</span>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-950 text-[11px] leading-relaxed">
                    💡 <strong>تنويه الربط الخادمي:</strong> عند إتمام برمجة Laravel Backend، يمكنك تغيير عنوان API Endpoint في ملف <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-indigo-700">src/config/api.ts</code> ليرتبط المجلد بـ REST API بكل سلاسة.
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Pending Transactions Quick Action */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">أحدث طلبات التسجيل بانتظار التأكيد المالي</h3>
                  <p className="text-xs text-slate-500">تحقق من صحة صورة إيصال التحويل ورقم العملية للتفعيل المباشر.</p>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>عرض جميع الطلبات ({paymentReceipts.length})</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {pendingReceipts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  🎉 لا توجد طلبات معلقة حالياً! جميع الإيصالات مراجعة ومفعلة.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">المتدرب</th>
                        <th className="p-3">الدورة المطلوب التسجيل بها</th>
                        <th className="p-3">وسيلة السداد</th>
                        <th className="p-3">المبلغ</th>
                        <th className="p-3">الرقم المرجعي</th>
                        <th className="p-3 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {pendingReceipts.slice(0, 5).map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{r.traineeName}</div>
                            <div className="text-[10px] text-slate-500">{r.traineePhone}</div>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{r.courseTitle}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold">
                              {r.method === 'instapay' ? 'InstaPay' : r.method === 'vodafone_cash' ? 'فودافون كاش' : 'Fawry'}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-emerald-700 font-mono">{r.amount.toLocaleString()} ج.م</td>
                          <td className="p-3 font-mono text-[11px] text-slate-600">{r.transactionRef}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedReceipt(r)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>فحص الإيصال</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MANUAL PAYMENTS VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">مراجعة وإقرار إيصالات الدفع اليدوي</h3>
                <p className="text-xs text-slate-500">قم بفحص صورة الإيصال ورقم العملية ثم اضغط تأكيد لتأهيل المتدرب ودخوله المحتوى التعليمي.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setPaymentFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      paymentFilter === 'pending' ? 'bg-amber-500 text-slate-900 font-black' : 'text-slate-600'
                    }`}
                  >
                    قيد الانتظار ({paymentReceipts.filter(r => r.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setPaymentFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      paymentFilter === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    المقبولة ({paymentReceipts.filter(r => r.status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setPaymentFilter('all')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      paymentFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    الكل ({paymentReceipts.length})
                  </button>
                </div>

                <select
                  value={methodFilter}
                  onChange={e => setMethodFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="all">جميع الوسائل</option>
                  <option value="instapay">InstaPay (إنستا باي)</option>
                  <option value="vodafone_cash">Vodafone Cash (فودافون كاش)</option>
                  <option value="fawry">Fawry (فوري)</option>
                </select>
              </div>
            </div>

            {/* Receipts Table */}
            {filteredReceipts.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                لا توجد طلبات سداد مطابقة للفلتر المباشر.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">المتدرب</th>
                      <th className="p-3">الدورة</th>
                      <th className="p-3">طريقة الدفع</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">الرقم المرجعي / العملية</th>
                      <th className="p-3">تاريخ الإرسال</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredReceipts.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{r.traineeName}</div>
                          <div className="text-[10px] text-slate-500">{r.traineePhone}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800 max-w-xs truncate">{r.courseTitle}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold">
                            {r.method === 'instapay' ? 'InstaPay' : r.method === 'vodafone_cash' ? 'فودافون كاش' : 'Fawry'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-700 font-mono">{r.amount.toLocaleString()} ج.م</td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">{r.transactionRef}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{new Date(r.submittedAt).toLocaleDateString('ar-EG')}</td>
                        <td className="p-3">
                          {r.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 w-fit">
                              ⏳ قيد الفحص
                            </span>
                          )}
                          {r.status === 'approved' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-fit">
                              🟢 تم القبول والتفعيل
                            </span>
                          )}
                          {r.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-1 w-fit">
                              🔴 مرفوض
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedReceipt(r)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة الإيصال</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COURSES MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">إدارة البرامج والمناهج التدريبية</h3>
                <p className="text-xs text-slate-500">إضافة وتحديث الدورات، تحديد أسعارها بالجنيه المصري، وتعيين المدرب المسلم.</p>
              </div>
              <button
                onClick={() => handleOpenCourseModal()}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة دورة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <div key={course.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="space-y-3">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-36 rounded-xl object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {course.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{course.title}</h4>
                      <p className="text-xs font-bold text-emerald-700 mt-1 font-mono">{course.price.toLocaleString()} ج.م</p>
                      <p className="text-[11px] text-slate-500 mt-1">المدرب: {course.instructorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-bold">{course.studentsCount} متدرب مسجل</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenCourseModal(course)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                        title="تعديل الدورة"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف الدورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: USER & ROLE MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">إدارة مستخدمي النظام والأدوار والصلاحيات</h3>
                <p className="text-xs text-slate-500">فصل الأدوار الدقيق: مدراء (Admin)، مدربين (Instructor)، ومتدربين (Trainee).</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={e => setUserSearchTerm(e.target.value)}
                    placeholder="بحث بالاسم أو البريد..."
                    className="w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="admin">مدير نظام (Admin)</option>
                  <option value="instructor">مدرب معتمد (Instructor)</option>
                  <option value="trainee">متدرب (Trainee)</option>
                </select>

                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة مستخدم</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">المستخدم</th>
                    <th className="p-3">البريد الإلكتروني</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3">الدور الحالي</th>
                    <th className="p-3">تاريخ التسجيل</th>
                    <th className="p-3 text-center">تغيير الصلاحية</th>
                    <th className="p-3 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="p-3 flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">{u.email}</td>
                      <td className="p-3 text-slate-600">{u.phone || '-'}</td>
                      <td className="p-3">
                        {u.role === 'admin' && (
                          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                            🛡️ مدير نظام
                          </span>
                        )}
                        {u.role === 'instructor' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                            👨‍🏫 مدرب معتمد
                          </span>
                        )}
                        {u.role === 'trainee' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            🎓 متدرب
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{new Date(u.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 text-center">
                        <select
                          value={u.role}
                          onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"
                        >
                          <option value="trainee">متدرب (Trainee)</option>
                          <option value="instructor">مدرب (Instructor)</option>
                          <option value="admin">مدير (Admin)</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="حذف المستخدم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REVENUE & GROWTH ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>تحليلات النمو الشهري والإيرادات التحصيلية</span>
              </h3>
              <p className="text-xs text-slate-500">مقارنة نمو الاشتراكات والإيرادات بالجنيه المصري عبر الأشهر السابقة.</p>
            </div>

            {/* Visual Bar Chart Comparison */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700">معدل الإيراد الشهري (بالجنيه المصري):</h4>
              <div className="grid grid-cols-7 gap-2 items-end h-48 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {monthlyData.map((d, i) => {
                  const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-600 hidden sm:inline">
                        {(d.revenue / 1000).toFixed(1)}k
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[32px] bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg transition-all hover:brightness-110"
                        title={`${d.month}: ${d.revenue.toLocaleString()} ج.م (${d.students} متدرب)`}
                      ></div>
                      <span className="text-[11px] font-bold text-slate-700">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">نسبة نجاح السداد اليدوي:</span>
                <p className="text-xl font-black text-emerald-600 font-mono">94.2%</p>
                <p className="text-[10px] text-slate-400">من إجمالي الإيصالات المرفوعة</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">متوسط قيمة الاشتراك:</span>
                <p className="text-xl font-black text-indigo-600 font-mono">2,850 ج.م</p>
                <p className="text-[10px] text-slate-400">للدورة الواحدة للمتدرب</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">الوسيلة الأكثر شعبية:</span>
                <p className="text-xl font-black text-purple-700 font-mono">InstaPay (45%)</p>
                <p className="text-[10px] text-slate-400">تليها Vodafone Cash ثم Fawry</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: VPS DEPLOYMENT GUIDE */}
        {activeTab === 'vps' && <VPSDeploymentGuide />}

      </div>

      {/* Course Create/Edit Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-100 text-right">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-4">
              {editingCourse ? 'تعديل بيانات الدورة' : 'إنشاء دورة تدريبية جديدة'}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الدورة التدريبية *</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="مثال: الدبلومة الشاملة لتطوير تطبيقات الويب"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المجال / القسم</label>
                  <select
                    value={courseCategory}
                    onChange={e => setCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="برمجة وتطوير">برمجة وتطوير</option>
                    <option value="بيانات وذكاء اصطناعي">بيانات وذكاء اصطناعي</option>
                    <option value="تصميم وجرافيك">تصميم وجرافيك</option>
                    <option value="تسويق وأعمال">تسويق وأعمال</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (بالجنيه المصري)</label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={e => setCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المدرب المسؤول</label>
                <input
                  type="text"
                  value={courseInstructor}
                  onChange={e => setCourseInstructor(e.target.value)}
                  placeholder="م. طارق فاروق"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف المختصر للدورة</label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="شرح موجز لأهداف الدورة..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
              >
                حفظ بيانات الدورة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Add Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100 text-right">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <span>إضافة مستخدم جديد للنظام</span>
            </h3>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="مثال: د. حسام فاروق"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف (اختياري)</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الدور والصلاحيات *</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="trainee">متدرب (Trainee)</option>
                  <option value="instructor">مدرب معتمد (Instructor)</option>
                  <option value="admin">مدير نظام (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                إضافة المستخدم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Receipt Review Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-100 text-right text-xs space-y-4">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              معاينة وتأكيد إيصال التحويل المالي
            </h3>

            <div className="space-y-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><strong>المتدرب:</strong> {selectedReceipt.traineeName} ({selectedReceipt.traineePhone})</p>
              <p><strong>الدورة المطلوبة:</strong> {selectedReceipt.courseTitle}</p>
              <p><strong>المبلغ المحول:</strong> <span className="font-bold text-emerald-600 font-mono text-sm">{selectedReceipt.amount.toLocaleString()} ج.م</span></p>
              <p><strong>وسيلة التحويل:</strong> {selectedReceipt.method === 'instapay' ? 'InstaPay' : selectedReceipt.method === 'vodafone_cash' ? 'فودافون كاش' : 'Fawry'}</p>
              <p><strong>الرقم المرجعي / العملية:</strong> <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold font-mono">{selectedReceipt.transactionRef}</code></p>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1.5">صورة الإيصال المرفوعة بواسطة المتدرب:</p>
              <div className="bg-slate-900 p-2 rounded-xl text-center">
                <img
                  src={selectedReceipt.receiptImageUrl}
                  alt="إيصال التحويل"
                  className="max-h-56 mx-auto rounded-lg object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {selectedReceipt.status === 'pending' && (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      reviewPaymentReceipt(selectedReceipt.id, 'approved');
                      setSelectedReceipt(null);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأكيد القبول وتفعيل الدورة للمتدرب فوراً</span>
                  </button>

                  <button
                    onClick={() => {
                      reviewPaymentReceipt(selectedReceipt.id, 'rejected', 'لم يتم العثور على المعاملة أو الصورة غير واضحة');
                      setSelectedReceipt(null);
                    }}
                    className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    رفض
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
