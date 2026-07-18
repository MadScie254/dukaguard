import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, User, AlertTriangle } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDateTime, getVarianceColor } from '../lib/utils';

export default function ShiftsPage() {
  const navigate = useNavigate();
  const { translate } = useApp();

  const shifts = useLiveQuery(() => db.shifts.orderBy('openedAt').reverse().limit(20).toArray(), []);

  const openShift = shifts?.find(s => s.status === 'open');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{translate('nav.shifts')}</h1>
        {!openShift && (
          <button onClick={() => navigate('/shifts/open')} className="btn-primary">
            <Plus className="h-4 w-4" /> {translate('shift.openShift')}
          </button>
        )}
      </div>

      {openShift && (
        <div className="card mb-4 bg-sky-50 border-sky-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-600" />
              <span className="font-semibold text-sky-900">{translate('shift.currentShift')}</span>
            </div>
            <span className="badge badge-info">Open</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <User className="h-3.5 w-3.5" />
            {openShift.attendantName} · {formatDateTime(openShift.openedAt)}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{translate('shift.openingCash')}</div>
              <div className="font-bold text-slate-900">{formatCurrency(openShift.openingCash)}</div>
            </div>
            <button onClick={() => navigate('/shifts/close')} className="btn-danger">
              {translate('shift.closeShift')}
            </button>
          </div>
        </div>
      )}

      <div className="section-title">Recent Shifts</div>
      <div className="flex flex-col gap-3">
        {shifts?.filter(s => s.status === 'closed').map(shift => (
          <div key={shift.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900">{shift.attendantName}</span>
              </div>
              <span className="text-xs text-slate-400">{formatDateTime(shift.openedAt)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-xs text-slate-500">Expected</div>
                <div className="font-medium">{formatCurrency(shift.closingCashExpected)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Actual</div>
                <div className="font-medium">{formatCurrency(shift.closingCashActual || 0)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Variance</div>
                <div className={`font-bold ${getVarianceColor(shift.cashVariance || 0)}`}>
                  {formatCurrency(shift.cashVariance || 0)}
                </div>
              </div>
            </div>
            {(shift.cashVariance || 0) < -100 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Significant variance detected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
