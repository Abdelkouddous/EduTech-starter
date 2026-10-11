import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Course, PaymentMethodType } from '../../types';
import { PAYMENT_METHODS_CONFIG } from '../../data/initialData';
import {
  X,
  CreditCard,
  PhoneCall,
  QrCode,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: () => void;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const { submitPaymentReceipt } = useData();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('instapay');
  const [senderAccountOrNumber, setSenderAccountOrNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );
  const [traineePhone, setTraineePhone] = useState(currentUser?.phone || '');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !course) return null;

  const currentMethodConfig = PAYMENT_METHODS_CONFIG[selectedMethod];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('الرجاء تسجيل الدخول أولاً لتأكيد الاشتراك');
      return;
    }
    if (!senderAccountOrNumber || !transactionRef) {
      setError('الرجاء إدخال رقم/عنوان الحساب المحول منه ورقم العملية التشاركية');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitPaymentReceipt({
        traineeId: currentUser.id,
        traineeName: currentUser.name,
        traineeEmail: currentUser.email,
        traineePhone: traineePhone || currentUser.phone || '01000000000',
        courseId: course.id,
        courseTitle: course.title,
        amount: course.price,
        method: selectedMethod,
        senderAccountOrNumber,
        transactionRef,
        receiptImageUrl: receiptImage
      });

      setIsSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              دفع يدوي آمن وموثق
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">تأكيد الاشتراك في الدورة التدريبية</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-16 h-12 rounded-lg object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{course.title}</h4>
              <p className="text-[11px] text-slate-500">المدرب: {course.instructorName}</p>
            </div>
          </div>
          <div className="text-left shrink-0">
            <div className="text-xs text-slate-500">المبلغ المطلوب</div>
            <div className="text-lg font-black text-emerald-600">{course.price.toLocaleString()} ج.م</div>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Select Payment Method & View Instructions */
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">اختر طريقة الدفع المناسبة لك:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('instapay')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedMethod === 'instapay'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold">InstaPay</div>
                  <div className="text-[10px] text-slate-500">تحويل لحظي</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('vodafone_cash')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedMethod === 'vodafone_cash'
                      ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold">فودافون كاش</div>
                  <div className="text-[10px] text-slate-500">محفظة المحمول</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('fawry')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedMethod === 'fawry'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs mb-2">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold">Fawry (فوري)</div>
                  <div className="text-[10px] text-slate-500">منافذ الدفع</div>
                </button>
              </div>
            </div>

            {/* Account Details & Instructions Box */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> بيانات التحويل المباشر:
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {currentMethodConfig.title}
                </span>
              </div>

              {selectedMethod === 'instapay' && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">عنوان الدفع اللحظي (InstaPay IPA):</div>
                  <div className="text-base font-mono font-bold text-purple-300 bg-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                    <span>{currentMethodConfig.handle}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(currentMethodConfig.handle)}
                      className="text-[10px] bg-purple-600/30 text-purple-200 hover:bg-purple-600 px-2 py-1 rounded cursor-pointer"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'vodafone_cash' && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">رقم محفظة فودافون كاش للتحويل:</div>
                  <div className="text-base font-mono font-bold text-red-400 bg-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                    <span dir="ltr">{currentMethodConfig.phone}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(currentMethodConfig.phone || '')}
                      className="text-[10px] bg-red-600/30 text-red-200 hover:bg-red-600 px-2 py-1 rounded cursor-pointer"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'fawry' && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">كود خدمة فوري لدى المنفذ:</div>
                  <div className="text-base font-mono font-bold text-amber-300 bg-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                    <span>{currentMethodConfig.serviceCode}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(currentMethodConfig.serviceCode || '')}
                      className="text-[10px] bg-amber-600/30 text-amber-200 hover:bg-amber-600 px-2 py-1 rounded cursor-pointer"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                💡 <strong>خطوات السداد:</strong> {currentMethodConfig.instructions}
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>قام بالتحويل؟ اضغط لإكمال وإرفاق الإيصال</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        ) : (
          /* Step 2: Upload Proof & Submit Details */
          <form onSubmit={handleSubmitReceipt} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم/عنوان الحساب المحول منه *
              </label>
              <input
                type="text"
                value={senderAccountOrNumber}
                onChange={e => {
                  setSenderAccountOrNumber(e.target.value);
                  setError('');
                }}
                placeholder={
                  selectedMethod === 'instapay'
                    ? 'مثال: user@instapay'
                    : 'مثال: 01012345678'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم المرجعي / الرقم القومي أو رقم العملية التشاركية *
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder="مثال: REF-99201485"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف للتأكيد والتواصل *
              </label>
              <input
                type="tel"
                value={traineePhone}
                onChange={e => setTraineePhone(e.target.value)}
                placeholder="01012345678"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Receipt Image Upload & Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                صورة إيصال التحويل / لقطة الشاشة *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                {receiptImage ? (
                  <div className="space-y-2">
                    <img
                      src={receiptImage}
                      alt="إيصال التحويل"
                      className="max-h-36 mx-auto rounded-lg shadow-xs object-contain border border-slate-200"
                    />
                    <span className="text-[11px] font-bold text-indigo-600 block">انقر لتغيير الصورة</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">اضغط لرفع لقطة الشاشة للإيصال</div>
                    <div className="text-[10px] text-slate-400">PNG, JPG, JPEG حتى 10MB</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري إرسال الإيصال...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>إرسال إيصال الدفع ولطلب التفعيل</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
