import React from 'react';
import { ArrowLeft, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function UsersPage() {
  const navigate = useNavigate();
  const users = useLiveQuery(() => db.users.toArray(), []);

  const roleColors: Record<string, string> = {
    owner: 'bg-slate-900 text-white',
    manager: 'bg-sky-100 text-sky-800',
    attendant: 'bg-green-100 text-green-800',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/settings')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">Users</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col gap-2">
        {users?.map(user => (
          <div key={user.id} className="card flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Phone className="h-3 w-3" /> {user.phone}
              </div>
            </div>
            <span className={`badge ${roleColors[user.role] || 'bg-slate-100 text-slate-800'}`}>
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
