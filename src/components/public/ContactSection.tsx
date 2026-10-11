import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { submitContactMessage } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('استفسار عن القبول والدورات');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      submitContactMessage({ name, email, phone, subject, message });
      setSubmitted(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div id="contact" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            تواصل معنا مباشرة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            نحن هنا للإجابة عن كافة استفساراتك
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            فريق القبول والدعم الفني متواجد طوال أيام الأسبوع لمساعدتك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">أرسل استفسارك وسنعاود الاتصال بك:</h3>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>تم إرسال رسالتك بنجاح! سيتواصل معك أحد ممثلي الأكاديمية قريباً.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="أحمد علي"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم المحمول / واتساب</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع الاستفسار</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="استفسار عن القبول والدورات">استفسار عن القبول والدورات</option>
                    <option value="تأكيد تحويل مالي يدوي">تأكيد تحويل مالي يدوي</option>
                    <option value="طلب انضمام كمدرب">طلب انضمام كمدرب</option>
                    <option value="تدريب مؤسسات ورعايات">تدريب مؤسسات ورعايات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الرسالة *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك هنا بكل تفصيل..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </div>

          {/* Right Column: Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">محادثة واتساب الفورية (WhatsApp)</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                هل تحتاج لمساعدة عاجلة أو استفسار عن طرق الدفع المباشرة عبر InstaPay / Vodafone Cash؟ تواصل مع مسؤول القبول فوراً.
              </p>
              <a
                href="https://wa.me/201001234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
              >
                <span>بدء محادثة الواتساب الآن</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">بيانات التواصل المباشر</h4>
              
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">الهاتف والخط الساخن:</div>
                    <div dir="ltr" className="text-slate-600 font-mono text-right">+20 100 123 4567</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">البريد الإلكتروني الرسمي:</div>
                    <div className="text-slate-600 font-mono">info@academy-learning.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">مقر الأكاديمية:</div>
                    <div className="text-slate-600">القاهرة - جمهورية مصر العربية</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
