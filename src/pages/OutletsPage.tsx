import React from 'react';
import { ArrowLeft, Store, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function OutletsPage() {
  const navigate = useNavigate();
  const outlets = useLiveQuery(() => db.outlets.toArray(), []);

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/settings')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">Outlets</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col gap-2">
        {outlets?.map(outlet => (
          <div key={outlet.id} className="card flex items-center gap-3">
            <Store className="h-5 w-5 text-slate-400" />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{outlet.name}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" /> {outlet.address}
              </div>
            </div>
            <span className={`badge ${outlet.isActive ? 'badge-success' : 'badge-danger'}`}>
              {outlet.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
