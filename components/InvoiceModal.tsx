
import React from 'react';
import { Order } from '../types';
import { useApp } from '../store';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { formatCurrency } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm no-print">
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter">Official Invoice</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div id="invoice-content" className="p-10 flex-1 overflow-y-auto space-y-8 bg-white">
          {/* Invoice Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-orange-600 tracking-tighter uppercase italic">Storefront</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quality Goods & Service</p>
            <div className="pt-4 flex justify-center">
               <div className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-mono text-slate-500">
                 INV-{order.id}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-y border-dashed border-slate-200">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer ID</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{order.customerId}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p>
              <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Date</p>
              <p className="text-sm font-bold text-slate-900">{order.pickupDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Time</p>
              <p className="text-sm font-bold text-orange-600 uppercase italic">{order.pickupTime}</p>
            </div>
          </div>

          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-left">
                  <th className="pb-3">Item Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="py-4 text-center font-mono text-slate-500">{item.quantity}</td>
                    <td className="py-4 text-right font-bold text-slate-800">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-slate-900/5 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Subtotal</span>
              <span className="font-bold">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-900 text-xl font-black pt-2">
              <span>Grand Total</span>
              <span className="text-orange-600">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-right text-[9px] font-black text-slate-400 uppercase tracking-tighter">CASH ON PICKUP (COP)</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              Please present this invoice at the counter upon arrival for pickup. Thank you for choosing us!
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
