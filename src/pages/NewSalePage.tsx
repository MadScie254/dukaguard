import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Check } from 'lucide-react';
import { db } from '../lib/db';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';
import ProductSelector from '../components/ProductSelector';
import NumericInput from '../components/NumericInput';
import { generateId, getCurrentTimestamp } from '../lib/utils';
import type { SaleItem } from '../types';

export default function NewSalePage() {
  const navigate = useNavigate();
  const { currentOutlet, currentUser } = useStore();
  const { translate } = useApp();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'mixed'>('cash');
  const [cashAmount, setCashAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const total = items.reduce((s, i) => s + i.total, 0);

  const addItem = (product: { id: string; name: string; salePrice: number }, qty: number) => {
    const existing = items.find(i => i.productId === product.id);
    if (existing) {
      setItems(items.map(i => i.productId === product.id ? {
        ...i, quantity: i.quantity + qty, total: (i.quantity + qty) * i.unitPrice
      } : i));
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.salePrice,
        total: qty * product.salePrice,
      }]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const completeSale = async () => {
    if (!currentOutlet || !currentUser || items.length === 0) return;

    const sale = {
      id: generateId(),
      outletId: currentOutlet.id,
      items,
      paymentMethod,
      cashAmount: paymentMethod === 'mpesa' ? 0 : paymentMethod === 'mixed' ? cashAmount : total,
      mpesaAmount: paymentMethod === 'cash' ? 0 : paymentMethod === 'mixed' ? total - cashAmount : total,
      totalAmount: total,
      shiftId: 'current-shift',
      loggedBy: currentUser.id,
      timestamp: getCurrentTimestamp(),
      synced: false,
    };

    await db.salesTransactions.add(sale);
    await db.addToSyncQueue('salesTransactions', 'create', sale);

    for (const item of items) {
      await db.stockMovements.add({
        id: generateId(),
        productId: item.productId,
        outletId: currentOutlet.id,
        quantity: -item.quantity,
        type: 'sale',
        loggedBy: currentUser.id,
        timestamp: getCurrentTimestamp(),
        synced: false,
      });
    }

    navigate('/sales');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/sales')} className="btn-ghost">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title">{translate('sales.newSale')}</h1>
        <div className="w-10" />
      </div>

      {items.length > 0 && (
        <div className="card mb-4 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900">{translate('sales.items')} ({items.length})</span>
            <span className="text-xl font-bold text-slate-900">KES {total.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item.quantity}x {item.productName}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">KES {item.total.toLocaleString()}</span>
                  <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showPayment ? (
        <ProductSelector onSelect={addItem} selectedItems={items.map(i => ({ productId: i.productId, quantity: i.quantity }))} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="text-sm font-medium text-slate-500 mb-3">Payment Method</div>
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'mpesa', 'mixed'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-xl py-3 text-sm font-medium capitalize transition-colors ${paymentMethod === method ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'mixed' && (
            <NumericInput
              label="Cash Amount"
              value={cashAmount}
              onChange={setCashAmount}
              currency="KES"
            />
          )}

          <div className="card bg-slate-50">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-xl">KES {total.toLocaleString()}</span>
            </div>
            {paymentMethod === 'mixed' && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">M-Pesa</span>
                <span className="font-medium">KES {(total - cashAmount).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-20 left-0 right-0 px-4 flex gap-3 max-w-lg mx-auto">
        {items.length > 0 && !showPayment && (
          <button onClick={() => setShowPayment(true)} className="btn-primary flex-1 btn-lg">
            <ShoppingCart className="h-5 w-5" /> KES {total.toLocaleString()} →
          </button>
        )}
        {showPayment && (
          <>
            <button onClick={() => setShowPayment(false)} className="btn-secondary flex-1">Back</button>
            <button onClick={completeSale} className="btn-primary flex-1">
              <Check className="h-5 w-5" /> Complete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
