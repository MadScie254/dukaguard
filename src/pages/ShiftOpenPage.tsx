import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { db } from '../lib/db';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';
import NumericInput from '../components/NumericInput';
import { generateId, getCurrentTimestamp } from '../lib/utils';

export default function ShiftOpenPage() {
  const navigate = useNavigate();
  const { currentOutlet, currentUser } = useStore();
  const { translate } = useApp();
  const [openingCash, setOpeningCash] = useState(0);

  const handleOpen = async () => {
    if (!currentOutlet || !currentUser) return;
    await db.shifts.add({
      id: generateId(),
      outletId: currentOutlet.id,
      attendantId: currentUser.id,
      attendantName: currentUser.name,
      openedAt: getCurrentTimestamp(),
      openingCash,
      closingCashExpected: 0,
      status: 'open',
      synced: false,
    });
    navigate('/shifts');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/shifts')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">{translate('shift.openShift')}</h1>
        <div className="w-10" />
      </div>
      <NumericInput value={openingCash} onChange={setOpeningCash} label={translate('shift.openingCash')} />
      <button onClick={handleOpen} className="btn-primary w-full mt-6 btn-lg">
        <Play className="h-5 w-5" /> {translate('shift.startShift')}
      </button>
    </div>
  );
}
