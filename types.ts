
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
  categoryId?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'packed' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  pickupDate: string;
  pickupTime: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'order' | 'alert';
  timestamp: string;
}

export interface AppState {
  user: User | null;
  isAdmin: boolean;
  cart: CartItem[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  notifications: AppNotification[];
}
