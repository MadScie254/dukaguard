import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, CalendarDays, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function BottomNav() {
  const { translate } = useApp();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: translate('nav.dashboard') },
    { path: '/sales', icon: ShoppingCart, label: translate('nav.sales') },
    { path: '/stock', icon: Package, label: translate('nav.stock') },
    { path: '/shifts', icon: CalendarDays, label: translate('nav.shifts') },
    { path: '/settings', icon: Settings, label: translate('nav.settings') },
  ];

  return (
    <nav className="bottom-nav safe-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) =>
              `bottom-nav-item ${active ? 'active' : ''}`
            }
          >
            <item.icon className="h-5 w-5" strokeWidth={isActive(item.path) ? 2.5 : 1.5} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
