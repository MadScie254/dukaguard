import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Check } from 'lucide-react';
import { db } from '../lib/db';
import { generateId } from '../lib/utils';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ shopName: '', address: '', name: '', phone: '', pin: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const tenantId = generateId();
    const outletId = generateId();
    const userId = generateId();

    await db.tenants.add({
      id: tenantId,
      name: form.shopName,
      email: '',
      phone: form.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.outlets.add({
      id: outletId,
      tenantId,
      name: form.shopName,
      address: form.address,
      phone: form.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    await db.users.add({
      id: userId,
      tenantId,
      outletIds: [outletId],
      name: form.name,
      email: '',
      phone: form.phone,
      role: 'owner',
      pin: form.pin,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="mx-auto max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold text-white">DukaGuard</h1>
        </div>

        <div className="mb-6 flex gap-2">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-slate-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-4">Tell us about your shop</h2>
            <input className="input mb-3" placeholder="Shop name" value={form.shopName} onChange={e => setForm(f => ({...f, shopName: e.target.value}))} />
            <input className="input mb-3" placeholder="Shop address" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
            <button onClick={() => setStep(2)} className="btn-primary w-full" disabled={!form.shopName || !form.address}>
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-4">Your details</h2>
            <input className="input mb-3" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            <input className="input mb-3" placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1" disabled={!form.name || !form.phone}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-4">Create a 4-digit PIN</h2>
            <input type="password" maxLength={4} className="input mb-3 text-center text-2xl tracking-[0.5em]" placeholder="••••" value={form.pin} onChange={e => setForm(f => ({...f, pin: e.target.value.replace(/\D/g, '').slice(0,4)}))} />
            <button onClick={handleSubmit} className="btn-primary w-full" disabled={form.pin.length !== 4}>
              <Check className="h-4 w-4" /> Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
