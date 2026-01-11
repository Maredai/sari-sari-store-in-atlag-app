
import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import Login from './screens/Login';
import Layout from './components/Layout';
import Menu from './screens/Menu';
import Cart from './screens/Cart';
import OrderHistory from './screens/OrderHistory';
import Admin from './screens/Admin';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useApp();
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 left-6 z-[100] space-y-2 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top border ${
            n.type === 'success' ? 'bg-green-600 text-white border-green-500' : 
            n.type === 'order' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-800 border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-bold">{n.message}</p>
          </div>
          <button onClick={() => removeNotification(n.id)} className="opacity-50 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('menu');

  if (!user) return <Login />;

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <NotificationToast />
      {isAdmin ? (
        <Admin />
      ) : (
        <>
          {activeTab === 'menu' && <Menu />}
          {activeTab === 'cart' && <Cart />}
          {activeTab === 'orders' && <OrderHistory />}
        </>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
