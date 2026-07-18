import { create } from 'zustand';
import type { AppState, User, Tenant, Outlet, Language } from '../types';

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
  currentUser: null,
  currentTenant: null,
  currentOutlet: null,
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
