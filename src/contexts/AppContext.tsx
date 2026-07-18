import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '../types';
import { t } from '../lib/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
  translate: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dukaguard-language');
    return (saved as Language) || 'en';
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dukaguard-language', language);
  }, [language]);

  const translate = (key: string): string => {
    return t(key as any, language);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, isOnline, translate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
