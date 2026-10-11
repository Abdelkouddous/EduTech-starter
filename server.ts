import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API with recommended telemetry headers
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Academy Training Catalogue Context for the AI Advisor
  const ACADEMY_KNOWLEDGE_BASE = `
أنت "المستشار التعليمي الذكي لأكاديمية التعلم" (Academy Training Advisor AI).
مهمتك الرئيسية هي مساعدة الزوار والمتدربين على فهم واستيعاب جميع البرامج التدريبية المتاحة، وتقديم نصائح مهنية وتوجيه لكل مستخدم لاختيار المسار المناسب لمستواه وأهدافه.

بيانات الدورات والبرامج التدريبية المتاحة حالياً في الأكاديمية:
1. **الدبلومة الشاملة لتطوير تطبيقات الويب (Full-Stack Web Development)**
   - السعر: 3,500 ج.م (بدلاً من 5,000 ج.م)
   - المدة: 60 ساعة تدريبية (42 درس + 5 مشاريع تطبيقية)
   - المستوى: من الصفر حتى الاحتراف (لا تتطلب خبرة برمجية سابقة)
   - التقنيات: HTML5, CSS3, TailwindCSS, JavaScript ES6+, TypeScript, React 19, Node.js, Express, PostgreSQL, REST APIs, ونشر التطبيقات على VPS & Cloud.
   - المدرب: م. طارق فاروق
   - الوظائف المستهدفة: Full-Stack Developer, Frontend React Developer, Node.js Backend Developer.

2. **دبلومة تصميم واجهات وتجربة المستخدم (UI/UX Design Professional)**
   - السعر: 2,400 ج.م (بدلاً من 3,600 ج.م)
   - المدة: 40 ساعة تدريبية (28 درساً)
   - المستوى: مبتدئ إلى متوسط
   - التقنيات: Figma, Design Systems, User Research, Wireframing, Interactive Prototyping, Usability Testing, UI Components.
   - المدربة: أ. سارة المنشاوي
   - الوظائف المستهدفة: UI/UX Designer, Product Designer, Interaction Designer.

3. **ذكاء الأعمال وتحليل البيانات المتقدم بـ Python & Power BI (Business Intelligence & Data Analysis)**
   - السعر: 2,800 ج.م (بدلاً من 4,200 ج.م)
   - المدة: 50 ساعة تدريبية (35 درساً)
   - المستوى: جميع المستويات (يناسب المحاسبين والمهندسين وخريجي التجارة وإدارة الأعمال)
   - التقنيات: Python (Pandas, NumPy, Matplotlib), Power BI Dashboards, SQL Database Querying, Advanced Excel, Data Cleaning, Predictive Analytics.
   - المدرب: د. وائل رضوان
   - الوظائف المستهدفة: Data Analyst, BI Specialist, Business Reporting Analyst.

4. **دبلومة تطوير تطبيقات الموبايل الهجينة بـ Flutter & Dart (Cross-Platform Mobile Apps)**
   - السعر: 3,200 ج.م (بدلاً من 4,800 ج.م)
   - المدة: 55 ساعة تدريبية (38 درساً)
   - المستوى: مبتدئ ومتقدم
   - التقنيات: Dart Programming, Flutter Widgets & State Management (Bloc / Riverpod), Firebase Backend, REST API Integration, App Store & Google Play Publishing.
   - المدرب: م. أحمد عبد العزيز
   - الوظائف المستهدفة: Flutter App Developer, Mobile Solutions Engineer.

5. **التسويق الرقمي وإدارة الحملات الإعلانية المدفوعة (Digital Marketing & Performance Ads)**
   - السعر: 1,900 ج.م (بدلاً من 3,000 ج.م)
   - المدة: 35 ساعة تدريبية (24 درساً)
   - المستوى: جميع المستويات (مناسب لأصحاب المشاريع والمسوقين)
   - المحاور: Meta Ads (Facebook & Instagram), TikTok Ads, Google Search & Display Ads, SEO Search Engine Optimization, Content Strategy, Analytics & ROI Tracking.
   - المدرب: أ. كريم زهران
   - الوظائف المستهدفة: Digital Marketing Specialist, Media Buyer, Growth Marketer.

6. **هندسة البنية السحابية وإدارة الخوادم DevOps (Cloud DevOps & Kubernetes)**
   - السعر: 3,800 ج.م
   - التقنيات: Linux Administration, Docker, Kubernetes, CI/CD Pipelines (GitHub Actions), Nginx, Cloud Deployment (AWS / DigitalOcean / VPS).
   - المستوى: متوسط إلى متقدم.

مميزات التدريب بالأكاديمية:
- محاضرات تفاعلية مباشرة + تسجيلات عالية الجودة بفترة وصول مدى الحياة.
- مشاريع تخرج عملية حقيقية تبني بها بورتفوليو احترافي.
- شهادة تخرج رقمية معتمدة برمز تحقق QR Code خاص بكل متدرب.
- مجتمع دعم فني وتوجيه 1-on-1 مع المدربين عبر Telegram & Discord.

طرق الدفع والتسجيل المتاحة (سداد يدوي مرن داخل مصر والوطن العربي):
1. **InstaPay (إنستا باي)**: تحويل لحظي فوري إلى (academy@instapay) أو هاتف 01001234567.
2. **Vodafone Cash (فودافون كاش ومحافظ المحمول)**: تحويل كاش إلى 01099887766.
3. **Fawry (كود خدمة فوري)**: دفع عبر كود الخدمة (98452) من أي منفذ في مصر.
تفعيل الحساب سريع ويتم فور رفع صورة إيصال التحويل في المنصة وتأكيده خلال 30 دقيقة.

تعليمات الصياغة للرد:
- تحدث بأسلوب عربي ترحيبي، دافئ، مشجع، منظم ومهني للغاية.
- استخدم التنسيق المنظم (نقاط Bullet points، إيموجيات ملائمة مثل 🎓، 💻، 🚀، 📊).
- إذا سألك المستخدم عما إذا كان مناسباً له مجال معين أو كان متردداً بين مجالين، ساعده بمقارنة واضحة مع إبراز الفروق والفرص الوظيفية لكل مجال.
- اذكر دائماً إمكانية التسجيل ورفع الإيصال بسهولة بالجنيه المصري.
`;

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'أكاديمية التعلم للتدريب الإلكتروني API',
      timestamp: new Date().toISOString()
    });
  });

  // Dedicated AI Training Advisor Chatbot Endpoint
  app.post('/api/ai/training-advisor', async (req, res) => {
    try {
      const { message, history = [], userPreferences } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'الرجاء إدخال رسالة أو استفسار.' });
        return;
      }

      if (!ai) {
        // High quality intelligent fallback response if API key is not configured
        let fallbackReply = `أهلاً بك في أكاديمية التعلم! 🌟\n\nنحن نقدم باقة من أقوى البرامج التدريبية المعتمدة في:\n1. 💻 **تطوير تطبيقات الويب Full-Stack** (React + Node.js) - 3,500 ج.م\n2. 🎨 **تصميم واجهات وتجربة المستخدم UI/UX** (Figma) - 2,400 ج.م\n3. 📊 **تحليل البيانات وذكاء الأعمال** (Python + Power BI) - 2,800 ج.م\n4. 📱 **تطوير تطبيقات الموبايل Flutter** - 3,200 ج.م\n5. 🚀 **التسويق الرقمي والحملات الإعلانية** - 1,900 ج.م\n\nجميع الدورات تتضمن مشاريع تطبيقية عملية، شهادات معتمدة، ودعم فني مباشر. يمكنك التسجيل الفوري والدفع عبر InstaPay أو فودافون كاش أو فوري!`;
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('مبتدئ') || lowerMsg.includes('من أين أبدأ') || lowerMsg.includes('ابدأ')) {
          fallbackReply = `إذا كنت في بداية رحلتك التعليمية، ننصحك بأحد مسارين رائعين:\n\n✨ **1. مسار الويب Full-Stack**: مثالي إذا كنت تحب بناء المواقع وتطبيقات الإنترنت من الصفر. نبدأ معك من الصفر تماماً بدون أي متطلبات برمجية سابقة.\n✨ **2. مسار UI/UX Design**: مثالي إذا كنت تميل للجانب البصري وحل مشكلات المستخدمين وتصميم التطبيقات عبر Figma.\n\nهل تفضل التركيز على البرمجة وتطوير النظم أم التصميم والإبداع البصري؟`;
        } else if (lowerMsg.includes('دفع') || lowerMsg.includes('instapay') || lowerMsg.includes('كاش') || lowerMsg.includes('سداد') || lowerMsg.includes('فوري')) {
          fallbackReply = `نوفر لك أسهل وسائل الدفع اليدوي السريع داخل مصر:\n\n🟣 **InstaPay**: تحويل لحظي إلى \`academy@instapay\`\n🔴 **Vodafone Cash**: تحويل إلى \`01099887766\`\n🟡 **Fawry**: كود الخدمة \`98452\`\n\nبعد التحويل، ترفع صورة الإيصال في المنصة ويتم تفعيل الدورة فوراً في غضون 30 دقيقة! ⚡`;
        } else if (lowerMsg.includes('شهادة') || lowerMsg.includes('معتمد')) {
          fallbackReply = `نعم بكل تأكيد! 📜 بعد إتمام الدروس والمشاريع التطبيقية بنجاح:\n\n1. تحصل على **شهادة تخرج رقمية معتمدة** باسمك.\n2. تحتوي الشهادة على **كود تحقق رسمي (Verification QR)** يمكن للشركات وأصحاب العمل التأكد من صحتها.\n3. تقدم مشاريع حقيقية تضيفها لبورتفوليو أعمالك على GitHub أو Behance.`;
        }

        res.json({
          reply: fallbackReply,
          recommendedCourseIds: ['course_fullstack', 'course_uiux']
        });
        return;
      }

      // Build context and history for Gemini 3.7 Flash
      let promptWithContext = message;
      if (userPreferences) {
        promptWithContext = `[معلومات المتدرب: الاهتمام=${userPreferences.interest || 'غير محدد'}, المستوى=${userPreferences.level || 'مبتدئ'}]\n\nالسؤال: ${message}`;
      }

      // Extract conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add recent history if provided
      if (Array.isArray(history) && history.length > 0) {
        const recent = history.slice(-6);
        for (const item of recent) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'ai' || item.sender === 'model') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      // Add current message
      contents.push({ role: 'user', parts: [{ text: promptWithContext }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: ACADEMY_KNOWLEDGE_BASE,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'أهلاً بك! نسعد بالإجابة عن استفساراتك حول تدريباتنا.';

      // Smart recommendation detection from generated text
      const recommendedCourseIds: string[] = [];
      if (replyText.includes('Full-Stack') || replyText.includes('تطوير تطبيقات الويب') || replyText.includes('برمجة الويب')) {
        recommendedCourseIds.push('course_fullstack');
      }
      if (replyText.includes('UI/UX') || replyText.includes('تصميم واجهات') || replyText.includes('Figma')) {
        recommendedCourseIds.push('course_uiux');
      }
      if (replyText.includes('بيانات') || replyText.includes('Data') || replyText.includes('Power BI') || replyText.includes('Python')) {
        recommendedCourseIds.push('course_ai_data');
      }
      if (replyText.includes('Flutter') || replyText.includes('موبايل') || replyText.includes('Dart')) {
        recommendedCourseIds.push('course_flutter');
      }
      if (replyText.includes('تسويق') || replyText.includes('Marketing') || replyText.includes('إعلانات')) {
        recommendedCourseIds.push('course_digital_marketing');
      }

      res.json({
        reply: replyText,
        recommendedCourseIds
      });

    } catch (err: any) {
      console.error('Gemini API Training Advisor Error:', err);
      res.status(500).json({
        error: 'حدث خطأ أثناء الاتصال بمستشار الذكاء الاصطناعي',
        details: err.message
      });
    }
  });

  // General Assistant fallback endpoint for compatibility
  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { prompt, contextType } = req.body;
      if (!prompt) {
        res.status(400).json({ error: 'الرجاء إدخال السؤال أو نص الطلب' });
        return;
      }

      if (!ai) {
        res.json({
          reply: `[مستشار التدريب بالأكاديمية]: شكراً لسؤالك! نرحب بك في أكاديمية التعلم. جميع دوراتنا معتمدة، وتتضمن مشاريع تطبيقية واختبارات دورية مع دعم الدفع عبر InstaPay و Vodafone Cash و Fawry.`
        });
        return;
      }

      const systemInstruction = contextType === 'syllabus'
        ? 'أنت خبير إعداد المناهج التدريبية بأكاديمية التعلم. قم بإعداد خطة دورة تدريبية عملية باللغة العربية مقسمة لوحدات ودروس مع مشاريع تطبيقية.'
        : ACADEMY_KNOWLEDGE_BASE;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      res.json({ reply: response.text || 'لم يتم استلام رد، حاول مرة أخرى.' });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: 'حدث خطأ أثناء معالجة الطلب الذكي',
        details: err.message
      });
    }
  });

  // Vite middleware setup for Development vs Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

