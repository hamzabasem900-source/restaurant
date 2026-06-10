import { useState } from 'react';
import { MenuItem, Category, Order, OrderStatus, RestaurantSettings } from '../types';
import {
  BookOpen,
  Settings,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Ban,
  Upload,
  Coins,
  Store,
  HelpCircle,
  Sparkles,
  Info,
  Layers,
  Phone,
  Edit,
  Trash2,
  ChevronLeft,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (newItem: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItemPrice: (id: string, newPrice: number) => void;
  onToggleAvailability: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
  onRestoreDefaultMenu: () => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onClearOrders: () => void;
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: RestaurantSettings) => void;
}

export default function AdminPanel({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItemPrice,
  onToggleAvailability,
  onDeleteMenuItem,
  onRestoreDefaultMenu,
  orders,
  onUpdateOrderStatus,
  onClearOrders,
  settings,
  onUpdateSettings,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'menu' | 'guide' | 'settings'>('orders');

  // New Item State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Exclude<Category, 'all'>>('shawarma');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemAddOns, setNewItemAddOns] = useState<string>('ثوم زيادة, ملح صيني, هالبينو حار');

  // Status Sound / Notification State (Simulated)
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  // Edit Pricing Inline temporary values
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>('');

  // Settings local state
  const [localName, setLocalName] = useState(settings.name);
  const [localPhone, setLocalPhone] = useState(settings.phone);
  const [localAddress, setLocalAddress] = useState(settings.address);
  const [localDeliveryFee, setLocalDeliveryFee] = useState(settings.deliveryFee.toString());
  const [localCurrency, setLocalCurrency] = useState(settings.currency);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name: localName,
      phone: localPhone,
      address: localAddress,
      deliveryFee: parseFloat(localDeliveryFee) || 0,
      currency: localCurrency,
      isOpen: settings.isOpen,
    });
    alert('✓ تم حفظ الإعدادات وتخصيص الموقع بنجاح!');
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice.trim()) {
      alert('⚠️ يرجى ملء اسم الوجبة والسعر على الأقل.');
      return;
    }

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('⚠️ يرجى إدخال سعر رقمي صحيح أكبر من صفر.');
      return;
    }

    // Default Images for Categories if left blank
    let finalImg = newItemImage.trim();
    if (!finalImg) {
      if (newItemCategory === 'shawarma') {
        finalImg = 'https://images.unsplash.com/photo-1642970347854-c9f280a5682b?auto=format&fit=crop&w=800&q=80';
      } else if (newItemCategory === 'broasted') {
        finalImg = 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80';
      } else if (newItemCategory === 'appetizers') {
        finalImg = 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?auto=format&fit=crop&w=800&q=80';
      } else {
        finalImg = 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80';
      }
    }

    const addOnsArr = newItemAddOns
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    onAddMenuItem({
      name: newItemName,
      category: newItemCategory,
      price: priceNum,
      description: newItemDesc || 'وجبة جديدة ومميزة تحضر بطريقة باب شرقي الشهيرة.',
      image: finalImg,
      available: true,
      add_on_options: addOnsArr,
    });

    // Reset fields
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemImage('');
    setShowAddForm(false);
    alert('✓ تم رفع وإضافة المنتج الجديد بنجاح فوري للقائمة!');
  };

  const handleSavePriceChange = (id: string) => {
    const val = parseFloat(tempPriceValue);
    if (isNaN(val) || val < 0) {
      alert('⚠️ يرجى كتابة سعر رقمي صحيح.');
      return;
    }
    onUpdateMenuItemPrice(id, val);
    setEditingPriceId(null);
  };

  const startEditPrice = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setTempPriceValue(item.price.toString());
  };

  // Status Badge Colors helper
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'انتظار الموافقة ⏳', color: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'preparing':
        return { label: 'جاري التحضير بالمطبخ 👨‍🍳', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'delivering':
        return { label: 'مع سائق الديليفري 🛵', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'completed':
        return { label: 'تم التسليم بنجاح ✓', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'cancelled':
        return { label: 'ملغي 🛑', color: 'bg-red-50 text-red-700 border-red-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right" dir="rtl">
      {/* Admin header */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl mb-8 relative overflow-hidden">
        {/* Decorative ambient gold glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/10 rounded-full filter blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-neutral-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                لوحة تحكم المدير
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-neutral-400">قناة اتصال الطلبات مفعلة حياً</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              لوحة إدارة <span className="text-amber-400">سوبر باب شرقي</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              إدارة الوجبات، تعديل الأسعار وعرض وإرسال طلبات المشترين في الوقت الحقيقي بكل سلاسة.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من تفريغ كافة الطلبات المحفوظة للتجربة؟')) onClearOrders();
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold rounded-xl transition"
            >
              حذف الأرشيف المالي للطلبات
            </button>
            <button
              onClick={() => {
                if (confirm('تحذير: هذا سيؤدي إلى إعادة القائمة لعناصر الشاورما والبروستد الافتراضية وحذف المنتجات المعدلة. هل ترغب بالاستمرار؟')) onRestoreDefaultMenu();
              }}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition"
            >
              استعادة قائمة وجبات الافتراضية
            </button>
          </div>
        </div>

        {/* Dashboard Inner Sub-navigation */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-neutral-800 mt-6 pt-5 snap-x scrollbar-none">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
              activeSubTab === 'orders'
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            📋 الطلبات الحية الواردة ({orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveSubTab('menu')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
              activeSubTab === 'menu'
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            🍔 المنتجات وتعديل الأسعار
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all border ${
              activeSubTab === 'guide'
                ? 'bg-amber-100 border-amber-200 text-amber-900'
                : 'bg-neutral-850 text-amber-400 border-amber-500/20 hover:bg-neutral-800'
            }`}
          >
            📖 كيف ترفع منتجاً وتعدل سعراً؟ (دليلك التفاعلي)
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
              activeSubTab === 'settings'
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            ⚙️ إدارة هوية المطعم والتوصيل
          </button>
        </div>
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. ORDERS MONITOR */}
      {activeSubTab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#111] flex items-center gap-1.5">
              <Clock className="w-5.5 h-5.5 text-amber-600" />
              قنوات الطلبات اللحظية (بالوقت الحقيقي):
            </h2>
            <span className="text-neutral-500 text-xs font-bold bg-neutral-100 px-3 py-1 rounded-lg">
              إجمالي المعاملات: {orders.length} طلب
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-neutral-100 shadow-xs">
              <div className="text-4xl mb-3">📬</div>
              <h3 className="font-bold text-neutral-800 text-sm sm:text-base">لا توجد أي طلبات مستلمة حتى اللحظة</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto leading-relaxed">
                أي زبون يقوم بطلب وجبة شاورما أو بروستد من واجهة المشتري، ستظهر معلوماته التفصيلية وعنوانه هنا فوراً وبشكل حي، لمتابعة الطلبات وتعديل حالتها!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => {
                const statusMeta = getStatusInfo(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      {/* Header details */}
                      <div className="flex items-center justify-between border-b border-neutral-50 pb-3 mb-3 gap-2">
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-mono">رقم الطلب: {order.id}</span>
                          <span className="font-sans text-xs text-neutral-500 font-bold block">{order.createdAt}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusMeta?.color}`}>
                          {statusMeta?.label}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div className="space-y-1 mb-4">
                        <h4 className="font-extrabold text-neutral-900 text-sm">زبوننا: {order.customerName}</h4>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span>الهاتف: {order.customerPhone}</span>
                        </p>
                        <p className="text-xs text-neutral-500">
                          🚘 العنوان: {order.address}
                        </p>
                        <p className="text-xs text-amber-600 bg-amber-50/50 p-1.5 rounded-lg inline-block font-sans font-medium">
                          نوع الاستلام: {order.type === 'delivery' ? '🛵 توصيل سريع للمنزل' : order.type === 'pickup' ? '🛍️ زبون سفري يأخذه بنفسه' : '🍽️ تلبية على طاولات المطعم'}
                        </p>
                        {order.notes && (
                          <div className="bg-neutral-50 p-2 rounded-xl text-neutral-600 text-[10px] sm:text-xs">
                            💡 ملاحظة دليفري: {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Items Ordered list */}
                      <div className="bg-neutral-50 rounded-2xl p-3.5 space-y-2 mb-4">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase border-b border-neutral-100 pb-1.5">
                          العناصر ومكونات التحضير:
                        </p>
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between items-start text-xs border-b border-neutral-150/10 last:border-0 pb-1.5 last:pb-0">
                            <div>
                              <span className="font-extrabold text-neutral-800">{it.name}</span>
                              <span className="text-[10px] text-neutral-400 font-sans mr-1">× {it.quantity}</span>
                              {it.selectedAddOns.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {it.selectedAddOns.map((add, idx) => (
                                    <span key={idx} className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                                      + {add}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {it.customerNote && (
                                <p className="text-[9px] text-[#222] bg-neutral-200/50 p-1.5 rounded-md mt-1 italic">
                                  تخصيص: {it.customerNote}
                                </p>
                              )}
                            </div>
                            <span className="font-sans font-bold text-neutral-700">
                              {(it.price * it.quantity).toFixed(2)} {settings.currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer & Action buttons */}
                    <div className="border-t border-neutral-100 pt-3 flex flex-col gap-3">
                      <div className="flex justify-between items-center bg-neutral-50 px-3 py-2 rounded-xl">
                        <span className="text-xs text-neutral-500 font-bold">الحساب الإجمالي:</span>
                        <span className="text-base font-black text-amber-700 font-sans">
                          {order.totalPrice.toFixed(2)} {settings.currency}
                        </span>
                      </div>

                      {/* Action trigger states */}
                      <div className="flex flex-wrap gap-1">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                            >
                              👨‍🍳 بدء التحضير
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                              className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg border border-red-200 transition"
                            >
                              إلغاء الطلب 🛑
                            </button>
                          </>
                        )}

                        {order.status === 'preparing' && (
                          <>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivering')}
                              className="flex-1 py-1.5 bg-purple-650 hover:bg-purple-700 text-purple-700 font-bold text-xs bg-purple-50 rounded-lg border border-purple-200 transition"
                            >
                              🛵 إرسال مع الديليفري
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                              className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition"
                            >
                              ✓ تسليم فوري
                            </button>
                          </>
                        )}

                        {order.status === 'delivering' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition text-center"
                          >
                            ✓ تأكيد التسليم للزبون بنجاح
                          </button>
                        )}

                        {order.status === 'completed' && (
                          <span className="text-[10px] text-green-700 bg-green-50 px-3 py-1 rounded-md text-center w-full font-bold border border-green-100">
                            تم تلبية هذا الطلب وتوصيله بفخر! الكاش مقبوض ✓
                          </span>
                        )}

                        {order.status === 'cancelled' && (
                          <span className="text-[10px] text-red-700 bg-red-50 px-3 py-1 rounded-md text-center w-full font-bold border border-red-100">
                            هذا الطلب ملغي ومسترجع تماماً.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* 2. MENU UPLOADER AND PRICING MANAGE */}
      {activeSubTab === 'menu' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#111] flex items-center gap-2">
                <Layers className="w-5.5 h-5.5 text-amber-600" />
                تعديل الأسعار وإدارة وجبات مطعم باب شرقي:
              </h2>
              <p className="text-xs text-neutral-500 mt-1">تعديل قيم أي وجبة أو تعطيلها مؤقتاً كـ (غير متوفرة)، ليراها الزبائن على الفور.</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              رفع وإضافة وجبة جديدة
            </button>
          </div>

          {/* Form to raise a new product */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddNewItem}
                className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h3 className="font-extrabold text-[#111] text-base flex items-center gap-1.5">
                    <Upload className="w-5 h-5 text-amber-650" />
                    استمارة رفع وإدخال وجبة جديدة:
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-neutral-400 hover:text-neutral-700 text-lg font-black"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">اسم الوجبة الشامية المقترحة *</label>
                    <input
                      type="text"
                      placeholder="امثلة: شاورما دبل دجاج، بروستد حار جداً..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">القسم / التصنيف</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as Exclude<Category, 'all'>)}
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2"
                    >
                      <option value="shawarma">🌯 شاورما</option>
                      <option value="broasted">🍗 البروستد المقرمش</option>
                      <option value="appetizers">🥗 المقبلات والشوربات</option>
                      <option value="drinks">🍹 مشروبات وعصائر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">سعر الوجبة الحقيقي (بـ {settings.currency}) *</label>
                    <input
                      type="text"
                      placeholder="امثلة: 4.50"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left font-sans"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">رابط صورة الوجبة (دعها فارغة للصورة الافتراضية)</label>
                    <input
                      type="text"
                      placeholder="انسخ رابط أي صورة دجاج أو شاورما من جوجل والصقها هنا، أو اتركها تلقائية"
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">الإضافات المتاحة للزبائن (مفصولة بفاصلة)</label>
                    <input
                      type="text"
                      placeholder="مثال: ثوم زيادة, بطاطا, شطة حارة, جبنة مبشورة..."
                      value={newItemAddOns}
                      onChange={(e) => setNewItemAddOns(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">مكونات ووصف الوجبة بالكامل (تفتح الشهية للمشترين)</label>
                  <textarea
                    rows={2}
                    placeholder="امثلة: وجبة شاورما عربي فاخرة محشوة بشرائح الدجاج المتبل، بطاطس مخلل مع صوص الثومية الفاخر..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
                >
                  حفظ ونشر فوري على قائمة الطعام
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Current Items Table */}
          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-600 flex justify-between items-center">
              <span>قائمة المواد الغذائية الحالية المتوفرة بالمطعم:</span>
              <span>متاح: {menuItems.filter(i => i.available).length} وجبة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400">
                    <th className="p-4 font-bold">الوجبة والصورة</th>
                    <th className="p-4 font-bold">التصنيف</th>
                    <th className="p-4 font-bold">السعر الحالي ({settings.currency})</th>
                    <th className="p-4 font-bold">تعديل فوري للأسعار</th>
                    <th className="p-4 font-bold">حالة التوفر</th>
                    <th className="p-4 font-bold text-center">حذف الوجبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className={`hover:bg-neutral-50/50 transition ${!item.available ? 'bg-red-50/10' : ''}`}>
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-extrabold text-neutral-900 block">{item.name}</span>
                          <span className="text-[10px] text-neutral-400 truncate max-w-sm block">
                            {item.description}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-neutral-500">
                        {item.category === 'shawarma' && '🌯 شاورما'}
                        {item.category === 'broasted' && '🍗 بروستد مقرمش'}
                        {item.category === 'appetizers' && '🥗 مقبلات'}
                        {item.category === 'drinks' && '🍹 مشروبات'}
                      </td>

                      <td className="p-4 font-sans font-black text-amber-700 text-sm">
                        {item.price.toFixed(2)} {settings.currency}
                      </td>

                      <td className="p-4">
                        {editingPriceId === item.id ? (
                          <div className="flex items-center gap-1.5 max-w-[120px]">
                            <input
                              type="text"
                              value={tempPriceValue}
                              onChange={(e) => setTempPriceValue(e.target.value)}
                              className="w-14 px-1.5 py-1 text-xs border border-amber-400 rounded-md font-sans text-center bg-white"
                              dir="ltr"
                            />
                            <button
                              onClick={() => handleSavePriceChange(item.id)}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-[10px] font-bold"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="text-neutral-400 hover:text-neutral-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditPrice(item)}
                            className="text-amber-605 font-bold hover:text-amber-805 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-[11px]"
                          >
                            <Edit className="w-3 h-3" />
                            تعديل السعر
                          </button>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold border transition ${
                            item.available
                              ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          }`}
                        >
                          {item.available ? '✓ متوفر الآن للطلب' : '🛑 غير متوفر مؤقتاً'}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`هل ترغب فعلاً بمسح وجبة "${item.name}" نهائياً؟`)) {
                              onDeleteMenuItem(item.id);
                            }
                          }}
                          className="text-neutral-300 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. INTERACTIVE GUIDE (Answers the question how to edit prices/upload products) */}
      {activeSubTab === 'guide' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 relative">
            <span className="absolute -top-3 right-5 bg-amber-500 text-neutral-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              الدليل التدريبي التفاعلي الشامل
            </span>
            <h2 className="text-xl font-black text-amber-950 flex items-center gap-2 mt-2">
              <BookOpen className="w-6 h-6 text-amber-700" />
              كيف تقوم برفع المنتجات وتعديل الأسعار وإدارة طلبات باب شرقي؟
            </h2>
            <p className="text-xs text-amber-800 leading-relaxed mt-1.5 max-w-3xl">
              مرحبًا بك عزيزي صاحب المطعم في النظام الإداري لمطعمك الذكي. لقد تم تصميم واجهة الموقع هذه لتكون غاية في البساطة لتمكينك من تحديث وتسيير أعمال البيع مباشرة دون الحاجة لأي مبرمج أو خلفية تقنية. إليك الشرح التفاعلي المبسط لخطوات العمل:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black">١</span>
                <h3 className="font-extrabold text-neutral-950 text-base">طريقة رفع وجبة جديدة للزبائن</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                تريد طرح وجبة شاورما بصوص جديد؟ أو وجبة عائلية جديدة للبروستد؟ اتبع هذه الخطوات:
              </p>
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-205 text-xs text-neutral-600 space-y-1.5">
                <p><b>١. اذهب لقسم:</b> لوحة التحكم ← اضغط على التبويب الفرعي <b>"المنتجات وتعديل الأسعار"</b>.</p>
                <p><b>٢. اضغط على الزر:</b> <code>رفع وإضافة وجبة جديدة</code> (الأصفر بأعلى اليسار).</p>
                <p><b>٣. املأ البيانات:</b> اكتب الاسم، اختر فئة الطعام، السعر الإجمالي، والوصف اللذيذ.</p>
                <p><b>٤. رابط الصورة (اختياري):</b> يمكنك جلب رابط أي صورة من الإنترنت أو تركه فارغاً لنضع صورة ذبيحة افتراضية شهية من نظامنا.</p>
                <p><b>٥. اضغط حفظ:</b> فورا سيتم تثبيت المنتج في قائمة الزبائن!</p>
              </div>
              {/* Simulator view trigger */}
              <button
                onClick={() => {
                  setActiveSubTab('menu');
                  setShowAddForm(true);
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-neutral-900 font-bold text-xs rounded-xl transition text-center"
              >
                جرب الآن: افتح استمارة ملء وجبة جديدة ➔
              </button>
            </div>

            {/* Step 2 Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black">٢</span>
                <h3 className="font-extrabold text-neutral-950 text-base">كيف تغير الأسعار فوراً وتعدل التوفر؟</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                في حال وجود تخفيض على وجبة الشاورما العربي أو حدوث غلاء للموارد وتبديل الأسعار التلقائي:
              </p>
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-205 text-xs text-neutral-600 space-y-1.5">
                <p><b>أولاً - التعديل السريع للسعر:</b></p>
                <p className="pr-2 text-neutral-500">• تحت تبويب "المنتجات وتعديل الأسعار"، ابحث عن الوجبة المطلوبة.</p>
                <p className="pr-2 text-neutral-500">• مقابل السعر، اضغط على زر <b>"تعديل السعر"</b> واكتب القيمة الجديدة، ثم انقر <b>"حفظ"</b>.</p>
                <p><b>ثانياً - إيقاف وجبة نفذت المكونات (مثال: بروستد بالمساء):</b></p>
                <p className="pr-2 text-neutral-500">• اضغط على مفتاح <b>"متوفر الآن للطلب"</b> ليتحول لونه إلى اللون الأحمر بـ <b>"غير متوفر مؤقتاً"</b>.</p>
                <p className="pr-2 text-neutral-500">• بمجرد التغيير، سيظهر حظر حجز لهذه الوجبة فوراً لجميع الزبائن.</p>
              </div>
              <button
                onClick={() => {
                  setActiveSubTab('menu');
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-neutral-900 font-bold text-xs rounded-xl transition text-center"
              >
                جرب الآن: تعديل أسعار الوجبات بقائمتك ➔
              </button>
            </div>

            {/* Step 3 Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black">٣</span>
                <h3 className="font-extrabold text-neutral-950 text-base">متابعة طلبات الزبائن وتغيير حالتها حياً</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                عند قيام زبون بإجراء شراء، يطلق الجرس بالموقع ويظهر الإشعار في لوحة طلباتك الحية:
              </p>
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-205 text-xs text-neutral-600 space-y-1.5">
                <p><b>الخطوة ١ (استلام الطلب):</b> يظهر الطلب باللون البرتقالي كـ <b>"انتظار الموافقة"</b>.</p>
                <p><b>الخطوة ٢ (المطبخ):</b> انقر على <code>👨‍🍳 بدء التحضير</code>، ليعلم الزبون بشاشته تلقائياً أن طعامه بمرحلة الطهي والشواء.</p>
                <p><b>الخطوة ٣ (السائق):</b> اضغط على <code>🛵 إرسال مع الديليفري</code> للطلبات التي تحتاج توصيل.</p>
                <p><b>الخطوة ٤ (التسليم):</b> اضغط <code>✓ تأكيد التسليم</code> لإفراغ الطلب وحساب الكاش المحصل.</p>
              </div>
              <button
                onClick={() => {
                  setActiveSubTab('orders');
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-neutral-900 font-bold text-xs rounded-xl transition text-center"
              >
                شاهد لوحة الطلبات الواردة حياً الآن ➔
              </button>
            </div>

            {/* Step 4 Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black">٤</span>
                <h3 className="font-extrabold text-neutral-950 text-base">كيفية تنزيل التطبيق والرفع للمستضيف النهائي</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                لقد أنشأنا الموقع ليعمل بكفاءة مطلقة كـ تطبيق ويب متطور (PWA):
              </p>
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-205 text-xs text-neutral-600 space-y-1.5">
                <p><b>الرفع لزوارك:</b> الكود مكتوب بـ React و Tailwind الحديث وهو معالج محلياً وخفيف جداً.</p>
                <p><b>الملف المضغوط ZIP:</b> يمكنك تصدير الملفات كاملة من لوحة إعدادات سحابة AI Studio وتنزيله على حاسوبك، ورفعه إلى أي استضافة مجانية أو تجارية بضغطة زر لفتح نطاق واسع للمشترين!</p>
                <p><b>أيقونة الهاتف:</b> بتبويب "تثبيت التطبيق على الشاشة" بالرئيسية، توجد تعليمات مصورة واضحة جداً لكل مستخدم لهاتف آيفون أو أندرويد لإنشاء تطبيق مصغر على واجهة جواله.</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] font-bold">
                💡 معلومة مفيدة: تذكر دائماً أن التعديل على القائمة أو إضافة مأكولات يحفظ فوراً في المتصفح، حتى لو أغلقت النافذة وعدت لاحقاً ستكون جميع تعاديلك وأسعارك آمنة ومحفوظة!
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. SETTINGS PANEL */}
      {activeSubTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-5">
            <h3 className="font-extrabold text-neutral-900 border-b border-neutral-50 pb-3 text-sm flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-amber-600" />
              تعديل بيانات المطعم الأساسية ورسوم التوصيل:
            </h3>

            <div className="space-y-4 text-neutral-700">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المطعم على الموقع الرئيسي:</label>
                <input
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">رقم هاتف استقبال الاستفسارات:</label>
                  <input
                    type="text"
                    value={localPhone}
                    onChange={(e) => setLocalPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رمز العملة (مثال: د.أ أو $ أو ريال):</label>
                  <input
                    type="text"
                    value={localCurrency}
                    onChange={(e) => setLocalCurrency(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">تكلفة التوصيل ومصاريف السائق (افتراضي):</label>
                <input
                  type="text"
                  value={localDeliveryFee}
                  onChange={(e) => setLocalDeliveryFee(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-left font-sans"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">عنوان الفرع الرئيسي:</label>
                <input
                  type="text"
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition"
            >
              حفظ التعديلات الأساسية
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
