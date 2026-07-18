import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import NumericInput from '../components/NumericInput';
import { getCurrentTimestamp } from '../lib/utils';

export default function ShiftClosePage() {
  const navigate = useNavigate();
  const { translate } = useApp();
  const [actualCash, setActualCash] = useState(0);

  const openShift = useLiveQuery(() => db.shifts.where('status').equals('open').first(), []);

  const handleClose = async () => {
    if (!openShift) return;
    const expected = openShift.closingCashExpected;
    await db.shifts.update(openShift.id, {
      closedAt: getCurrentTimestamp(),
      closingCashActual: actualCash,
      cashVariance: actualCash - expected,
      status: 'closed',
      synced: false,
    });
    navigate('/shifts');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/shifts')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">{translate('shift.closeShift')}</h1>
        <div className="w-10" />
      </div>

      <div className="card mb-4 bg-slate-50">
        <div className="text-sm text-slate-500 mb-1">{translate('shift.expectedCash')}</div>
        <div className="text-2xl font-bold text-slate-900">KES {openShift?.closingCashExpected.toLocaleString() || '0'}</div>
      </div>

      <NumericInput value={actualCash} onChange={setActualCash} label={translate('shift.actualCash')} />

      <button onClick={handleClose} className="btn-primary w-full mt-6 btn-lg">
        <CheckCircle className="h-5 w-5" /> {translate('shift.endShift')}
      </button>
    </div>
  );
}
