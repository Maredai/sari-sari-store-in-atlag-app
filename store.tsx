
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem, Order, User, OrderStatus, AppNotification, Category } from './types';
import * as api from './services/api';

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  cart: CartItem[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  notifications: AppNotification[];
  login: (id: string) => Promise<boolean>;
  register: (name: string) => Promise<User>;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: (pickupDate: string, pickupTime: string) => Promise<void>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addNewCategory: (name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addUser: (name: string, id: string) => Promise<void>;
  removeNotification: (id: string) => void;
  formatCurrency: (amount: number) => string;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user_obj') || 'null'));
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('is_admin') === 'true');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const lastOrderCount = useRef<number>(0);
  const prevOrderStatuses = useRef<Record<string, OrderStatus>>({});

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const addNotification = useCallback((message: string, type: 'info' | 'success' | 'order' | 'alert' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message, type, timestamp: new Date().toISOString() }, ...prev]);
  }, []);

  const refreshData = useCallback(async () => {
    const p = await api.getProducts();
    const u = await api.getUsers();
    const c = await api.getCategories();
    setProducts(p);
    setUsers(u);
    setCategories(c);

    if (user) {
      const o = await api.getOrders(user.id);
      if (isAdmin) {
        if (o.length > lastOrderCount.current && lastOrderCount.current > 0) addNotification("New order received!", "order");
        lastOrderCount.current = o.length;
        setOrders([...o].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      } else {
        o.forEach(order => {
            const prevStatus = prevOrderStatuses.current[order.id];
            if (prevStatus && prevStatus !== order.status) {
                if (order.status === 'packed') addNotification(`Order #${order.id} Packed!`, 'info');
                if (order.status === 'ready') addNotification(`Order #${order.id} Ready!`, 'success');
            }
            prevOrderStatuses.current[order.id] = order.status;
        });
        setOrders(o);
      }
    }
  }, [user, isAdmin, notifications, addNotification]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const login = async (id: string) => {
    const allUsers = await api.getUsers();
    const found = allUsers.find(u => u.id === id);
    if (found) {
      setUser(found);
      const isAdm = found.role === 'admin';
      setIsAdmin(isAdm);
      localStorage.setItem('user_obj', JSON.stringify(found));
      localStorage.setItem('is_admin', String(isAdm));
      await refreshData();
      return true;
    }
    return false;
  };

  const register = async (name: string) => {
    const newUser = await api.registerUser(name);
    await refreshData();
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    localStorage.removeItem('user_obj');
    localStorage.removeItem('is_admin');
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

  const placeOrder = async (pickupDate: string, pickupTime: string) => {
    if (!user) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    try {
      await api.createOrder({ customerId: user.id, items: cart, total, pickupDate, pickupTime });
      setCart([]);
      addNotification("Order placed! Pay Cash on Pickup.", "success");
      await refreshData();
    } catch (e: any) { alert(e.message); }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => { await api.updateOrderStatus(orderId, status); await refreshData(); };
  const addNewProduct = async (p: Omit<Product, 'id'>) => { await api.addProduct(p); await refreshData(); };
  const updateProduct = async (id: string, p: Partial<Product>) => { await api.updateProduct(id, p); await refreshData(); };
  const deleteProduct = async (id: string) => { await api.deleteProduct(id); await refreshData(); };
  const addNewCategory = async (name: string) => { await api.addCategory(name); await refreshData(); };
  const removeCategory = async (id: string) => { await api.deleteCategory(id); await refreshData(); };
  const addUser = async (name: string, id: string) => { await api.addUserManually({ id, name, role: 'customer' }); await refreshData(); };
  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <AppContext.Provider value={{
      user, isAdmin, cart, products, categories, orders, users, notifications,
      login, register, logout, addToCart, removeFromCart, placeOrder,
      updateStatus, addNewProduct, updateProduct, deleteProduct, addNewCategory, removeCategory, addUser,
      removeNotification, formatCurrency, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
