export type Category = 'shawarma' | 'broasted' | 'appetizers' | 'drinks' | 'all';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'all'>;
  image: string;
  available: boolean;
  add_on_options?: string[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddOns: string[];
  customerNote: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: 'cash' | 'card_on_delivery';
  type: 'delivery' | 'pickup' | 'dine_in';
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    selectedAddOns: string[];
    customerNote: string;
  }[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface RestaurantSettings {
  name: string;
  phone: string;
  address: string;
  deliveryFee: number;
  currency: string; // e.g., 'د.أ' (JD) or '$'
  isOpen: boolean;
}
