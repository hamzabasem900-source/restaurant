import { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, PlusSquare, ChevronRight, CheckCircle, SquareTerminal, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function PwaInstallGuide() {
  const [activeTab, setActiveTab] = useState<'iphone' | 'android' | 'desktop'>('iphone');
  const [copiedLink, setCopiedLink] = useState(false);

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
      className="max-w-4xl mx-auto px-4 py-8"
      dir="rtl"
    >
      {/* Decorative Top Accent */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          تطبيق ويب متكامل (PWA)
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight sm:text-4xl">
          تثبيت تطبيق <span className="text-amber-600 font-black">باب شرقي</span> على هاتفك
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          تصفح قائمة الطعام وتتبع طلباتك بسرعة فائقة وبدون استهلاك للإنترنت عبر تثبيت موقعنا كـتطبيق مباشر على شاشتك الرئيسية دون الحاجة لمتجر تطبيقات!
        </p>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-right">
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-950 text-base">خفيف وموفر</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              لا يأخذ أي مساحة تذكر من ذاكرة الهاتف (أقل من 1 ميجابايت) ويعمل بسلاسة مطلقة.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-950 text-base">تحديث فوري</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              يحدث نفسه فوراً عندما نقوم بتعديل وجبة أو تخفيض سعر، لتبقى على دقة تامة دائماً.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-950 text-base">تصفح بلا إنترنت</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              يمكنك استعراض الوجبات ومكوناتها حتى لو كنت غير متصل بالإنترنت بمجرد التثبيت.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Menu */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mb-12">
        <div className="flex border-b border-neutral-100 bg-neutral-50 p-1">
          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'iphone'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            🍎 أجهزة الآيفون (iOS)
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'android'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            🤖 أجهزة الأندرويد
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'desktop'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            💻 أجهزة الكمبيوتر
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'iphone' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-fill bg-amber-100 text-amber-700 text-xs font-black">1</span>
                طريقة التثبيت على نظام iOS (سفاري):
              </h2>

              <div className="relative border-r-2 border-amber-200 pr-6 mr-3 space-y-8">
                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الأولى: افتح متصفح سفاري</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    تأكد من فتح الرابط الخاص بالموقع باستخدام متصفح <b>سفاري Safari</b> الرسمي (وليس متصفح داخلي من فيسبوك أو تيليغرام).
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800 flex items-center gap-1.5">
                    الخطوة الثانية: اضغط على زر المشاركة
                    <Share2 className="w-4 h-4 text-blue-500 inline" />
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    اضغط على أيقونة <b>المشاركة (Share)</b> الموجودة في أسفل شاشة المتصفح (مربع يخرج منه سهم للأعلى).
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800 flex items-center gap-1.5">
                    الخطوة الثالثة: إضافة للشاشة الرئيسية
                    <PlusSquare className="w-4 h-4 text-neutral-800 inline" />
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    قم بالتمرير لأسفل القائمة المنبثقة واضغط على الخيار <b>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</b>.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الرابعة: تأكيد الإضافة</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    اكتب الاسم المفضل لديك (مثل "باب شرقي") ثم اضغط على <b>"إضافة" (Add)</b> في الزاوية العلوية اليمنى. سيظهر تطبيق الهاتف فوراً في شاشتك!
                  </p>
                </div>
              </div>

              {/* iPhone Mockup visual representation */}
              <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    شرقي
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-800 text-xs">تطبيق مطعم باب شرقي</h5>
                    <p className="text-[10px] text-neutral-500">جاهز للتثبيت السريع</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold rounded-lg text-neutral-700 transition"
                >
                  {copiedLink ? '✓ تم نسخ الرابط' : 'نسخ رابط الموقع ومشاركته'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'android' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-black">2</span>
                طريقة التثبيت على نظام الأندرويد (كروم):
              </h2>

              <div className="relative border-r-2 border-amber-200 pr-6 mr-3 space-y-8">
                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الأولى: افتح متصفح جوجل كروم</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    افتح موقع باب شرقي من متصفح <b>Google Chrome</b> على هاتفك الأندرويد.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الثانية: اضغط على القائمة الجانبية (3 نقاط)</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    اضغط على أيقونة الـ <b>ثلاث نقاط العمودية</b> الموجودة في الزاوية العلوية اليسرى/اليمنى للمتصفح.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الثالثة: اختر "التثبيت على الهاتف"</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    اضغط على خيار <b>"تثبيت التطبيق" (Install App)</b> أو <b>"الإضافة إلى الشاشة الرئيسية" (Add to Home screen)</b> من القائمة.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوة الرابعة: وافق على التنزيل</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    ستظهر نافذة تأكيد، اضغط على <b>"تثبيت" (Install)</b>. سيقوم كروم بإنشاء أيقونة ذكية لتطبيق باب شرقي على واجهة هاتفك فوراً وسيقوم بتحديثها تلقائياً بالخلفية!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'desktop' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-black">3</span>
                التثبيت على أجهزة الكمبيوتر والمحمول:
              </h2>

              <div className="relative border-r-2 border-amber-200 pr-6 mr-3 space-y-8">
                <div className="relative">
                  <div className="absolute -right-[32px] top-1 bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow-xs"></div>
                  <h4 className="font-bold text-neutral-800">الخطوات لأي متصفح حديث (Chrome / Edge / Safari):</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
                    ببساطة ابحث عن أيقونة <b>الشاشة الصغيرة والسهم للأسفل</b> في شريط الرابط بالأعلى (URL bar) على اليمين بجانب المفضلة، واضغط عليها لتثبيت موقع باب شرقي كتطبيق مستقل على كمبيوترك بالسرعة الكاملة واستمتع بطلب الطعام على الفور!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Export / Developers guide for building ZIP - Helpful response to the client ZIP request */}
      <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 text-right">
        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5 font-sans">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          تنزيل السورس كود كتطبيق ZIP كامل؟
        </h3>
        <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
          عزيزي صاحب المطعم، هذا الموقع مبرمج بأعلى التقنيات العالمية. للحصول على الكود المصدري كاملاً بصيغة <b>ZIP</b> للرفع على سيرفرك الخاص، يمكنك الضغط على <b>أيقونة الإعدادات في أعلى يمين شاشة AI Studio (Settings) ثم اختيار تصدير (Export as ZIP)</b> لتنزيل ملفات التطبيق كاملةً وجاهزة للعمل بأي مكان!
        </p>
      </div>
    </motion.div>
  );
}
