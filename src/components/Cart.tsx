import { useState } from 'react';
import { CartItem, Order, MenuItem } from '../types';
import { ShoppingBag, Trash2, ArrowLeft, Truck, ShoppingCart, Send, CreditCard, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface CartProps {
  cartItems: CartItem[];
  currency: string;
  deliveryFee: number;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (orderDetails: {
    name: string;
    phone: string;
    address: string;
    type: 'delivery' | 'pickup' | 'dine_in';
    paymentMethod: 'cash' | 'card_on_delivery';
    notes?: string;
  }) => void;
}

export default function Cart({ cartItems, currency, deliveryFee, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  // Form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine_in'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_on_delivery'>('cash');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const activeDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;
  const netTotal = itemsTotal + activeDeliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!name.trim()) errors.push('الرجاء إدخال اسم العميل الكريم بالكامل.');
    if (!phone.trim()) errors.push('الرجاء كتابة رقم هاتف فعال للتواصل معنا.');
    if (orderType === 'delivery' && !address.trim()) errors.push('الرجاء كتابة عنوان التوصيل بالتفصيل وتحديد معالم قريبة لسهولة الوصول.');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    onCheckout({
      name,
      phone,
      address: orderType === 'delivery' ? address : 'استلام من الفرع الرئيسي لمطعم باب شرقي',
      type: orderType,
      paymentMethod,
      notes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#111] flex items-center justify-center gap-2 font-sans">
          <ShoppingCart className="w-8 h-8 text-amber-600" />
          سلة المشتريات والطلبات
        </h1>
        <p className="text-xs text-neutral-500 mt-1">راجع وجبات القائمة اللذيذة والكميات المسجلة واختياراتك المفضلة قبل الإرسال.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-neutral-800 text-lg">سلتك لا تزال فارغة حالياً</h3>
          <p className="text-xs text-neutral-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            الرجاء الانتقال لقائمة المأكولات وبدء تصفح ألذ وجبات الشاورما والبروستد الساخنة لإضافتها هنا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of Cart Items (Column 1) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs">
              <h3 className="font-extrabold text-neutral-900 border-b border-neutral-50 pb-3 mb-4 text-sm">
                محتويات السلة الحالية ({cartItems.length} وجبات):
              </h3>

              <div className="divide-y divide-neutral-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-neutral-900 text-sm leading-tight truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-neutral-300 hover:text-red-500 transition p-1"
                          title="حذف الوجبة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Display Add-ons */}
                      {item.selectedAddOns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.selectedAddOns.map((addOn, i) => (
                            <span key={i} className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                              + {addOn}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes indicator */}
                      {item.customerNote && (
                        <p className="text-[10px] text-amber-600 bg-amber-50/50 p-1.5 rounded-lg mt-1.5">
                          ملاحظة: {item.customerNote}
                        </p>
                      )}

                      {/* Controls Footer */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition"
                          >
                            -
                          </button>
                          <span className="font-sans font-extrabold text-xs text-neutral-800 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Price computation */}
                        <div className="text-left">
                          <span className="text-neutral-900 text-xs font-bold font-sans">
                            {(item.menuItem.price * item.quantity).toFixed(2)} <span className="text-[10px] text-neutral-500">{currency}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>المبلغ الفرعي للوجبات:</span>
                <span className="font-sans font-bold text-neutral-800 text-sm">
                  {itemsTotal.toFixed(2)} {currency}
                </span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    تكلفة تابل التوصيل السريع:
                  </span>
                  <span className="font-sans font-bold text-neutral-800 text-sm">
                    {deliveryFee.toFixed(2)} {currency}
                  </span>
                </div>
              )}

              <div className="border-t border-neutral-100 pt-3.5 flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-sm">صافي إجمالي الحساب:</span>
                <span className="text-xl font-black text-amber-700 font-sans">
                  {netTotal.toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Checkout Form (Column 2) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-5">
            <h3 className="font-extrabold text-neutral-900 border-b border-neutral-50 pb-3 text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" />
              تعبئة بيانات التوصيل والتأكيد:
            </h3>

            {/* Type tabs (Delivery vs Dine-in vs Pickup) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2">نوع ومكان تغذية الطلب:</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition ${
                    orderType === 'delivery' ? 'bg-amber-600 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  🚚 توصيل دليفري
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition ${
                    orderType === 'pickup' ? 'bg-amber-600 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  🛍️ استلام سفري
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition ${
                    orderType === 'dine_in' ? 'bg-amber-600 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  🍽️ داخل مطعمنا
                </button>
              </div>
            </div>

            {/* Dynamic Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">اسم العميل بالكامل *</label>
                <input
                  type="text"
                  placeholder="مثال: أحمد عبد الله المحترم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 focus:bg-white border border-neutral-150 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-neutral-900 placeholder:text-neutral-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">رقم الهاتف الفعال للتأكيد والمتابعة *</label>
                <input
                  type="text"
                  placeholder="مثال: 079XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 focus:bg-white border border-neutral-150 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-neutral-900 placeholder:text-neutral-400 font-sans text-left"
                  dir="ltr"
                />
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 font-sans">عنوان التسليم الدقيق بالتفصيل *</label>
                  <input
                    type="text"
                    placeholder="مثال: عمان، خلدا - شارع المدارس - عمارة رقم 14 - الشقة 2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 focus:bg-white border border-neutral-150 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-neutral-900 placeholder:text-neutral-400 font-sans"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">طريقة الدفع المقررة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-bold transition ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-50 border-amber-400 text-amber-800'
                        : 'bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    💵 كاش نقدي
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_on_delivery')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-bold transition ${
                      paymentMethod === 'card_on_delivery'
                        ? 'bg-amber-50 border-amber-400 text-amber-800'
                        : 'bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    💳 بطاقة مع الديلفري
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">ملاحظات تسليم الطلب (المزيد للطهي):</label>
                <textarea
                  rows={2}
                  placeholder="اكتب أي ملاحظة أخرى مثل: يرجى ترك الطلب عند الباب أو رن الجرس مرتين عند الوصول..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-neutral-50/70 focus:bg-white border border-neutral-150 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none font-sans"
                ></textarea>
              </div>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-150 text-red-700">
                {formErrors.map((err, i) => (
                  <p key={i} className="text-[10px] font-bold leading-relaxed">
                    • {err}
                  </p>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-amber-600/10 transition-colors flex items-center justify-center gap-2"
            >
              إرسال طلب الطعام للمطبخ 👨‍🍳🔥
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
