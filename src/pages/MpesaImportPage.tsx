import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateId, getCurrentTimestamp } from '../lib/utils';

export default function MpesaImportPage() {
  const navigate = useNavigate();
  const { translate } = useApp();
  const { currentOutlet } = useStore();
  const [imported, setImported] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentOutlet) return;

    const mockEntries = [
      { id: 'TXN001', amount: 1500, phone: '254712345678', type: 'incoming' as const, description: 'Sale payment' },
      { id: 'TXN002', amount: 2200, phone: '254723456789', type: 'incoming' as const, description: 'Sale payment' },
      { id: 'TXN003', amount: 800, phone: '254734567890', type: 'incoming' as const, description: 'Sale payment' },
    ];

    for (const entry of mockEntries) {
      await db.mpesaEntries.add({
        id: generateId(),
        outletId: currentOutlet.id,
        transactionId: entry.id,
        phoneNumber: entry.phone,
        amount: entry.amount,
        type: entry.type,
        timestamp: getCurrentTimestamp(),
        description: entry.description,
        synced: false,
      });
    }
    setImported(true);
  };

  const entries = useLiveQuery(() => db.mpesaEntries.toArray(), []);

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">{translate('mpesa.import')}</h1>
        <div className="w-10" />
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Upload className="h-8 w-8 text-sky-500" />
          <div>
            <div className="font-semibold text-slate-900">Upload M-Pesa Statement</div>
            <div className="text-sm text-slate-500">CSV or PDF format</div>
          </div>
        </div>
        <label className="btn-secondary w-full cursor-pointer">
          <Upload className="h-4 w-4" /> Choose File
          <input type="file" accept=".csv,.pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {entries && entries.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="section-title">{translate('mpesa.statement')}</div>
          {entries.map(entry => (
            <div key={entry.id} className="card flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${entry.matchedTransactionId ? 'bg-green-100' : 'bg-slate-100'}`}>
                {entry.matchedTransactionId ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">KES {entry.amount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{entry.phoneNumber}</div>
              </div>
              <span className={`badge ${entry.matchedTransactionId ? 'badge-success' : 'badge-warning'}`}>
                {entry.matchedTransactionId ? 'Matched' : 'Unmatched'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
