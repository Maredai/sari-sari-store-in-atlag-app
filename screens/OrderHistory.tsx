
import React, { useState } from 'react';
import { useApp } from '../store';
import { Order } from '../types';
import InvoiceModal from '../components/InvoiceModal';

const OrderHistory: React.FC = () => {
  const { orders, updateStatus, formatCurrency } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'packed': return 'bg-orange-100 text-orange-600';
      case 'ready': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-slate-200 text-slate-500';
      default: return 'bg-slate-100 text-slate-400';
    }
  };

  const handleCancel = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order? Items will be returned to store stock.")) {
      await updateStatus(orderId, 'cancelled');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Purchase History</h2>
          <p className="text-sm text-slate-500">Track your store pickup orders</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md relative overflow-hidden ${order.status === 'cancelled' ? 'opacity-70 grayscale' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Order UID #{order.id}</span>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                  {order.status === 'ready' ? 'Ready for Pickup' : order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup Store @</p>
                <p className="text-sm font-black text-slate-900">{order.pickupDate}</p>
                <p className="text-sm font-black text-orange-600">{order.pickupTime}</p>
              </div>
            </div>

            <div className="flex gap-4 items-center mb-6 p-4 bg-slate-50/50 rounded-2xl">
               <div className="flex -space-x-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <img key={idx} src={item.imageUrl} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" alt="" />
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800 truncate">
                  {order.items[0].name} {order.items.length > 1 ? ` & ${order.items.length - 1} other items` : ''}
                </p>
                <p className="text-xs font-bold text-orange-600 mt-0.5">{formatCurrency(order.total)} • Cash on Pickup</p>
              </div>
            </div>

            {/* Visual Progress Tracker */}
            {order.status !== 'cancelled' && (
              <div className="relative px-2 mb-6">
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mb-3 px-1">
                  <span className={order.status === 'pending' ? 'text-orange-600 font-black' : ''}>Pending</span>
                  <span className={order.status === 'packed' ? 'text-orange-600 font-black' : ''}>Packed</span>
                  <span className={order.status === 'ready' ? 'text-blue-600 font-black' : ''}>At Store</span>
                  <span className={order.status === 'completed' ? 'text-green-600 font-black' : ''}>Done</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className={`h-full bg-orange-600 transition-all duration-700 ease-out ${order.status === 'pending' ? 'w-[15%]' : order.status === 'packed' ? 'w-[45%]' : order.status === 'ready' ? 'w-[75%]' : 'w-full bg-green-500'}`} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedInvoice(order)}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  View Invoice
                </button>
                {order.status === 'pending' && (
                  <button 
                    onClick={() => handleCancel(order.id)}
                    className="flex-1 py-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-red-100"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
              
              {order.status === 'ready' && (
                <div className="p-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-blue-200 animate-pulse">
                  Ready at the Store Counter
                </div>
              )}
              {order.status === 'packed' && (
                <div className="py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center rounded-2xl border border-slate-100">
                  Preparing... Cancellation Locked
                </div>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No transaction history.</p>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};

export default OrderHistory;
