import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Receipt, Clock } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatTime } from '../lib/utils';

export default function SalesPage() {
  const navigate = useNavigate();
  const { translate } = useApp();

  const sales = useLiveQuery(() => 
    db.salesTransactions.orderBy('timestamp').reverse().limit(50).toArray(),
  []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{translate('nav.sales')}</h1>
        <button onClick={() => navigate('/sales/new')} className="btn-primary">
          <Plus className="h-4 w-4" /> {translate('sales.newSale')}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sales?.map(sale => (
          <div key={sale.id} className="card-hover flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sale.paymentMethod === 'mpesa' ? 'bg-sky-100' : 'bg-green-100'}`}>
              <Receipt className={`h-5 w-5 ${sale.paymentMethod === 'mpesa' ? 'text-sky-600' : 'text-green-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{formatCurrency(sale.totalAmount)}</span>
                <span className={`badge ${sale.paymentMethod === 'mpesa' ? 'badge-info' : 'badge-success'}`}>
                  {sale.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatTime(sale.timestamp)} · {sale.items.length} items
              </div>
            </div>
          </div>
        ))}
        {(!sales || sales.length === 0) && (
          <div className="text-center py-12 text-slate-400">No sales yet</div>
        )}
      </div>
    </div>
  );
}
