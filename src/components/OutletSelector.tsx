import React, { useState } from 'react';
import { ChevronDown, Store } from 'lucide-react';
import { useStore } from '../lib/store';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Modal from './Modal';

export default function OutletSelector() {
  const { currentOutlet, setOutlet } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const outlets = useLiveQuery(() => db.outlets.toArray(), []);

  const handleSelect = (outletId: string) => {
    const outlet = outlets?.find((o) => o.id === outletId);
    if (outlet) {
      setOutlet(outlet);
      localStorage.setItem('dukaguard-current-outlet', outletId);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
      >
        <Store className="h-4 w-4" />
        <span className="truncate max-w-[150px]">{currentOutlet?.name || 'Select Outlet'}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Outlet">
        <div className="flex flex-col gap-2">
          {outlets?.map((outlet) => (
            <button
              key={outlet.id}
              onClick={() => handleSelect(outlet.id)}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                currentOutlet?.id === outlet.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Store className="h-5 w-5 shrink-0" />
              <div>
                <div className="font-medium">{outlet.name}</div>
                <div className="text-xs opacity-70">{outlet.address}</div>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
