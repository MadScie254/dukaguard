import React from 'react';
import { Shield } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-ring rounded-full bg-dukaguard-500/30" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-2xl">
          <Shield className="h-10 w-10 text-slate-900" />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">DukaGuard</h1>
      <p className="mt-2 text-sm text-slate-400">Know exactly where your money went today</p>
      <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/3 animate-[slide_1s_ease-in-out_infinite] rounded-full bg-dukaguard-400" />
      </div>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
