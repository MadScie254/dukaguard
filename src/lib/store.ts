import { create } from 'zustand';
import type { AppState, User, Tenant, Outlet, Language } from '../types';

const demoTenant: Tenant = {
  id: 'tenant-1',
  name: 'Mama Duka Enterprises',
  email: 'owner@mamaduka.co.ke',
  phone: '+254712345678',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const demoOutlet: Outlet = {
  id: 'outlet-1',
  tenantId: 'tenant-1',
  name: 'Mama Duka - Main Shop',
  address: 'Kibera Market, Nairobi',
  phone: '+254712345678',
  isActive: true,
  createdAt: new Date().toISOString(),
};

const demoUser: User = {
  id: 'user-1',
  tenantId: 'tenant-1',
  outletIds: ['outlet-1', 'outlet-2'],
  name: 'Jane Wanjiku',
  email: 'owner@mamaduka.co.ke',
  phone: '+254712345678',
  role: 'owner',
  pin: '1234',
  isActive: true,
  createdAt: new Date().toISOString(),
};

function getStoredSession(): Pick<AppState, 'currentUser' | 'currentTenant' | 'currentOutlet'> {
  localStorage.setItem('dukaguard-user', demoUser.id);
  localStorage.setItem('dukaguard-current-outlet', demoOutlet.id);

  return {
    currentUser: demoUser,
    currentTenant: demoTenant,
    currentOutlet: demoOutlet,
  };
}

interface StoreState extends AppState {
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  setOutlet: (outlet: Outlet | null) => void;
  setLanguage: (lang: Language) => void;
  setOnline: (online: boolean) => void;
  setSyncStatus: (status: AppState['syncStatus']) => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  ...getStoredSession(),
  language: 'en',
  isOnline: navigator.onLine,
  syncStatus: 'idle',

  setUser: (user) => set({ currentUser: user }),
  setTenant: (tenant) => set({ currentTenant: tenant }),
  setOutlet: (outlet) => set({ currentOutlet: outlet }),
  setLanguage: (lang) => set({ language: lang }),
  setOnline: (online) => set({ isOnline: online }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  logout: () => set({ 
    currentUser: null, 
    currentTenant: null, 
    currentOutlet: null 
  }),
}));
