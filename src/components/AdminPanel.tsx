import React, { useState } from 'react';
import { MenuItem, Category, Order, OrderStatus, RestaurantSettings, Offer } from '../types';
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
  Plus,
  Search,
  Calendar,
  DollarSign,
  Filter,
  FileText,
  Volume2,
  VolumeX,
  Tag,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../utils/audio';

interface AdminPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (newItem: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem: (updatedItem: MenuItem) => void;
  onToggleAvailability: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
  onRestoreDefaultMenu: () => void;
  offers?: Offer[];
  onAddOffer?: (newOffer: Omit<Offer, 'id' | 'createdAt'>) => void;
  onUpdateOffer?: (updatedOffer: Offer) => void;
  onToggleOfferAvailability?: (id: string) => void;
  onDeleteOffer?: (id: string) => void;
  onRestoreDefaultOffers?: () => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onUpdateOrderDeliveryTime: (id: string, minutes: number) => void;
  onClearOrders: () => void;
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: RestaurantSettings) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  showToast?: (text: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  setConfirmModal?: (modal: { message: string; description?: string; onConfirm: () => void } | null) => void;
}

export default function AdminPanel({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onToggleAvailability,
  onDeleteMenuItem,
  onRestoreDefaultMenu,
  offers = [],
  onAddOffer,
  onUpdateOffer,
  onToggleOfferAvailability,
  onDeleteOffer,
  onRestoreDefaultOffers,
  orders,
  onUpdateOrderStatus,
  onUpdateOrderDeliveryTime,
  onClearOrders,
  settings,
  onUpdateSettings,
  soundEnabled,
  onToggleSound,
  showToast,
  setConfirmModal,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'menu' | 'offers' | 'history' | 'guide' | 'settings'>('orders');

  // Search History State
  const [historySearchName, setHistorySearchName] = useState('');
  const [historySearchPhone, setHistorySearchPhone] = useState('');
  const [historySelectedStatus, setHistorySelectedStatus] = useState<string>('all');

  // New Item State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Exclude<Category, 'all'>>('shawarma');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemAddOns, setNewItemAddOns] = useState<string>('ثوم زيادة, ملح صيني, هالبينو حار');

  // New Offer State
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDescription, setNewOfferDescription] = useState('');
  const [newOfferPrice, setNewOfferPrice] = useState('');
  const [newOfferOriginalPrice, setNewOfferOriginalPrice] = useState('');
  const [newOfferImage, setNewOfferImage] = useState('');
  const [newOfferDiscountCode, setNewOfferDiscountCode] = useState('');

  // Edit Offer State
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editOfferTitle, setEditOfferTitle] = useState('');
  const [editOfferDescription, setEditOfferDescription] = useState('');
  const [editOfferPrice, setEditOfferPrice] = useState('');
  const [editOfferOriginalPrice, setEditOfferOriginalPrice] = useState('');
  const [editOfferImage, setEditOfferImage] = useState('');
  const [editOfferDiscountCode, setEditOfferDiscountCode] = useState('');

  // Status Sound / Notification State (Simulated)
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  // Custom safety notification triggering helpers
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    if (showToast) {
      showToast(text, type);
    } else {
      alert(text);
    }
  };

  const triggerConfirm = (message: string, description: string, onConfirm: () => void) => {
    if (setConfirmModal) {
      setConfirmModal({ message, description, onConfirm });
    } else {
      if (confirm(`${message}\n${description}`)) {
        onConfirm();
      }
    }
  };

  // Edit Product Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCategory, setEditItemCategory] = useState<Exclude<Category, 'all'>>('shawarma');
  const [editItemPrice, setEditItemPrice] = useState<string>('');
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemImage, setEditItemImage] = useState('');
  const [editItemAddOns, setEditItemAddOns] = useState('');

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
    triggerToast('✓ تم حفظ الإعدادات وتخصيص الموقع بنجاح!', 'success');
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice.trim()) {
      triggerToast('⚠️ يرجى ملء اسم الوجبة والسعر على الأقل.', 'warning');
      return;
    }

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('⚠️ يرجى إدخال سعر رقمي صحيح أكبر من صفر.', 'warning');
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
    triggerToast('✓ تم رفع وإضافة المنتج الجديد بنجاح فوري للقائمة!', 'success');
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle.trim() || !newOfferPrice.trim() || !newOfferOriginalPrice.trim()) {
      triggerToast('⚠️ يرجى ملء عنوان العرض والأسعار.', 'warning');
      return;
    }
    const priceNum = parseFloat(newOfferPrice);
    const origPriceNum = parseFloat(newOfferOriginalPrice);
    if (isNaN(priceNum) || priceNum <= 0 || isNaN(origPriceNum) || origPriceNum <= 0) {
      triggerToast('⚠️ يرجى إدخال أسعار رقمية صحيحة.', 'warning');
      return;
    }
    const imgUrl = newOfferImage.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
    if (onAddOffer) {
      onAddOffer({
        title: newOfferTitle.trim(),
        description: newOfferDescription.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        image: imgUrl,
        available: true,
        discountCode: newOfferDiscountCode.trim() || undefined
      });
      triggerToast('✓ تم إضافة العرض الترويجي المميّز بنجاح!', 'success');
      // Reset form
      setNewOfferTitle('');
      setNewOfferDescription('');
      setNewOfferPrice('');
      setNewOfferOriginalPrice('');
      setNewOfferImage('');
      setNewOfferDiscountCode('');
      setShowAddOfferForm(false);
    }
  };

  const handleSaveEditOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    if (!editOfferTitle.trim() || !editOfferPrice.trim() || !editOfferOriginalPrice.trim()) {
      triggerToast('⚠️ يرجى ملء عنوان العرض والأسعار.', 'warning');
      return;
    }
    const priceNum = parseFloat(editOfferPrice);
    const origPriceNum = parseFloat(editOfferOriginalPrice);
    if (isNaN(priceNum) || priceNum <= 0 || isNaN(origPriceNum) || origPriceNum <= 0) {
      triggerToast('⚠️ يرجى إدخال أسعار رقمية صحيحة.', 'warning');
      return;
    }
    if (onUpdateOffer) {
      onUpdateOffer({
        ...editingOffer,
        title: editOfferTitle.trim(),
        description: editOfferDescription.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        image: editOfferImage.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        discountCode: editOfferDiscountCode.trim() || undefined
      });
      triggerToast('✓ تم تحديث العرض وتفعيله للزبائن بنجاح!', 'success');
      setEditingOffer(null);
    }
  };

  const handleStartEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditOfferTitle(offer.title);
    setEditOfferDescription(offer.description);
    setEditOfferPrice(offer.price.toString());
    setEditOfferOriginalPrice(offer.originalPrice.toString());
    setEditOfferImage(offer.image);
    setEditOfferDiscountCode(offer.discountCode || '');
  };

  const startEditingItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemCategory(item.category);
    setEditItemPrice(item.price.toString());
    setEditItemDesc(item.description);
    setEditItemImage(item.image);
    setEditItemAddOns(item.add_on_options ? item.add_on_options.join(', ') : '');
  };

  const handleSaveFullItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editItemName.trim() || !editItemPrice.trim()) {
      triggerToast('⚠️ يرجى ملء اسم الوجبة والسعر على الأقل.', 'warning');
      return;
    }

    const priceNum = parseFloat(editItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('⚠️ يرجى إدخال سعر رقمي صحيح أكبر من صفر.', 'warning');
      return;
    }

    const addOnsArr = editItemAddOns
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    onUpdateMenuItem({
      ...editingItem,
      name: editItemName.trim(),
      category: editItemCategory,
      price: priceNum,
      description: editItemDesc.trim() || 'وجبة جديدة ومميزة تحضر بطريقة باب شرقي الشهيرة.',
      image: editItemImage.trim(),
      add_on_options: addOnsArr,
    });

    setEditingItem(null);
    triggerToast('✓ تم حفظ تعديل بيانات الوجبة بالكامل بنجاح!', 'success');
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
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-500 text-neutral-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                لوحة تحكم الآدمن
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-neutral-400">قناة اتصال الطلبات مفعلة حياً</span>
              
              {/* Sound status indicator and gesture unmuter */}
              <button
                onClick={() => {
                  const nextState = !soundEnabled;
                  onToggleSound(nextState);
                  if (nextState) {
                    // Instantly trigger a fast, friendly status chime to bypass browser autoplay policy restrictions
                    setTimeout(() => playNotificationSound('status_update'), 100);
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
                title={soundEnabled ? 'اضغط لكتم الأصوات التنبيهية' : 'اضغط لتفعيل جرس المطبخ وتجربة الصوت'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>جرس المطبخ مفعل 🔊</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 text-neutral-400" />
                    <span>جرس صامت 🔇</span>
                  </>
                )}
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              لوحة إدارة <span className="text-amber-400">سوبر باب شرقي</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              إدارة الوجبات، تعديل الأسعار وعرض وإرسال طلبات المشترين في الوقت الحقيقي بكل سلاسة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-4 md:pt-0 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => {
                triggerConfirm(
                  'هل أنت متأكد من مسح وحذف سجل الطلبات بالكامل؟',
                  'لا يمكن التراجع عن هذا الإجراء وسيتم تصفير كافة طلبات المستخدمين النشطة والأرشيف.',
                  () => {
                    onClearOrders();
                    triggerToast('🗑️ تم إفراغ وحذف سجل الطلبات والمبيعات بنجاح.', 'success');
                  }
                );
              }}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-red-600 hover:bg-red-700 border border-red-500/20 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-red-600/20 transition-all duration-200 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف سجل الطلبات</span>
            </button>

            <button
              onClick={() => {
                triggerConfirm(
                  'هل ترغب فعلاً باستعادة قائمة الطعام الافتراضية؟',
                  'تحذير: هذا سيؤدي إلى إعادة القائمة لعناصر الشاورما والبروستد الافتراضية وحذف أي منتجات مخصصة جديدة أو تعديلات أجريتها.',
                  () => {
                    onRestoreDefaultMenu();
                    triggerToast('🍲 تم إعادة ضبط قائمة الطعام للقالب الافتراضي بنجاح.', 'success');
                  }
                );
              }}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-450 text-xs font-bold rounded-xl transition-all duration-200 hover:border-amber-500/60 cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>استعادة مأكولات القالب الافتراضي</span>
            </button>

            <button
              onClick={() => {
                triggerConfirm(
                  'هل ترغب باستعادة العروض الخاصة والشلّة الافتراضية؟',
                  'سيتم إعادة ضبط وحذف كافة باقات العروض وتنزيل العروض الترويجية والخاصة الافتراضية مجدداً لتواصل العروض الحصرية.',
                  () => {
                    if (onRestoreDefaultOffers) {
                      onRestoreDefaultOffers();
                      triggerToast('🎁 تم إعادة تنزيل وضبط شبكة العروض الشامية بنجاح!', 'success');
                    }
                  }
                );
              }}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-450 text-xs font-bold rounded-xl transition-all duration-200 hover:border-rose-500/60 cursor-pointer shrink-0"
            >
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              <span>إعادة ضبط العروض الخاصة حصرياً</span>
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
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
              activeSubTab === 'history'
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            🔍 سجل الطلبات الشامل ({orders.length})
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
            onClick={() => setActiveSubTab('offers')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition ${
              activeSubTab === 'offers'
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            🎁 إدارة العروض الفعالة ({offers.length})
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
      {activeSubTab === 'orders' && (() => {
        const ratedOrders = orders.filter((o) => o.rating);
        const averageRating = ratedOrders.length > 0
          ? (ratedOrders.reduce((acc, o) => acc + o.rating!.stars, 0) / ratedOrders.length).toFixed(1)
          : null;

        return (
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

            {/* Real-time feedback analytics banner for the restaurant */}
            {averageRating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-bounce">⭐</div>
                  <div>
                    <h4 className="font-extrabold text-[#111] text-xs sm:text-sm">لوحة رصد جودة الخدمات والطهي الحي</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500">تم جمع الآراء والتقييمات بالثانية من الزبائن الذين استلموا طلباتهم من المطبخ.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white px-4 py-2 rounded-2xl border border-neutral-100 shadow-xs">
                    <span className="block text-[9px] text-neutral-400 font-bold">متوسط التقييم العام</span>
                    <span className="text-base font-black text-amber-600 font-sans">{averageRating} <span className="text-neutral-450 text-[10px] font-normal">/ ٥</span></span>
                  </div>
                  <div className="text-center bg-white px-4 py-2 rounded-2xl border border-neutral-100 shadow-xs">
                    <span className="block text-[9px] text-neutral-400 font-bold">الآراء والملاحظات</span>
                    <span className="text-base font-black text-neutral-800 font-sans">{ratedOrders.length} زبون</span>
                  </div>
                </div>
              </motion.div>
            )}

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

                        {order.rating && (
                          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 mt-2 space-y-1 text-right">
                            <p className="text-[10px] text-amber-950 font-bold flex items-center gap-1">
                              ⭐ تقييم المشتري المباشر للخدمة:
                            </p>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <span key={idx} className="text-xs">
                                  {idx < order.rating!.stars ? '⭐' : '☆'}
                                </span>
                              ))}
                            </div>
                            {order.rating.comment && (
                              <p className="text-[11px] text-neutral-800 bg-white/70 p-2 rounded-xl mt-1 leading-relaxed font-sans italic">
                                💬 "{order.rating.comment}"
                              </p>
                            )}
                            <p className="text-[8px] text-neutral-400 font-mono text-left block">الوصول: {order.rating.createdAt}</p>
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

                      {/* Dynamic Delivery/Preparation Time Editor */}
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/45 space-y-2 text-right">
                          <span className="text-[11px] font-extrabold text-neutral-700 flex items-center justify-between gap-1.5">
                            <span>⏱️ الوقت المتوقع {order.type === 'delivery' ? 'التوصيل' : 'الاستلام'}:</span>
                            <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                              {order.estimatedDeliveryTime || 40} دقيقة
                            </span>
                          </span>
                          
                          <div className="flex items-center gap-1.5 justify-end">
                            <select
                              value={order.estimatedDeliveryTime || 40}
                              onChange={(e) => onUpdateOrderDeliveryTime(order.id, parseInt(e.target.value) || 40)}
                              className="text-[11px] px-2 py-1 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white cursor-pointer"
                              dir="rtl"
                            >
                              <option value={15}>15 دقيقة (جاري التحضير ⚡)</option>
                              <option value={20}>20 دقيقة (سريع جداً ✨)</option>
                              <option value={30}>30 دقيقة (مناسب 👍)</option>
                              <option value={40}>40 دقيقة (قياسي 📦)</option>
                              <option value={50}>50 دقيقة (مزدحم قليلاً 🕒)</option>
                              <option value={60}>60 دقيقة (ساعة كاملة ⚠️)</option>
                              <option value={90}>90 دقيقة (تساؤل أو تأخر 🚨)</option>
                            </select>

                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={5}
                                max={240}
                                value={order.estimatedDeliveryTime || 40}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val && val >= 5 && val <= 240) {
                                    onUpdateOrderDeliveryTime(order.id, val);
                                  }
                                }}
                                className="w-12 text-center text-[11px] font-bold py-1 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                              />
                              <span className="text-[10px] text-neutral-500 font-sans">د</span>
                            </div>
                          </div>
                        </div>
                      )}

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
        );
      })()}

      {/* 1.5. ORDERS HISTORY AND ADVANCED SEARCH */}
      {activeSubTab === 'history' && (() => {
        const filteredHistoryOrders = orders.filter((order) => {
          // Search Name, Delivery details or Item names
          const nameMatch = !historySearchName.trim() ||
            order.customerName.toLowerCase().includes(historySearchName.toLowerCase()) ||
            order.id.toLowerCase().includes(historySearchName.toLowerCase()) ||
            order.address.toLowerCase().includes(historySearchName.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(historySearchName.toLowerCase()));

          // Search Phone
          const phoneMatch = !historySearchPhone.trim() ||
            order.customerPhone.includes(historySearchPhone.trim());

          // Filter Status
          const statusMatch = historySelectedStatus === 'all' ||
            order.status === historySelectedStatus;

          return nameMatch && phoneMatch && statusMatch;
        });

        // Compute marketing statistics for the matched group
        const totalMatchingCount = filteredHistoryOrders.length;
        const completedOrders = filteredHistoryOrders.filter(o => o.status === 'completed');
        const totalSalesAmount = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        
        const ratedOrders = filteredHistoryOrders.filter(o => o.rating);
        const averageRating = ratedOrders.length > 0
          ? (ratedOrders.reduce((sum, o) => sum + o.rating!.stars, 0) / ratedOrders.length).toFixed(1)
          : null;

        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-right">
            {/* Elegant Header Banner */}
            <div className="bg-gradient-to-l from-amber-500/5 to-neutral-50 border border-neutral-200/60 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#111] flex items-center gap-2">
                  <Search className="w-5.5 h-5.5 text-amber-600" />
                  أرشيف المبيعات الذكي ومطابقة فواتير الزبائن:
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl font-sans">
                  منصتنا التفاعلية لمتابعة تفاصيل حركة الكاش والبطاقات، وسرعة رصد عناوين توصيل الوجبات وتتبع آراء الزوار الكرام للارتقاء بجودة المطبخ الذهبي.
                </p>
              </div>
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-neutral-100 shadow-xs flex items-center gap-2 font-bold text-xs shrink-0">
                <span className="text-neutral-400">إجمالي نتائج البحث:</span>
                <span className="text-amber-600 font-black text-sm font-sans">{totalMatchingCount} طلب</span>
              </div>
            </div>

            {/* Quick Strategic Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-150 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-sm font-black">
                  💰
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-bold">المداخيل المكتملة المقبوضة</span>
                  <span className="text-sm font-black text-emerald-800 font-sans">
                    {totalSalesAmount.toFixed(2)} {settings.currency || 'د.أ'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-150 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-sm font-black">
                  ⭐
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-bold">تقييم الوجبات والسرعة</span>
                  <span className="text-sm font-black text-amber-700 font-sans">
                    {averageRating ? `${averageRating} / ٥` : 'لا توجد تقييمات'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-150 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 text-neutral-600 rounded-xl flex items-center justify-center text-sm font-black">
                  📦
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 font-bold">كفاءة الخدمة والتدبير</span>
                  <span className="text-sm font-black text-neutral-800 font-sans">
                    {completedOrders.length} تسليم ناجح
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Search Controls Section */}
            <div className="bg-white p-5 rounded-3xl border border-neutral-150 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-amber-600" />
                خيارات البحث الذكي وخيارات الفلترة المتقدمة:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Name or Item Search */}
                <div className="relative">
                  <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5">ابحث عن اسم الزبون، الوجبة أو تفاصيل المحل:</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: أحمد، سوبر شاورما، دبل بروستد..."
                      value={historySearchName}
                      onChange={(e) => setHistorySearchName(e.target.value)}
                      className="w-full pl-3 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right font-sans"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                {/* 2. Phone Search */}
                <div className="relative">
                  <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5">البحث برقم الهاتف أو الجوال بالكامل:</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="مثال: 079XXXXXXXX"
                      value={historySearchPhone}
                      onChange={(e) => setHistorySearchPhone(e.target.value)}
                      className="w-full pl-3 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left font-mono tracking-wider"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                {/* 3. Status Filter */}
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5">تصفية السجل بحسب حالة الطلب الحالية:</label>
                  <select
                    value={historySelectedStatus}
                    onChange={(e) => setHistorySelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right font-sans cursor-pointer"
                  >
                    <option value="all">📁 جميع الفواتير والحالات الكلية</option>
                    <option value="pending">⏳ فواتير قائمة الانتظار</option>
                    <option value="preparing">🍳 قيد الطهي والتجهيز الحي</option>
                    <option value="delivering">🚴 مع كابتن التوصيل على الطريق</option>
                    <option value="completed">✓ تم التسليم والقبض بنجاح</option>
                    <option value="cancelled">🛑 طلبات ملغاة مسبقاً</option>
                  </select>
                </div>
              </div>

              {(historySearchName.trim() || historySearchPhone.trim() || historySelectedStatus !== 'all') && (
                <div className="flex justify-start pt-1">
                  <button
                    onClick={() => {
                      setHistorySearchName('');
                      setHistorySearchPhone('');
                      setHistorySelectedStatus('all');
                    }}
                    className="text-[10px] text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
                  >
                    إعادة ضبط الفلاتر وعرض السجل كاملاً
                  </button>
                </div>
              )}
            </div>

            {/* List of Matched History Orders */}
            {filteredHistoryOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-neutral-100 shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-neutral-800 text-sm sm:text-base">لم نجد أي طلبات تطابق معايير ومفاتيح البحث المحددة</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto leading-relaxed">
                  تأكد من كتابة الرقم بشكل صحيح أو تغيير خيارات فلترة الحالة للوصول للمعلومات المطلوبة فوراً.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHistoryOrders.map((order) => {
                  const statusMeta = getStatusInfo(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      layout
                      className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition duration-200 overflow-hidden text-right flex flex-col justify-between"
                    >
                      {/* Order top bar */}
                      <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-2 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-neutral-900 font-mono tracking-wider">
                              رقم الفاتورة: #{order.id.slice(0, 8)}...
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusMeta.color}`}>
                              {statusMeta.label}
                            </span>
                          </div>
                          <span className="block text-[10px] text-neutral-400 font-mono">
                            تاريخ التسجيل: {order.createdAt}
                          </span>
                        </div>
                        <div className="bg-amber-500/10 text-amber-800 px-3 py-1.5 rounded-xl font-bold text-xs">
                          {order.totalPrice.toFixed(2)} {settings.currency || 'د.أ'}
                        </div>
                      </div>

                      {/* Customer / Service Specifications */}
                      <div className="p-5 space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100 text-xs">
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-neutral-400">اسم العميل والزبون</span>
                            <span className="font-bold text-neutral-800">{order.customerName}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-neutral-400">رقم التواصل المباشر</span>
                            <span className="font-bold text-neutral-800 font-mono" dir="ltr">{order.customerPhone}</span>
                          </div>
                          <div className="space-y-0.5 col-span-2">
                            <span className="block text-[9px] text-neutral-400">العنوان وحالة التوصيل</span>
                            <span className="font-medium text-neutral-700 block leading-relaxed">{order.address}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-neutral-400">نوع الطلبية</span>
                            <span className="font-bold text-amber-700">
                              {order.type === 'delivery' ? '🚴 توصيل منزلي سريّع' : order.type === 'dine_in' ? '🍽️ تجهيز داخل المطعم' : '🎒 استلام من الفرع نفسه'}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-neutral-400">بروتوكول الدفع عند الوصول</span>
                            <span className="font-bold text-neutral-800">
                              {order.paymentMethod === 'card_on_delivery' ? '💳 بطاقة بنكية/فيزا' : '💵 كاش نقداً بالليرة'}
                            </span>
                          </div>
                        </div>

                        {/* Customer direct note if any */}
                        {order.notes && (
                          <div className="bg-amber-500/5 p-3 rounded-2xl border border-dashed border-amber-500/20 text-[10px] text-neutral-700 leading-relaxed font-sans">
                            💡 ملاحظة دليفري: {order.notes}
                          </div>
                        )}

                        {/* Rating block if exists - beautifully highlighted */}
                        {order.rating && (
                          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-1">
                            <p className="text-[10px] text-amber-950 font-bold flex items-center gap-1">
                              ⭐ تقييم المشتري المباشر للخدمة:
                            </p>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <span key={idx} className="text-xs">
                                  {idx < order.rating!.stars ? '⭐' : '☆'}
                                </span>
                              ))}
                            </div>
                            {order.rating.comment && (
                              <p className="text-[11px] text-neutral-800 bg-white/70 p-2 rounded-xl mt-1 leading-relaxed font-sans italic">
                                💬 "{order.rating.comment}"
                              </p>
                            )}
                            <p className="text-[8px] text-neutral-400 font-mono text-left block">زمن الإرسال: {order.rating.createdAt}</p>
                          </div>
                        )}

                        {/* List of Ordered Dishes */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-neutral-400">مكونات ومحتويات الفاتورة:</h4>
                          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
                            {order.items.map((item, index) => (
                              <div key={index} className="p-3 bg-white hover:bg-neutral-50/50 flex items-center justify-between gap-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-black text-neutral-800">{item.name}</span>
                                    <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-lg text-neutral-500 font-bold">
                                      الكمية: {item.quantity} وجبة
                                    </span>
                                  </div>
                                  {item.selectedAddOns.length > 0 && (
                                    <span className="block text-[10px] text-neutral-400">
                                      الإضافات: {item.selectedAddOns.join(' ، ')}
                                    </span>
                                  )}
                                  {item.customerNote && (
                                    <span className="block text-[10px] text-amber-600 font-sans italic">
                                      تخصيص المطبخ: "{item.customerNote}"
                                    </span>
                                  )}
                                </div>
                                <span className="font-bold text-neutral-700 font-sans shrink-0">
                                  {(item.price * item.quantity).toFixed(2)} {settings.currency || 'د.أ'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Order Control actions - Pure Read-only log database */}
                      <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] text-neutral-400 font-bold shrink-0">
                          🗄️ الأرشفة: مستند غير قابل للتعديل
                        </span>
                        
                        <div className="flex gap-1.5">
                          <span className="text-[10px] text-neutral-500 font-sans">
                            حالة الفاتورة المسجلة: <strong className="font-extrabold">{statusMeta.label}</strong>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })()}

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
                        <button
                          onClick={() => startEditingItem(item)}
                          className="text-amber-600 font-bold hover:text-amber-800 flex items-center gap-1 bg-amber-55 hover:bg-amber-100 border border-amber-200/50 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          تعديل المنتج 📝
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            item.available
                              ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          }`}
                        >
                          {item.available ? '✓ متوفر للطلب' : '🛑 غير متوفر'}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            triggerConfirm(
                              `مسح الوجبة "${item.name}"؟`,
                              'سيتم حذف هذه الوجبة نهائياً من قائمة مأكولات باب شرقي ولن يتمكن العملاء من طلبها.',
                              () => {
                                onDeleteMenuItem(item.id);
                                triggerToast(`🗑️ تم مسح وجبة "${item.name}" بنجاح تام.`, 'success');
                              }
                            );
                          }}
                          className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
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
                <h3 className="font-extrabold text-neutral-950 text-base">مشاركة التطبيق مع زبائن المطعم</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                تم دمج ميزة التثبيت الفوري (PWA) ليعمل الموقع كتطبيق هاتف ذكي مباشر:
              </p>
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-205 text-xs text-neutral-600 space-y-1.5">
                <p><b>نشر رابط المتجر:</b> يمكنك نسخ رابط هذا الموقع ومشاركته فوراً على صفحات التواصل الاجتماعي الخاصة بالمطعم (فيسبوك، إنستغرام، واتساب).</p>
                <p><b>أيقونة شاشة الهاتف المباشرة:</b> يمكن لكل زبون إضافة هذه الصفحة إلى شاشته الرئيسية لتبدو كأي تطبيق آخر ومتابعة قائمة المأكولات فوراً.</p>
                <p><b>التحديث التلقائي السريع:</b> أي تغيير تجريه هنا على سعر وجبة أو توفرها يظهر مباشرة للزبائن في جميع نوافذهم دون تكلف عناء التحديث.</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] font-bold">
                💡 معلومة مفيدة: تذكر دائماً أن التعديل على القائمة وإضافة وجبات شاورما وبروستد جديدة يحفظ بأمان واستمرارية في قاعدة بيانات المتصفح للوصول إليه بأي وقت!
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
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer"
            >
              حفظ التعديلات الأساسية
            </button>
          </form>
        </motion.div>
      )}

      {/* 3b. OFFERS MANAGER PANEL */}
      {activeSubTab === 'offers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-lg flex items-center gap-1.5">
                <Gift className="w-5 h-5 text-rose-500 animate-pulse" />
                إدارة العروض الخاصة والترويجية الحصرية 🎁
              </h3>
              <p className="text-xs text-neutral-500">قم بإضافة عروض الكومبو المخصصة، الوجبات العائلية المدعومة وأكواد الكوبونات المباشرة بالثانية الأولى.</p>
            </div>
            
            <button
              onClick={() => setShowAddOfferForm(!showAddOfferForm)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/10"
            >
              {showAddOfferForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {showAddOfferForm ? 'إغلاق نافذة الإضافة' : 'إضافة عرض ترويجي جديد 🎁'}
            </button>
          </div>

          {/* ADD NEW OFFER FORM COLLAPSIBLE */}
          <AnimatePresence>
            {showAddOfferForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neutral-50 rounded-3xl p-5 sm:p-6 border border-neutral-200 overflow-hidden text-right"
              >
                <form onSubmit={handleCreateOffer} className="space-y-4">
                  <h4 className="font-bold text-neutral-800 text-xs sm:text-sm border-b border-neutral-200 pb-2">💡 تفاصيل العرض والوجبات المرفقة:</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">اسم العرض الترويجي (بالعربية):</label>
                      <input
                        type="text"
                        required
                        value={newOfferTitle}
                        onChange={(e) => setNewOfferTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        placeholder="مثال: عرض عمالقة البروستد الشامي"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 font-sans">كود الكوبون / كود الخصم (اختياري):</label>
                      <input
                        type="text"
                        value={newOfferDiscountCode}
                        onChange={(e) => setNewOfferDiscountCode(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-950 font-mono text-left"
                        placeholder="مثال: SHARQI30"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">وصف العرض والمشروبات والبطاطا المشمولة:</label>
                    <textarea
                      required
                      value={newOfferDescription}
                      onChange={(e) => setNewOfferDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none min-h-[60px] leading-relaxed"
                      placeholder="صف كل ما يحتويه الكومبو لإقناع المشتري، والبهارات والصلصة المرفقة..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">سعر العرض المميز ({settings.currency}):</label>
                      <input
                        type="text"
                        required
                        value={newOfferPrice}
                        onChange={(e) => setNewOfferPrice(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 font-sans font-extrabold text-left"
                        placeholder="السعر المطلوب (مثال: 9.90)"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">السعر الأصلي لجمع الوجبة قبل الخصم ({settings.currency}):</label>
                      <input
                        type="text"
                        required
                        value={newOfferOriginalPrice}
                        onChange={(e) => setNewOfferOriginalPrice(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-500 font-sans text-left line-through"
                        placeholder="القيمة السابقة (مثال: 12.50)"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">رابط صورة العرض المغري (Unsplash):</label>
                      <input
                        type="url"
                        value={newOfferImage}
                        onChange={(e) => setNewOfferImage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 font-mono text-left"
                        placeholder="سيبارك الموقع برابط صورة افتراضي إن تركته فارغاً..."
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      🚀 نشر وإطلاق العرض حياً في سماء التطبيق
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIST OFFERS CARDS */}
          {offers.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
              <span className="text-4xl">🏷️</span>
              <h4 className="font-bold text-neutral-800 text-base mt-2">لا يوجد أي عروض نشطة بقاعدتك الآن</h4>
              <p className="text-xs text-neutral-400 mt-1">اضغط على زر إعادة ضبط العروض الخاصة بالأعلى لتحميل العروض النموذجية فوراً!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const savings = (offer.originalPrice - offer.price).toFixed(2);
                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl overflow-hidden border ${offer.available ? 'border-neutral-100' : 'border-neutral-150 bg-neutral-50/50 opacity-75'} shadow-xs flex flex-col justify-between`}
                  >
                    <div>
                      <div className="h-44 w-full bg-neutral-100 relative">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 right-3 bg-red-650 text-white text-[9px] font-black px-2.5 py-1 rounded-lg">
                          خصم {savings} {settings.currency}
                        </span>
                        
                        {!offer.available && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-red-650 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md">
                              موقوف حالياً 🛑
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2 text-right">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="font-extrabold text-neutral-900 text-sm sm:text-base leading-tight">
                            {offer.title}
                          </h4>
                          {offer.discountCode && (
                            <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-amber-100">
                              {offer.discountCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-550 leading-relaxed font-sans min-h-[38px] line-clamp-2">
                          {offer.description}
                        </p>

                        <div className="flex items-baseline gap-2 pt-2">
                          <span className="text-lg font-black text-amber-750 font-sans">
                            {offer.price.toFixed(2)} <span className="text-xs text-neutral-550 font-normal">{settings.currency}</span>
                          </span>
                          <span className="text-xs text-neutral-450 line-through font-sans flex items-center pt-2">
                            {offer.originalPrice.toFixed(2)} {settings.currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between gap-2.5">
                      {/* Availability status switch toggled dynamically */}
                      <button
                        onClick={() => {
                          if (onToggleOfferAvailability) onToggleOfferAvailability(offer.id);
                        }}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                          offer.available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-350 hover:bg-neutral-200'
                        }`}
                      >
                        {offer.available ? '🟢 نشط بالمنيو' : '🛑 موقوف'}
                      </button>

                      <div className="flex items-center gap-1.5 font-sans">
                        <button
                          onClick={() => handleStartEditOffer(offer)}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 text-neutral-600 hover:text-amber-750 transition cursor-pointer"
                          title="تعديل العرض"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            triggerConfirm(
                              'هل أنت متأكد من حذف هذا العرض الترويجي بالكامل؟',
                              'سيختفي العرض والسندويشات العائلية المصاحبة لتفاصيله فوراً وبدقة من واجهات شراء العملاء.',
                              () => {
                                if (onDeleteOffer) onDeleteOffer(offer.id);
                                triggerToast('🗑️ تم حذف ومسح العرض من خادم البيانات بنجاح.', 'success');
                              }
                            );
                          }}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-neutral-600 hover:text-red-650 transition cursor-pointer"
                          title="حذف العرض"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Full Product Edit Overlay Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans text-right" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-black text-amber-400">📝 تعديل كامل تفاصيل المنتج</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-neutral-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveFullItemEdit} className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">اسم الوجبة:</label>
                <input
                  type="text"
                  required
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="مثال: شاورما دبل عربي سبيشال"
                />
              </div>

              {/* Category and Price Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-300">التصنيف:</label>
                  <select
                    value={editItemCategory}
                    onChange={(e) => setEditItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none"
                  >
                    <option value="shawarma">شاورما 🥙</option>
                    <option value="broasted">بروستد 🍗</option>
                    <option value="appetizers">مقبلات وصوصات 🍟</option>
                    <option value="drinks">مشروبات وغازيات 🥤</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-300">السعر ({settings.currency}):</label>
                  <input
                    type="text"
                    required
                    value={editItemPrice}
                    onChange={(e) => setEditItemPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-sans font-bold"
                    placeholder="مثال: 18.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">الوصف أو المكونات:</label>
                <textarea
                  value={editItemDesc}
                  onChange={(e) => setEditItemDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  rows={2}
                  placeholder="تفاصيل الحشوة والبطاطس والثومية الحارة..."
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">رابط صورة الوجبة:</label>
                <input
                  type="url"
                  value={editItemImage}
                  onChange={(e) => setEditItemImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  dir="ltr"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* Extras Add-ons comma separated list */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">الإضافات والمقبلات المرافقة (مفصولة بفاصلة):</label>
                <input
                  type="text"
                  value={editItemAddOns}
                  onChange={(e) => setEditItemAddOns(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="مثال: جبنة إضافية، ثومية حارة، دبس رمان"
                />
                <p className="text-[9px] text-neutral-500">اكتب الخيارات وافصل بينها بفاصلة عربية أو إنجليزية.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  حفظ وتطبيق التغييرات ✓
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Full Offer Edit Overlay Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans text-right" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-black text-amber-400">📝 تعديل كامل تفاصيل العرض</h3>
              <button
                type="button"
                onClick={() => setEditingOffer(null)}
                className="text-neutral-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEditOffer} className="space-y-4">
              {/* Offer Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">اسم العرض الترويجي:</label>
                <input
                  type="text"
                  required
                  value={editOfferTitle}
                  onChange={(e) => setEditOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="مثال: شلة الشاورما الضخمة برعاية باب شرقي"
                />
              </div>

              {/* Price Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-300">سعر العرض المميز ({settings.currency}):</label>
                  <input
                    type="text"
                    required
                    value={editOfferPrice}
                    onChange={(e) => setEditOfferPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-sans font-bold"
                    placeholder="مثال: 9.90"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-300">سعر العرض بدون الخصم ({settings.currency}):</label>
                  <input
                    type="text"
                    required
                    value={editOfferOriginalPrice}
                    onChange={(e) => setEditOfferOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none"
                    placeholder="مثال: 12.50"
                  />
                </div>
              </div>

              {/* Promo code */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">كود الخصم (Promo Code):</label>
                <input
                  type="text"
                  value={editOfferDiscountCode}
                  onChange={(e) => setEditOfferDiscountCode(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-left font-mono"
                  dir="ltr"
                  placeholder="مثال: SHARQI30"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">الوصف أو المكونات المرفقة:</label>
                <textarea
                  value={editOfferDescription}
                  onChange={(e) => setEditOfferDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  rows={3}
                  placeholder="تفاصيل العرض والمشروبات والبطاطا المشمولة..."
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-300">رابط صورة العرض ترويجياً:</label>
                <input
                  type="url"
                  value={editOfferImage}
                  onChange={(e) => setEditOfferImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  dir="ltr"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  حفظ وتطبيق التغييرات ✓
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
