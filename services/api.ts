
import { Product, Order, User, OrderStatus, Category } from '../types';

const PRODUCTS_KEY = 'pickup_app_products';
const ORDERS_KEY = 'pickup_app_orders';
const USERS_KEY = 'pickup_app_users';
const CATEGORIES_KEY = 'pickup_app_categories';

const INITIAL_USERS: User[] = [
  { id: 'CUST-001', name: 'John Doe', role: 'customer' },
  { id: 'ADMIN-001', name: 'Store Manager', role: 'admin' },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Coffee' },
  { id: 'cat-2', name: 'Pastries' },
  { id: 'cat-3', name: 'Breakfast' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'P-001', name: 'Fresh Espresso', price: 180.00, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', stock: 50, description: 'Rich and intense dark roast espresso.', categoryId: 'cat-1' },
  { id: 'P-002', name: 'Classic Croissant', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a', stock: 20, description: 'Buttery, flaky, and golden-brown pastry.', categoryId: 'cat-2' },
  { id: 'P-003', name: 'Avocado Toast', price: 350.00, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8', stock: 15, description: 'Fresh avocado on sourdough with a hint of chili.', categoryId: 'cat-3' },
];

export const getUsers = async (): Promise<User[]> => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const registerUser = async (name: string): Promise<User> => {
  const users = await getUsers();
  const id = `CUST-${Math.floor(Math.random() * 900 + 100)}`;
  const newUser: User = { id, name, role: 'customer' };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return newUser;
};

export const addUserManually = async (user: User): Promise<void> => {
  const users = await getUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
};

export const getProducts = async (): Promise<Product[]> => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const products = await getProducts();
  const newProduct = { ...product, id: `P-${Date.now().toString().slice(-6)}` };
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...products, newProduct]));
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  products[index] = { ...products[index], ...updates };
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products[index];
};

export const deleteProduct = async (id: string): Promise<void> => {
  const products = await getProducts();
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.filter(p => p.id !== id)));
};

export const getCategories = async (): Promise<Category[]> => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const addCategory = async (name: string): Promise<Category> => {
  const categories = await getCategories();
  const newCat = { id: `cat-${Date.now()}`, name };
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify([...categories, newCat]));
  return newCat;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const categories = await getCategories();
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories.filter(c => c.id !== id)));
};

export const getOrders = async (customerId?: string): Promise<Order[]> => {
  const stored = localStorage.getItem(ORDERS_KEY);
  const allOrders: Order[] = stored ? JSON.parse(stored) : [];
  if (customerId && !customerId.startsWith('ADMIN')) {
    return allOrders.filter(o => o.customerId === customerId);
  }
  return allOrders;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
  const orders = await getOrders();
  const products = await getProducts();

  const updatedProducts = [...products];
  for (const item of orderData.items) {
    const pIdx = updatedProducts.findIndex(p => p.id === item.id);
    if (pIdx !== -1) {
      if (updatedProducts[pIdx].stock < item.quantity) throw new Error(`${item.name} out of stock.`);
      updatedProducts[pIdx].stock -= item.quantity;
    }
  }

  const newOrder: Order = { ...orderData, id: `ORD-${Date.now().toString().slice(-6)}`, status: 'pending', createdAt: new Date().toISOString() };
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
  return newOrder;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const orders = await getOrders();
  const products = await getProducts();
  const index = orders.findIndex(o => o.id === orderId);

  if (index !== -1) {
    const oldStatus = orders[index].status;
    orders[index].status = status;
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      const updatedProducts = [...products];
      for (const item of orders[index].items) {
        const pIdx = updatedProducts.findIndex(p => p.id === item.id);
        if (pIdx !== -1) updatedProducts[pIdx].stock += item.quantity;
      }
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};
