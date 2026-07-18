import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, AlertTriangle, Search } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import { useStore } from '../lib/store';
import Modal from '../components/Modal';
import NumericInput from '../components/NumericInput';
import { generateId, getCurrentTimestamp } from '../lib/utils';

export default function StockPage() {
  const navigate = useNavigate();
  const { translate } = useApp();
  const { currentOutlet, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'adjust' | 'waste' | null>(null);
  const [quantity, setQuantity] = useState(0);

  const products = useLiveQuery(() => db.products.toArray(), []);

  const stockLevels = useLiveQuery(async () => {
    if (!products) return {};
    const levels: Record<string, number> = {};
    for (const p of products) {
      const movements = await db.stockMovements.where('productId').equals(p.id).toArray();
      levels[p.id] = movements.reduce((s, m) => s + m.quantity, 0);
    }
    return levels;
  }, [products]);

  const filtered = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockAction = async () => {
    if (!selectedProduct || !currentOutlet || !currentUser || !modalMode) return;

    const delta = modalMode === 'add' ? quantity : -quantity;
    await db.stockMovements.add({
      id: generateId(),
      productId: selectedProduct.id,
      outletId: currentOutlet.id,
      quantity: delta,
      type: modalMode === 'add' ? 'restock' : modalMode === 'waste' ? 'waste' : 'adjustment',
      reason: modalMode,
      loggedBy: currentUser.id,
      timestamp: getCurrentTimestamp(),
      synced: false,
    });

    setSelectedProduct(null);
    setModalMode(null);
    setQuantity(0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{translate('nav.stock')}</h1>
        <button onClick={() => navigate('/settings/products')} className="btn-primary">
          <Plus className="h-4 w-4" /> Products
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search stock..." className="input pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {products?.filter(p => (stockLevels?.[p.id] || 0) <= p.reorderLevel).length > 0 && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800 font-medium">
            {products.filter(p => (stockLevels?.[p.id] || 0) <= p.reorderLevel).length} items below reorder level
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filtered?.map(product => {
          const stock = stockLevels?.[product.id] || 0;
          const isLow = stock <= product.reorderLevel;
          return (
            <div key={product.id} className={`card flex items-center gap-3 ${isLow ? 'border-amber-200 bg-amber-50' : ''}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isLow ? 'bg-amber-100' : 'bg-slate-100'}`}>
                <Package className={`h-5 w-5 ${isLow ? 'text-amber-600' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900">{product.name}</div>
                <div className="text-xs text-slate-500">{product.sku} · KES {product.salePrice}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>{stock}</div>
                <div className="text-xs text-slate-400">{product.unit}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setSelectedProduct(product); setModalMode('add'); }} className="rounded-lg bg-green-100 p-2 text-green-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'add' ? 'Add Stock' : modalMode === 'waste' ? 'Mark Waste' : 'Adjust Stock'}>
        <NumericInput value={quantity} onChange={setQuantity} label="Quantity" currency="" allowDecimal={false} />
        <button onClick={handleStockAction} className="btn-primary w-full mt-4">
          Confirm
        </button>
      </Modal>
    </div>
  );
}
