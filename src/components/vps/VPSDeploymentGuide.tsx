import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Server,
  Terminal,
  Globe,
  Lock,
  Copy,
  Check,
  Play,
  Settings,
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const VPSDeploymentGuide: React.FC = () => {
  const { vpsSettings, updateVPSSettings } = useData();

  const [domain, setDomain] = useState(vpsSettings.domainName);
  const [ip, setIp] = useState(vpsSettings.serverIp);
  const [port, setPort] = useState(vpsSettings.port);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleSaveSettings = () => {
    updateVPSSettings({
      domainName: domain,
      serverIp: ip,
      port: Number(port)
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nginxConfig = `server {
    listen 80;
    server_name ${domain || 'academy.yourdomain.com'};

    location / {
        proxy_pass http://127.0.0.1:${port || 3000};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`;

  const bashDeploymentScript = `# 1. تحديث النظام وتثبيت Node.js & Nginx & PM2
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# 2. فك ضغط كود الأكاديمية وتثبيت الحزم
cd /var/www
sudo mkdir -p academy && cd academy
# انسخ ملفات المشروع هنا ثم قم بالبناء:
npm install
npm run build

# 3. تشغيل الخادم بواسطة PM2 على البورت ${port}
pm2 start dist/server.cjs --name "${vpsSettings.pm2ProcessName}"
pm2 save
pm2 startup

# 4. تفعيل إعدادات Nginx وشهادة التشفير المجانية SSL (Certbot)
sudo certbot --nginx -d ${domain || 'academy.yourdomain.com'}
sudo systemctl restart nginx
`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            دليل وإعدادات النشر على خادم VPS
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            إعداد البيئة الإنتاجية، Nginx، SSL، والنطاق
          </h3>
          <p className="text-xs text-slate-500">مولد ملفات التكوين وأوامر التشغيل المباشرة لرفع المنصة على خادِمك الخاص.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> جاهز للإنتاج
          </span>
        </div>
      </div>

      {/* Config Inputs */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" /> بيانات خادم VPS والدومين الخاص بك:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم النطاق (Domain Name)</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="academy.example.com"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان IP الخاص بالخادم</label>
            <input
              type="text"
              value={ip}
              onChange={e => setIp(e.target.value)}
              placeholder="185.220.101.45"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">منفذ التطبيق (Port)</label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(Number(e.target.value))}
              placeholder="3000"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          حفظ وتحديث الإعدادات
        </button>
      </div>

      {/* Step 1: Nginx Configuration Generator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" /> 1. ملف تكوين Nginx Reverse Proxy تلقائي:
          </h4>
          <button
            onClick={() => copyToClipboard(nginxConfig, 'nginx')}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded cursor-pointer"
          >
            {copiedSection === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'nginx' ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>

        <pre dir="ltr" className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
          {nginxConfig}
        </pre>
      </div>

      {/* Step 2: Deployment Shell Script */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" /> 2. سكريبت النشر والتشغيل على VPS عبر SSH (PM2 & Certbot SSL):
          </h4>
          <button
            onClick={() => copyToClipboard(bashDeploymentScript, 'bash')}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded cursor-pointer"
          >
            {copiedSection === 'bash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'bash' ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>

        <pre dir="ltr" className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
          {bashDeploymentScript}
        </pre>
      </div>

    </div>
  );
};
