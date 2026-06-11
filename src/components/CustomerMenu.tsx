import React, { useState } from 'react';
import { MenuItem, Category, CartItem, Offer } from '../types';
import { Search, Plus, Check, ShoppingBag, Eye, Star, Heart, Sparkles, Tag, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerMenuProps {
  menuItems: MenuItem[];
  offers?: Offer[];
  currency: string;
  onAddToCart: (item: MenuItem, quantity: number, addOns: string[], note: string) => void;
}

export default function CustomerMenu({ menuItems, offers = [], currency, onAddToCart }: CustomerMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalSelectedAddOns, setModalSelectedAddOns] = useState<string[]>([]);
  const [modalNote, setModalNote] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Categories translation
  const categoriesList: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'الكل', icon: '🍽️' },
    { id: 'shawarma', label: 'شاورما', icon: '🌯' },
    { id: 'broasted', label: 'البروستد المقرمش', icon: '🍗' },
    { id: 'appetizers', label: 'المقبلات والشوربات', icon: '🥗' },
    { id: 'drinks', label: 'مشروبات وعصائر', icon: '🍹' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddOnModal = (item: MenuItem) => {
    if (!item.available) return;
    setSelectedItemForModal(item);
    setModalQuantity(1);
    setModalSelectedAddOns([]);
    setModalNote('');
  };

  const handleToggleAddOn = (addOn: string) => {
    if (modalSelectedAddOns.includes(addOn)) {
      setModalSelectedAddOns(modalSelectedAddOns.filter((a) => a !== addOn));
    } else {
      setModalSelectedAddOns([...modalSelectedAddOns, addOn]);
    }
  };

  const handleConfirmAdd = () => {
    if (selectedItemForModal) {
      onAddToCart(selectedItemForModal, modalQuantity, modalSelectedAddOns, modalNote);
      setSelectedItemForModal(null);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">
      {/* Top Welcome Title */}
      <div className="text-center mb-6 mt-1 sm:mb-10 sm:mt-2">
        <h2 className="text-[10px] sm:text-xs font-bold text-amber-600 tracking-widest uppercase mb-1">تذوق الأصالة الشامية على أصولها</h2>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-sans tracking-tight">قائمة مأكولات <span className="text-amber-600">باب شرقي</span></h1>
        <p className="mt-1.5 text-neutral-500 text-[11px] sm:text-xs md:text-sm max-w-lg mx-auto">
          تذوق ألذ ساندويشات الشاورما بدبس الرمان والبروستد الذهبي المقرمش المحضر طازجاً يومياً بأجود المكونات المحلية.
        </p>
      </div>

      {/* 🎁 Special Animated Offers Carousel/Grid Section */}
      {offers.filter(o => o.available).length > 0 && (
        <div className="mb-10 bg-linear-to-r from-amber-50/70 via-rose-50/40 to-amber-50/70 rounded-3xl p-5 sm:p-7 border border-amber-100/60 shadow-xs relative overflow-hidden">
          {/* Subtle bg vector effects */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-amber-250 rounded-full blur-3xl opacity-30 -translate-x-12 -translate-y-12"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-amber-100/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl animate-bounce">🎁</span>
              <div>
                <h3 className="font-black text-neutral-900 text-sm sm:text-base">عروض الغداء والعطلات الكبرى 🔥</h3>
                <p className="text-[10px] sm:text-xs text-amber-800">وفّر حتى 30% مع التوصيل المجاني للمحبة والفتح!</p>
              </div>
            </div>
            <span className="self-start sm:self-center bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-white animate-pulse" />
              عروض حصرية وخاصة فقط 🌟
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.filter(o => o.available).map((offer) => {
              const savings = (offer.originalPrice - offer.price).toFixed(2);
              return (
                <motion.div
                  key={offer.id}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between relative group"
                >
                  {/* Saving Badge */}
                  <span className="absolute top-3 right-3 bg-red-650 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm z-10 animate-bounce">
                    وفر خصم {savings} {currency}
                  </span>

                  <div className="space-y-3">
                    {/* Offer Image */}
                    <div className="h-40 w-full rounded-xl overflow-hidden bg-neutral-100 relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1 text-right">
                      <h4 className="font-extrabold text-neutral-900 text-sm sm:text-base leading-tight">
                        {offer.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 leading-normal line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 space-y-3">
                    {/* Price panel */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-xl font-black text-amber-750 font-sans">
                          {offer.price.toFixed(2)} <span className="text-xs text-neutral-500">{currency}</span>
                        </span>
                        <span className="text-xs text-neutral-400 line-through font-sans">
                          {offer.originalPrice.toFixed(2)} {currency}
                        </span>
                      </div>
                      
                      {offer.discountCode && (
                        <span className="bg-amber-50 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded-lg border border-amber-100/60 font-sans flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-amber-600" />
                          كود: {offer.discountCode}
                        </span>
                      )}
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        const simulatedItem: MenuItem = {
                          id: offer.id,
                          name: offer.title,
                          description: offer.description,
                          price: offer.price,
                          category: 'shawarma',
                          image: offer.image,
                          available: offer.available,
                          add_on_options: []
                        };
                        onAddToCart(simulatedItem, 1, [], '');
                      }}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      طلب العرض وإضافته للسلة 🛍️
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="mb-6 space-y-3">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="ابحث عن وجبتك المفضلة (شاورما، بروستد، حمص...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 sm:py-3 bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs text-neutral-900 placeholder:text-neutral-400 font-sans"
          />
          <Search className="absolute right-4 top-3 sm:top-3.5 w-4.5 h-4.5 sm:w-5 sm:h-5 text-neutral-400" />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 snap-x scrollbar-none scroll-smooth">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`snap-center shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition duration-200 flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/10'
                  : 'bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200 hover:text-neutral-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-neutral-800 text-lg">عذراً، لم نجد أي وجبة تطابق بحثك</h3>
          <p className="text-xs text-neutral-400 mt-1">تأكد من كتابة أحرف صحيحة أو تصفح الأقسام من الأعلى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden border ${item.available ? 'border-neutral-100 hover:border-amber-300' : 'border-neutral-100 opacity-65'} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group relative`}
              >
                {/* Product Image Panel */}
                <div className="h-28 sm:h-52 w-full bg-neutral-100 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-neutral-900/85 backdrop-blur-xs text-amber-400 text-[8px] sm:text-[10px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider">
                    {categoriesList.find(c => c.id === item.category)?.label || item.category}
                  </span>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-xs hover:bg-white text-rose-500 p-1.5 sm:p-2 rounded-full shadow-xs transition"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Out of stock overlay */}
                  {!item.available && (
                    <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-1.5">
                      <span className="bg-red-600 text-white font-black text-[9px] sm:text-xs px-2.5 py-1.5 rounded-lg shadow-md text-center">
                        غير متوفر مؤقتاً 🛑
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1 sm:mb-1.5">
                      <h3 className="font-extrabold text-neutral-900 text-xs sm:text-base leading-tight group-hover:text-amber-700 transition duration-150 line-clamp-1">
                        {item.name}
                      </h3>
                      {/* Rating simulation just to make it extremely premium */}
                      <span className="max-w-fit shrink-0 flex items-center gap-0.5 text-[8px] sm:text-[11px] font-bold text-amber-505 bg-amber-50 px-1 py-0.5 rounded-sm sm:rounded-md scale-95 origin-right">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-505" />
                        4.9
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-neutral-400 leading-normal line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-neutral-100/50 pt-2 sm:pt-4 mt-auto gap-2">
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] sm:text-[10px] text-neutral-450 font-medium">السعر</span>
                      <span className="text-xs sm:text-lg font-black text-amber-700 font-sans">
                        {item.price.toFixed(2)} <span className="text-[9px] sm:text-xs text-neutral-500 font-normal">{currency}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenAddOnModal(item)}
                      disabled={!item.available}
                      className={`w-full sm:w-auto px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black transition duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                        item.available
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-600/10'
                          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      إضافة للسلة
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Deluxe Item Customized Add-ons Dialog/Modal */}
      <AnimatePresence>
        {selectedItemForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemForModal(null)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 border border-neutral-100 text-right flex flex-col max-h-[90vh]"
            >
              {/* Modal Banner Image */}
              <div className="h-44 bg-neutral-100 relative">
                <img
                  src={selectedItemForModal.image}
                  alt={selectedItemForModal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-5">
                  <div>
                    <span className="bg-amber-500 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded-full mb-1 inline-block">
                      تخصيص الوجبة
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedItemForModal.name}</h3>
                    <p className="text-xs text-neutral-300 line-clamp-1">{selectedItemForModal.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold transition"
                >
                  ×
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1 leading-relaxed">
                {/* 1. Base Addons List */}
                {selectedItemForModal.add_on_options && selectedItemForModal.add_on_options.length > 0 && (
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
                      إضافات مفضلة (ميجانا): (اختياري)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedItemForModal.add_on_options.map((addon) => {
                        const isSelected = modalSelectedAddOns.includes(addon);
                        return (
                          <button
                            key={addon}
                            onClick={() => handleToggleAddOn(addon)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition duration-150 ${
                              isSelected
                                ? 'bg-amber-50 border-amber-400 text-amber-800'
                                : 'bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200'
                            }`}
                          >
                            <span>{addon}</span>
                            <div className={`w-4 s:w-5 h-4 s:h-5 rounded-md flex items-center justify-center border transition ${
                              isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-200 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Customer special notes */}
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
                    ملاحظات مخصصة للشيف:
                  </h4>
                  <textarea
                    rows={2}
                    placeholder="امثلة: بدون كاتشب، أريد الثومية دبل، تحميص زيادة للخبز الصاج..."
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    className="w-full p-3 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-150 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                {/* 3. Quantity counter control */}
                <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-100">
                  <span className="text-sm font-bold text-neutral-800">الكمية المطلوبة:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-100 transition"
                    >
                      -
                    </button>
                    <span className="font-sans font-bold text-base text-neutral-900 w-6 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal footer sum */}
              <div className="p-5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">إجمالي المبلغ للعلبة</span>
                  <span className="text-xl font-extrabold text-[#111] font-sans">
                    {(selectedItemForModal.price * modalQuantity).toFixed(2)} <span className="text-xs text-neutral-600 font-normal">{currency}</span>
                  </span>
                </div>
                <button
                  onClick={handleConfirmAdd}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-600/10 transition duration-150 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  أضف للوجبات المصاحبة مجتمعة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
