
import React, { useState } from 'react';
import { useApp } from '../store';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, formatCurrency } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!date || !time) {
      alert('Please select a pickup date and time.');
      return;
    }
    setLoading(true);
    await placeOrder(date, time);
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="p-6 text-center space-y-6 flex flex-col items-center justify-center h-[60vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Order Placed!</h2>
        <p className="text-slate-500">Your order is being prepared. <br/> Please prepare exactly <strong>{formatCurrency(total)}</strong> for Cash on Pickup.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-orange-600 text-white rounded-2xl font-bold"
        >
          View My Orders
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 mt-20">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <p className="text-lg font-medium text-slate-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Your Order</h2>
        <p className="text-sm text-slate-500">Confirm items and schedule store pickup</p>
      </div>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-50">
            <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">{item.name}</h4>
              <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-red-500 font-bold uppercase tracking-wider mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-slate-50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Pickup Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Select Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-slate-100 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Select Time</label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-slate-100 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white/50 font-bold uppercase tracking-widest">Cash on Pickup</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-sm font-medium opacity-60">Total Payable</span>
            <span className="block font-bold text-3xl mt-1 tracking-tight">{formatCurrency(total)}</span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</p>
            <p className="text-sm font-bold text-orange-500">Cash on Pickup (COP)</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-slate-400 mb-6 italic">*By placing this order, you agree to pick it up at the selected time and pay in cash at the store counter.</p>
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-orange-900/40"
          >
            {loading ? 'Confirming...' : 'Place Store Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
