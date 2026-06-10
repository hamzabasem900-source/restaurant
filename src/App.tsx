import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, RestaurantSettings } from './types';
import { DEFAULT_MENU_ITEMS, INITIAL_SETTINGS } from './data';
import CustomerMenu from './components/CustomerMenu';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import PwaInstallGuide from './components/PwaInstallGuide';
import {
  Utensils,
  ShoppingBag,
  Cpu,
  Smartphone,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  PartyPopper,
  CheckCircle,
  Truck,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global synchronized states with LocalStorage persistence so their modifications remain durable
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('bab_sharqi_menu');
    return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bab_sharqi_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bab_sharqi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('bab_sharqi_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'pwa' | 'admin' | 'tracking'>('menu');
  const [currentTrackingOrderId, setCurrentTrackingOrderId] = useState<string | null>(() => {
    return localStorage.getItem('bab_sharqi_tracking_id') || null;
  });

  // Persists states in localStorage on changes
  useEffect(() => {
    localStorage.setItem('bab_sharqi_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('bab_sharqi_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bab_sharqi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bab_sharqi_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentTrackingOrderId) {
      localStorage.setItem('bab_sharqi_tracking_id', currentTrackingOrderId);
    } else {
      localStorage.removeItem('bab_sharqi_tracking_id');
    }
  }, [currentTrackingOrderId]);

  // Audio simulation or notification (safely handled visually to bypass sound permissions issues on sandboxes)
  const [newOrderArrivedToast, setNewOrderArrivedToast] = useState(false);

  // Core functions
  const handleAddToCart = (item: MenuItem, quantity: number, addOns: string[], note: string) => {
    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      selectedAddOns: addOns,
      customerNote: note,
    };
    setCart((prev) => [...prev, newItem]);
    alert(`✓ تم إضافة ${quantity} × ${item.name} بنجاح إلى سلتك!`);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCart((prev) => {
      const clone = [...prev];
      clone[index].quantity = newQty;
      return clone;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = (orderDetails: {
    name: string;
    phone: string;
    address: string;
    type: 'delivery' | 'pickup' | 'dine_in';
    paymentMethod: 'cash' | 'card_on_delivery';
    notes?: string;
  }) => {
    const itemsTotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const deliveryCharge = orderDetails.type === 'delivery' ? settings.deliveryFee : 0;

    const newOrder: Order = {
      id: `BQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderDetails.name,
      customerPhone: orderDetails.phone,
      address: orderDetails.address,
      type: orderDetails.type,
      paymentMethod: orderDetails.paymentMethod,
      items: cart.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        selectedAddOns: item.selectedAddOns,
        customerNote: item.customerNote,
      })),
      totalPrice: itemsTotal + deliveryCharge,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      notes: orderDetails.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setCurrentTrackingOrderId(newOrder.id);
    setActiveTab('tracking');

    // Notify simulated toast
    setNewOrderArrivedToast(true);
    setTimeout(() => setNewOrderArrivedToast(false), 8000);
  };

  // Admin adjustments
  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const id = `sh-${Date.now()}`;
    setMenuItems((prev) => [...prev, { ...newItem, id }]);
  };

  const handleUpdateMenuItemPrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRestoreDefaultMenu = () => {
    setMenuItems(DEFAULT_MENU_ITEMS);
  };

  const handleUpdateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
  };

  const handleClearOrders = () => {
    setOrders([]);
    setCurrentTrackingOrderId(null);
  };

  const handleUpdateSettings = (newSettings: RestaurantSettings) => {
    setSettings(newSettings);
  };

  // Find the currently tracked order details
  const currentlyTrackedOrder = orders.find((o) => o.id === currentTrackingOrderId);

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-neutral-800 flex flex-col font-sans" dir="rtl">
      {/* Real-time Toast Simulator Indicator */}
      <AnimatePresence>
        {newOrderArrivedToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] bg-neutral-950 text-white rounded-3xl p-5 shadow-2xl z-50 border border-neutral-800 text-right leading-relaxed"
          >
            <div className="flex gap-4">
              <div className="p-3 bg-amber-500 rounded-2xl text-neutral-950 self-start animate-bounce">
                🎉
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-amber-400 text-sm">تم إرسال طلبك للمطبخ بنجاح! 🔥</h4>
                <p className="text-xs text-neutral-300 mt-1">
                  لقد استلمنا طلب طعامك بمطعم باب شرقي.
                </p>
                <div className="bg-neutral-900 p-2.5 rounded-xl mt-3 border border-neutral-800 text-[10px] text-neutral-400">
                  💡 <b>تجربة ممتعة للمدير:</b> يمكنك التغيير الآن إلى تبويب <b>"لوحة التحكم"</b> بالأعلى لتشاهد الطلب الذي أرسلته فوراً هناك، والموافقة عليه لرؤية انعكاس القبول حياً!
                </div>
              </div>
              <button
                onClick={() => setNewOrderArrivedToast(false)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner indicating restaurant status */}
      <div className="bg-amber-600 text-amber-50 text-[11px] font-bold py-2 text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 animate-pulse inline" />
        <span>بمناسبة الافتتاح، توصيل مجاني سريع لأول 50 طلب! استمتع بأقوى العروض الشامية</span>
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-neutral-100 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and phone info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md shadow-amber-600/25 border-2 border-white transform rotate-3 hover:rotate-0 transition-transform">
              شرقي
            </div>
            <div>
              <h1 className="text-xl font-black text-neutral-950">{settings.name}</h1>
              <p className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                {settings.address}
              </p>
            </div>
          </div>

          {/* Tab Button Menu */}
          <nav className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition duration-150 flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              قائمة الطعام
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition duration-150 flex items-center gap-1.5 relative ${
                activeTab === 'cart'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              السلة الحية
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -left-1 bg-red-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center tracking-tighter">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            {currentlyTrackedOrder && (
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition duration-150 flex items-center gap-1.5 ${
                  activeTab === 'tracking'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                }`}
              >
                🛰️ تتبع طلبك
              </button>
            )}
            <button
              onClick={() => setActiveTab('pwa')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition duration-150 flex items-center gap-1.5 ${
                activeTab === 'pwa'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              تنزيل التطبيق
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition duration-150 flex items-center gap-1.5 border ${
                activeTab === 'admin'
                  ? 'bg-neutral-900 border-neutral-950 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              لوحة التحكم (المدير)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Stage Body */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <CustomerMenu
              menuItems={menuItems}
              currency={settings.currency}
              onAddToCart={handleAddToCart}
            />
          )}

          {activeTab === 'cart' && (
            <Cart
              cartItems={cart}
              currency={settings.currency}
              deliveryFee={settings.deliveryFee}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onCheckout={handleCheckout}
            />
          )}

          {activeTab === 'pwa' && <PwaInstallGuide />}

          {activeTab === 'admin' && (
            <AdminPanel
              menuItems={menuItems}
              onAddMenuItem={handleAddMenuItem}
              onUpdateMenuItemPrice={handleUpdateMenuItemPrice}
              onToggleAvailability={handleToggleAvailability}
              onDeleteMenuItem={handleDeleteMenuItem}
              onRestoreDefaultMenu={handleRestoreDefaultMenu}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onClearOrders={handleClearOrders}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeTab === 'tracking' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="max-w-xl mx-auto px-4 py-12 text-right"
              dir="rtl"
            >
              {currentlyTrackedOrder ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xl space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-3 animate-pulse">
                      🛸
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 leading-tight">طلب طعامك قيد المعالجة الآن!</h2>
                    <p className="text-xs text-neutral-400 mt-1">كود تتبع الطلب: <span className="font-mono text-amber-700 font-extrabold">{currentlyTrackedOrder.id}</span></p>
                  </div>

                  {/* Real-time Order Tracker Steps visually represented */}
                  <div className="py-4 space-y-6 relative mr-6 border-r-2 border-neutral-150 text-xs text-neutral-500">
                    {/* Step 1: Pending */}
                    <div className="relative pr-6">
                      <div className={`absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        currentlyTrackedOrder.status === 'pending' ? 'bg-amber-500 animate-ping' : 'bg-green-600'
                      }`}></div>
                      <h4 className={`font-bold ${currentlyTrackedOrder.status === 'pending' ? 'text-amber-600 text-sm' : 'text-neutral-900'}`}>
                        مرحلة الموافقة الأولى بالمكتب ⏳
                      </h4>
                      <p className="text-[10px] text-neutral-400">يقوم المحاسب الآن بدراسة سلة المشتريات والتأكيد الفوري.</p>
                    </div>

                    {/* Step 2: Preparing */}
                    <div className="relative pr-6">
                      <div className={`absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        currentlyTrackedOrder.status === 'preparing' ? 'bg-blue-500 animate-ping' : currentlyTrackedOrder.status === 'pending' ? 'bg-neutral-200' : 'bg-green-600'
                      }`}></div>
                      <h4 className={`font-bold ${currentlyTrackedOrder.status === 'preparing' ? 'text-blue-600 text-sm' : (currentlyTrackedOrder.status === 'delivering' || currentlyTrackedOrder.status === 'completed') ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        شحن الشاورما والبروستد للموقد والتحضير 👨‍🍳🔥
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-sans">معلم شاورما باب شرقي يقوم بصف الوجبة وقلي البطاطس لتكون ساخنة ومقرمشة.</p>
                    </div>

                    {/* Step 3: Delivering */}
                    <div className="relative pr-6">
                      <div className={`absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        currentlyTrackedOrder.status === 'delivering' ? 'bg-purple-500 animate-ping' : (currentlyTrackedOrder.status === 'completed') ? 'bg-green-600' : 'bg-neutral-200'
                      }`}></div>
                      <h4 className={`font-bold ${currentlyTrackedOrder.status === 'delivering' ? 'text-purple-600 text-sm' : currentlyTrackedOrder.status === 'completed' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        سائق الدليفري يستعجل الطريق لإيصالها ساخنة 🛵💨
                      </h4>
                      <p className="text-[10px] text-neutral-400">الوجبة معبأة بعلب حافظة للحرارة وتسير في طريقها إليك.</p>
                    </div>

                    {/* Step 4: Completed */}
                    <div className="relative pr-6">
                      <div className={`absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        currentlyTrackedOrder.status === 'completed' ? 'bg-green-600' : 'bg-neutral-200'
                      }`}></div>
                      <h4 className={`font-bold ${currentlyTrackedOrder.status === 'completed' ? 'text-green-600 text-sm' : 'text-neutral-400'}`}>
                        تم استلام الطلب بألف هنا وشفاء! 🥙🎉
                      </h4>
                      <p className="text-[10px] text-neutral-400">الوجبة وصلت يدك الكريمة. نتمنى لك تذوقاً رائعاً لباب شرقي!</p>
                    </div>
                  </div>

                  {/* Real-time instruction indicator reminding client how to test and play with it! */}
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <p className="text-xs text-amber-900 font-bold flex items-center gap-1.5">
                      <Cpu className="w-4.5 h-4.5 text-amber-600" />
                      تجربة تفاعلية لمحاكاة الواقع حياً:
                    </p>
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      نظراً لأنك فتحت الموقع على شاشتك لحساب العميل والمدير معاً للمحاكاة المباشرة، <b>انتقل الآن إلى زر "لوحة التحكم (المدير)" بالأعلى</b>، وانقر على <b>الموافقة والتحضير</b>، وارجع مجدداً لهذه الشاشة لتلاحظ كيف تغيرت خطوة التتبع حياً بالثانية كما لو كان طلباً حقيقياً بالمطعم!
                    </p>
                  </div>

                  {/* Summary items list for client reference */}
                  <div className="border-t border-neutral-100 pt-5 text-xs text-neutral-500 space-y-1">
                    <h5 className="font-extrabold text-neutral-800 mb-2">الوجبات المحجوزة الحالية:</h5>
                    {currentlyTrackedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-sans">
                        <span>{it.name} × {it.quantity}</span>
                        <span className="font-bold">{(it.price * it.quantity).toFixed(2)} {settings.currency}</span>
                      </div>
                    ))}
                    <div className="border-t border-neutral-100 pt-2 flex justify-between font-bold text-neutral-900 text-sm mt-3">
                      <span>إجمالي الحساب العام:</span>
                      <span className="text-amber-700 font-sans font-black">{currentlyTrackedOrder.totalPrice.toFixed(2)} {settings.currency}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                  <h3 className="font-bold text-neutral-800">لا يوجد طلب تتبع مسجل حالياً</h3>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="mt-4 px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-lg transition"
                  >
                    اذهب لقائمة الطعام لطلب وجبة
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-neutral-100 py-6 text-center text-xs text-neutral-400">
        <p>© ٢٠٢٦ {settings.name} - كافة الحقوق محفوظة لصاحب المطعم الموقر.</p>
        <p className="mt-1 font-sans text-[10px] text-neutral-300">تم التطوير باحترافية كاملة ودعم الـ PWA لتثبيت الأيقونات المباشرة.</p>
      </footer>
    </div>
  );
}
