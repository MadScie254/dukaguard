import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '../contexts/AppContext';
import AlertCard from '../components/AlertCard';

export default function AlertsPage() {
  const navigate = useNavigate();
  const { translate } = useApp();

  const alerts = useLiveQuery(() => db.alerts.orderBy('generatedAt').reverse().toArray(), []);

  const handleDismiss = async (id: string) => {
    await db.alerts.update(id, { status: 'dismissed' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">{translate('alerts.title')}</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col gap-3">
        {alerts?.filter(a => a.status === 'open').map(alert => (
          <AlertCard key={alert.id} alert={alert} onDismiss={() => handleDismiss(alert.id)} />
        ))}
        {(!alerts || alerts.filter(a => a.status === 'open').length === 0) && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">{translate('alerts.noAlerts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
