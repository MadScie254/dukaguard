import React, { useState } from 'react';
import { ArrowLeft, Plus, Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStore } from '../lib/store';
import Modal from '../components/Modal';
import { generateId } from '../lib/utils';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', salePrice: '', costPrice: '', category: 'Food', unit: 'pcs' });

  const products = useLiveQuery(() => db.products.toArray(), []);

  const handleAdd = async () => {
    if (!currentUser) return;
    await db.products.add({
      id: generateId(),
      tenantId: currentUser.tenantId,
      sku: newProduct.sku,
      name: newProduct.name,
      category: newProduct.category,
      costPrice: parseFloat(newProduct.costPrice) || 0,
      salePrice: parseFloat(newProduct.salePrice) || 0,
      unit: newProduct.unit,
      reorderLevel: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    setShowAdd(false);
    setNewProduct({ name: '', sku: '', salePrice: '', costPrice: '', category: 'Food', unit: 'pcs' });
  };

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/settings')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">Products</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search products..." className="input pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        {filtered?.map(p => (
          <div key={p.id} className="card flex items-center gap-3">
            <Package className="h-5 w-5 text-slate-400" />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{p.name}</div>
              <div className="text-xs text-slate-500">{p.sku} · KES {p.salePrice}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Product">
        <div className="flex flex-col gap-3">
          <input className="input" placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} />
          <input className="input" placeholder="SKU code" value={newProduct.sku} onChange={e => setNewProduct(p => ({...p, sku: e.target.value}))} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Sale price" type="number" value={newProduct.salePrice} onChange={e => setNewProduct(p => ({...p, salePrice: e.target.value}))} />
            <input className="input" placeholder="Cost price" type="number" value={newProduct.costPrice} onChange={e => setNewProduct(p => ({...p, costPrice: e.target.value}))} />
          </div>
          <button onClick={handleAdd} className="btn-primary w-full">Add Product</button>
        </div>
      </Modal>
    </div>
  );
}
