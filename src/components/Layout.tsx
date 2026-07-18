import React from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-lg min-h-screen bg-slate-50 relative">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
