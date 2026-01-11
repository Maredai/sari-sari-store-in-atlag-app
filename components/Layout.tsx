
import React from 'react';
import { useApp } from '../store';

const Layout: React.FC<{ children: React.ReactNode; activeTab: string; onTabChange: (tab: string) => void }> = ({ children, activeTab, onTabChange }) => {
  const { cart, isAdmin, logout, user } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF7F5]">
      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-50 ${isAdmin ? 'bg-slate-900 text-white' : 'bg-white shadow-sm text-slate-800'}`}>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {isAdmin ? 'Admin Dashboard' : 'Storefront'}
          </h1>
          {/* Accessing user.id since user is an object of type User | null */}
          <p className="text-xs opacity-70">ID: {user?.id}</p>
        </div>
        <button 
          onClick={logout}
          className="text-sm font-medium hover:opacity-70 transition-opacity"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Navigation Bar - Fixed Bottom (Mobile Style) */}
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-16 px-4 z-50">
          <button 
            onClick={() => onTabChange('menu')}
            className={`flex flex-col items-center flex-1 py-1 transition-colors ${activeTab === 'menu' ? 'text-orange-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="text-[10px] font-medium mt-1">Menu</span>
          </button>
          
          <button 
            onClick={() => onTabChange('cart')}
            className={`flex flex-col items-center flex-1 py-1 transition-colors relative ${activeTab === 'cart' ? 'text-orange-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="text-[10px] font-medium mt-1">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-1/4 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onTabChange('orders')}
            className={`flex flex-col items-center flex-1 py-1 transition-colors ${activeTab === 'orders' ? 'text-orange-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span className="text-[10px] font-medium mt-1">Orders</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default Layout;
