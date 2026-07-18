import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, ShoppingCart } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';
import StatCard from '../components/StatCard';
import AlertCard from '../components/AlertCard';
import OutletSelector from '../components/OutletSelector';
import { formatCurrency, getToday } from '../lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentOutlet } = useStore();
  const { translate } = useApp();
  const today = getToday();

  const sales = useLiveQuery(() => 
    db.salesTransactions.where('timestamp').between(`${today}T00:00:00Z`, `${today}T23:59:59Z`).toArray(),
  [today]);

  const shifts = useLiveQuery(() => 
    db.shifts.where('status').equals('closed').reverse().limit(7).toArray(),
  []);

  const alerts = useLiveQuery(() => 
    db.alerts.where('status').equals('open').toArray(),
  []);

  const todayStats = {
    totalSales: sales?.reduce((s, t) => s + t.totalAmount, 0) || 0,
    totalCash: sales?.reduce((s, t) => s + t.cashAmount, 0) || 0,
    totalMpesa: sales?.reduce((s, t) => s + t.mpesaAmount, 0) || 0,
    transactions: sales?.length || 0,
  };

  const latestShift = shifts?.[0];
  const cashVariance = latestShift?.cashVariance || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{translate('nav.dashboard')}</h1>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <OutletSelector />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/sales/new')} className="btn-primary btn-lg">
          <Plus className="h-5 w-5" /> {translate('sales.newSale')}
        </button>
        <button onClick={() => navigate('/shifts/open')} className="btn-secondary btn-lg">
          <ShoppingCart className="h-5 w-5" /> {translate('shift.openShift')}
        </button>
      </div>

      <div className="section-title">{translate('dashboard.todaySales')}</div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatCard label={translate('dashboard.todaySales')} value={todayStats.totalSales} trend="up" trendValue="+12%" />
        <StatCard label={translate('dashboard.transactions')} value={todayStats.transactions} currency={false} />
        <StatCard label={translate('dashboard.todayCash')} value={todayStats.totalCash} />
        <StatCard label={translate('dashboard.todayMpesa')} value={todayStats.totalMpesa} />
      </div>

      {cashVariance !== 0 && (
        <div className={`mb-4 rounded-2xl p-4 ${cashVariance < 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={`h-4 w-4 ${cashVariance < 0 ? 'text-red-600' : 'text-green-600'}`} />
            <span className="text-sm font-semibold text-slate-700">{translate('shift.closingCash')}</span>
          </div>
          <div className={`text-2xl font-bold ${cashVariance < 0 ? 'text-red-700' : 'text-green-700'}`}>
            {formatCurrency(cashVariance)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Last shift: {latestShift?.attendantName}</p>
        </div>
      )}

      {alerts && alerts.length > 0 && (
        <>
          <div className="section-title flex items-center gap-2">
            {translate('alerts.title')}
            <span className="badge badge-danger">{alerts.length}</span>
          </div>
          <div className="mb-4 flex flex-col gap-3">
            {alerts.slice(0, 2).map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {alerts.length > 2 && (
              <button onClick={() => navigate('/alerts')} className="text-sm text-sky-600 font-medium text-center py-2">
                View all {alerts.length} alerts →
              </button>
            )}
          </div>
        </>
      )}

      <div className="section-title">{translate('dashboard.weeklyTrend')}</div>
      <div className="card">
        {shifts && shifts.length > 0 ? (
          <div className="flex items-end gap-2 h-32">
            {shifts.reverse().map((shift) => {
              const max = Math.max(...shifts.map(s => s.closingCashExpected || 0));
              const height = max > 0 ? ((shift.closingCashExpected || 0) / max) * 100 : 0;
              return (
                <div key={shift.id} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full rounded-t-lg ${(shift.cashVariance || 0) < -100 ? 'bg-red-400' : 'bg-sky-400'}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[10px] text-slate-400">
                    {new Date(shift.openedAt).toLocaleDateString('en-KE', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">{translate('dashboard.noData')}</div>
        )}
      </div>
    </div>
  );
}
