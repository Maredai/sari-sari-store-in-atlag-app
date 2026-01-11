
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Product } from '../types';

const Menu: React.FC = () => {
  const { products, categories, addToCart, formatCurrency } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [products, search, selectedCategory, sortOrder]);

  return (
    <div className="p-6 pb-20 space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-900">Today's Selection</h2>
        
        {/* Search Bar */}
        <div className="relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categories</span>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              <svg className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 border border-slate-100'}`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 border border-slate-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredAndSortedProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-slate-50 flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={product.imageUrl} className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`} alt={product.name} />
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <span className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg transform -rotate-12">Out of Stock</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                     <span className="bg-white/80 backdrop-blur-md text-[8px] font-black uppercase text-slate-600 px-2 py-1 rounded-lg">
                        {categories.find(c => c.id === product.categoryId)?.name || 'General'}
                     </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-slate-800">{product.name}</h3>
                    <span className="text-orange-600 font-bold text-lg">{formatCurrency(product.price)}</span>
                  </div>
                  <button 
                    disabled={isOutOfStock}
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isOutOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                    }`}
                  >
                    {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-medium italic">No items found matching your filters.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-video">
              <img src={selectedProduct.imageUrl} className={`w-full h-full object-cover ${selectedProduct.stock <= 0 ? 'grayscale' : ''}`} alt="" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{selectedProduct.name}</h2>
                  <p className="text-xs font-bold text-orange-600/60 uppercase tracking-widest mt-1">
                    {categories.find(c => c.id === selectedProduct.categoryId)?.name || 'Uncategorized'}
                  </p>
                </div>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedProduct.price)}</p>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {selectedProduct.description || "Freshly prepared house specialty. Made with premium ingredients and artisanal craftsmanship."}
              </p>
              <button 
                disabled={selectedProduct.stock <= 0}
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${selectedProduct.stock > 0 ? 'bg-orange-600 text-white shadow-orange-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
