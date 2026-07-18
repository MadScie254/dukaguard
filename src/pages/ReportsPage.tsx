import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../lib/utils';

export default function ReportsPage() {
  const { translate } = useApp();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const sales = useLiveQuery(() => 
    db.salesTransactions.where('timestamp').above(startDate).toArray(),
  [period]);

  const totalSales = sales?.reduce((s, t) => s + t.totalAmount, 0) || 0;
  const totalCash = sales?.reduce((s, t) => s + t.cashAmount, 0) || 0;
  const totalMpesa = sales?.reduce((s, t) => s + t.mpesaAmount, 0) || 0;

  return (
    <div className="page-container">
      <h1 className="page-title mb-4">{translate('nav.reports')}</h1>

      <div className="flex gap-2 mb-4">
        {(['7d', '30d', '90d'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-xl px-4 py-2 text-sm font-medium ${period === p ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>
            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="stat-card"><span className="stat-label">Total Sales</span><span className="stat-value">{formatCurrency(totalSales)}</span></div>
        <div className="stat-card"><span className="stat-label">Transactions</span><span className="stat-value">{sales?.length || 0}</span></div>
        <div className="stat-card"><span className="stat-label">Cash</span><span className="stat-value">{formatCurrency(totalCash)}</span></div>
        <div className="stat-card"><span className="stat-label">M-Pesa</span><span className="stat-value">{formatCurrency(totalMpesa)}</span></div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-slate-500" />
          <span className="font-semibold text-slate-900">Sales Trend</span>
        </div>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const daySales = sales?.filter(s => {
              const d = new Date(s.timestamp);
              const today = new Date();
              return d.getDate() === today.getDate() - (6 - i);
            }).reduce((s, t) => s + t.totalAmount, 0) || 0;
            const max = Math.max(...Array.from({ length: 7 }).map((_, j) => 
              sales?.filter(s => {
                const d = new Date(s.timestamp);
                const today = new Date();
                return d.getDate() === today.getDate() - (6 - j);
              }).reduce((s, t) => s + t.totalAmount, 0) || 0
            ));
            const height = max > 0 ? (daySales / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-sky-400 rounded-t-lg transition-all" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-slate-400">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
