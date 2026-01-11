
import React, { useState } from 'react';
import { useApp } from '../store';
import { Product, User, Order } from '../types';
import InvoiceModal from '../components/InvoiceModal';

const Admin: React.FC = () => {
  const { orders, products, categories, users, addNewProduct, updateProduct, deleteProduct, addNewCategory, removeCategory, updateStatus, addUser, formatCurrency } = useApp();
  const [activeView, setActiveView] = useState<'orders' | 'products' | 'categories' | 'customers'>('orders');
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  
  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [catId, setCatId] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');

  // Customer Form State
  const [custName, setCustName] = useState('');
  const [custId, setCustId] = useState('');

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      name, 
      price: parseFloat(price), 
      imageUrl, 
      stock: parseInt(stock),
      description,
      categoryId: catId
    };
    if (editingId) await updateProduct(editingId, payload);
    else await addNewProduct(payload);
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingId(null); setName(''); setPrice(''); setImageUrl(''); setStock(''); setDescription(''); setCatId('');
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addNewCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-32">
      <div className="bg-slate-800 text-white p-6 rounded-3xl flex flex-wrap gap-4 justify-between items-center shadow-lg no-print">
        <h2 className="text-xl font-black uppercase tracking-widest">Admin Hub</h2>
        <div className="flex p-1 bg-slate-700 rounded-2xl overflow-x-auto max-w-full">
          {['orders', 'products', 'categories', 'customers'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeView === view ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400'}`}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 px-2 no-print">FIFO Queue</h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order.id} className={`bg-white p-6 rounded-3xl shadow-sm border-l-8 transition-all ${order.status === 'completed' ? 'border-green-500 opacity-60' : order.status === 'cancelled' ? 'border-slate-300 opacity-40 grayscale' : 'border-orange-500 shadow-orange-100'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-xl text-slate-900">#{order.id}</h3>
                      <button 
                        onClick={() => setSelectedInvoice(order)}
                        className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black no-print"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Invoice
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Customer: {order.customerId}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map(item => (
                        <div key={item.id} className="text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          <span className="font-black text-orange-600">{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-4 w-full sm:w-auto">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup</p>
                      <p className="font-bold text-slate-900">{order.pickupDate} @ {order.pickupTime}</p>
                      <p className="text-orange-600 font-black text-lg">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap no-print">
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <>
                          <button onClick={() => updateStatus(order.id, 'packed')} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 ${order.status === 'packed' ? 'bg-orange-600 text-white border-orange-600' : 'text-orange-600 border-orange-100'}`}>PACKED</button>
                          <button onClick={() => updateStatus(order.id, 'ready')} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 ${order.status === 'ready' ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-600 border-blue-100'}`}>READY</button>
                          <button onClick={() => updateStatus(order.id, 'completed')} className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase bg-green-600 text-white">DONE</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'products' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <form onSubmit={handleProductSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <h3 className="sm:col-span-2 font-black text-2xl text-slate-900 border-b pb-4">{editingId ? 'Modify Product' : 'New Product'}</h3>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
               <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium" required />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Price (PHP)</label>
               <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium" required />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Category</label>
               <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium outline-none">
                  <option value="">Uncategorized</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stock</label>
               <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium" required />
            </div>
            <div className="space-y-1 sm:col-span-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Image URL</label>
               <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium" required />
            </div>
            <button type="submit" className="sm:col-span-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              {editingId ? 'Update Product' : 'Publish Product'}
            </button>
            {editingId && <button onClick={resetProductForm} className="sm:col-span-2 py-2 text-slate-400 font-bold uppercase text-xs">Cancel Editing</button>}
          </form>

          <div className="bg-white rounded-[2rem] shadow-sm divide-y divide-slate-50">
            {products.map(p => (
              <div key={p.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                  <div>
                    <h4 className="font-black text-slate-800">{p.name}</h4>
                    <p className="text-xs text-orange-600 font-bold">{formatCurrency(p.price)} • {categories.find(c => c.id === p.categoryId)?.name || 'No Category'}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Stock: {p.stock} units</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(p.id); setName(p.name); setPrice(p.price.toString()); setImageUrl(p.imageUrl); setStock(p.stock.toString()); setCatId(p.categoryId || ''); }} className="p-3 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'categories' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <form onSubmit={handleCatSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex gap-4">
            <input 
              placeholder="New Category Name (e.g. Drinks)" 
              value={newCatName} 
              onChange={e => setNewCatName(e.target.value)} 
              className="flex-1 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
            <button type="submit" className="px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg">Add</button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800">{cat.name}</span>
                <button onClick={() => removeCategory(cat.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'customers' && (
        <div className="space-y-8">
          <form onSubmit={(e) => { e.preventDefault(); addUser(custName, custId); setCustName(''); setCustId(''); }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1 w-full">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
               <input placeholder="Maria Clara" value={custName} onChange={e => setCustName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-slate-900 font-medium" required />
            </div>
            <div className="flex-1 space-y-1 w-full">
               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Assigned ID</label>
               <input placeholder="CUST-777" value={custId} onChange={e => setCustId(e.target.value.toUpperCase())} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-slate-900 font-mono" required />
            </div>
            <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg w-full sm:w-auto">Create User</button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(u => (
              <div key={u.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    {u.name.charAt(0)}
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${u.role === 'admin' ? 'bg-slate-800 text-slate-300' : 'bg-orange-50 text-orange-600'}`}>
                    {u.role}
                  </span>
                </div>
                <h4 className="font-black text-lg text-slate-800 truncate">{u.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 uppercase mt-1 tracking-widest">{u.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};

export default Admin;
