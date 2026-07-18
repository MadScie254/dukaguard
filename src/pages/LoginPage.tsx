import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { db } from '../lib/db';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setTenant, setOutlet } = useStore();
  const { translate } = useApp();

  const handleLogin = async () => {
    const user = await db.users.where('pin').equals(pin).first();
    if (user) {
      const tenant = await db.tenants.get(user.tenantId);
      const outlet = await db.outlets.get(user.outletIds[0]);
      setUser(user);
      setTenant(tenant || null);
      setOutlet(outlet || null);
      localStorage.setItem('dukaguard-user', user.id);
      navigate('/');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
          <Shield className="h-8 w-8 text-slate-900" />
        </div>
        <h1 className="text-2xl font-bold text-white">DukaGuard</h1>
        <p className="mt-1 text-sm text-slate-400">{translate('auth.welcomeBack')}</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="mb-6 flex justify-center gap-3">
          {[0,1,2,3].map((i) => (
            <div key={i} className={`h-4 w-4 rounded-full border-2 ${
              i < pin.length ? 'bg-white border-white' : 'border-slate-500'
            }`} />
          ))}
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {keys.map((key, i) => key === '' ? (
            <div key={i} />
          ) : (
            <button
              key={key}
              onClick={() => {
                if (key === '⌫') setPin(p => p.slice(0, -1));
                else if (pin.length < 4) setPin(p => p + key);
                if (pin.length === 3 && key !== '⌫') {
                  setTimeout(() => handleLogin(), 100);
                }
              }}
              className="aspect-square rounded-2xl bg-slate-800 text-xl font-bold text-white transition-all active:scale-95 active:bg-slate-700"
            >
              {key}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo PINs: 1234 (Owner), 5678 (Manager), 9012 (Attendant)
        </p>
      </div>
    </div>
  );
}
