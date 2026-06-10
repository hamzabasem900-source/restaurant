import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, PlusSquare, Sparkles, CheckCircle, HelpCircle, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PwaInstallGuide() {
  const [activeTab, setActiveTab] = useState<'iphone' | 'android'>('iphone');
  const [copiedLink, setCopiedLink] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for the native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsSupported(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already run in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsSupported(false);
        setIsInstalled(true);
      }
    } else {
      // In case native prompt is not active, give a sweet browser-level guidance
      alert("يرجى استخدام دليل التثبيت السريع بالأسفل لإضافة التطبيق يدوياً لشاشتك الرئيسية.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 py-8"
      dir="rtl"
    >
      {/* Decortive Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          تطبيق الهاتف الرسمي المباشر
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight sm:text-4xl text-center">
          تنزيل تطبيق <span className="text-amber-600 font-black">باب شرقي</span> على شاشة هاتفك
        </h1>
        <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
          تصفح قائمة الطعام وتتبع طلباتك بسرعة فائقة وبدون أي استهلاك لمساحة تخزين هاتفك! ثبت التطبيق الآن وتلقَّ الاشعارات الحية.
        </p>
      </div>

      {/* Main Call to Action: The One-Click Install Button */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-amber-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-bounce">
            <Download className="w-8 h-8" />
          </div>

          {isInstalled ? (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-green-700 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                أنت الآن تستخدم تطبيق باب شرقي المثبت بنجاح!
              </h3>
              <p className="text-xs text-neutral-500">
                شكراً لك على تثبيت تطبيقنا. استمتع بتصفح الوجبات وطلب أشهى المأكولات الشامية.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900">
                  تثبيت بلمسة واحدة
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  انقر على الزر بالأسفل لتنزيل التطبيق مباشرة على هاتفك دون الدخول لمتجر التطبيقات.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-600/30 transition hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                تثبيت تطبيق باب شرقي الآن
              </button>

              <p className="text-[11px] text-amber-800 bg-amber-100/50 py-1.5 px-3 rounded-lg inline-block font-medium">
                💡 يدعم جميع هواتف الأندرويد، الآيفون، وأجهزة الكومبيوتر
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simplified, Beautiful Accordion Instructions */}
      <h3 className="text-lg font-extrabold text-neutral-900 text-right mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-amber-600" />
        كيفية التثبيت اليدوي السريع في ثوانٍ:
      </h3>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
        <div className="flex border-b border-neutral-100 bg-neutral-50 p-1">
          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'iphone'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            🍎 لهواتف الآيفون (iPhone)
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'android'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            🤖 لهواتف الأندرويد (Android)
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'iphone' ? (
              <motion.div
                key="iphone"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">١</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    افتح موقعنا من خلال متصفح <strong>سفاري Safari</strong> الرسمي على هاتفك.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">٢</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed flex items-center gap-1.5 flex-wrap">
                    اضغط على أيقونة <strong>المشاركة (Share)</strong>
                    <Share2 className="w-4 h-4 text-amber-600 inline shrink-0" />
                     الموجودة في الشريط السفلي.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">٣</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed flex items-center gap-1.5 flex-wrap">
                    اختر خيار <strong>"إضافة إلى الشاشة الرئيسية"</strong>
                    <PlusSquare className="w-4 h-4 text-amber-600 inline shrink-0" />
                     مباشرة.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="android"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">١</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    افتح موقعنا من داخل متصفح <strong>جوجل كروم Google Chrome</strong> على هاتفك.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">٢</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    اضغط على أيقونة <strong>النقاط الثلاث</strong> في أعلى يسار/يمين الشاشة.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">٣</div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    اختر <strong>"تثبيت التطبيق" (Install)</strong> وسيتم تنزيله فوراً كأيقونة على هاتفك.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share with Friends section */}
      <div className="p-4 rounded-2xl bg-neutral-100/60 border border-neutral-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div className="text-center sm:text-right">
          <h5 className="font-bold text-neutral-800 text-xs sm:text-sm">هل ترغب بمشاركة التطبيق مع عائلتك وأصدقائك؟</h5>
          <p className="text-[10px] text-neutral-500 mt-0.5">انسخ الرابط المباشر وأرسله لمن تحب لطلب أشهى شاورما وبروستد.</p>
        </div>
        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-bold rounded-xl text-neutral-700 transition"
        >
          {copiedLink ? '✓ تم نسخ الرابط المباشر' : 'نسخ رابط التطبيق ومشاركته'}
        </button>
      </div>
    </motion.div>
  );
}
