import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Users, ChevronRight, LogOut, Shield } from 'lucide-react';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();
  const { language, setLanguage, translate } = useApp();

  const menuItems = [
    { icon: Store, label: translate('settings.outlets'), path: '/settings/outlets' },
    { icon: Users, label: translate('settings.users'), path: '/settings/users' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title mb-4">{translate('nav.settings')}</h1>

      <div className="card mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">{currentUser?.name}</div>
          <div className="text-sm text-slate-500 capitalize">{currentUser?.role}</div>
        </div>
      </div>

      <div className="section-title">Language / Lugha</div>
      <div className="card mb-4 flex gap-2">
        <button onClick={() => setLanguage('en')} className={`flex-1 rounded-xl py-3 text-sm font-medium ${language === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
          English
        </button>
        <button onClick={() => setLanguage('sw')} className={`flex-1 rounded-xl py-3 text-sm font-medium ${language === 'sw' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Kiswahili
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {menuItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)} className="card-hover flex items-center gap-3 text-left">
            <item.icon className="h-5 w-5 text-slate-500" />
            <span className="flex-1 font-medium text-slate-900">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>

      <button onClick={logout} className="btn-danger w-full mt-6">
        <LogOut className="h-4 w-4" /> {translate('auth.logout')}
      </button>

      <div className="mt-8 text-center text-xs text-slate-400">
        DukaGuard v1.0 · Kenya Data Protection Act, 2019 Compliant
      </div>
    </div>
  );
}
