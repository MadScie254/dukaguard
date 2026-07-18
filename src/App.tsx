import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { db, seedDemoData } from './lib/db';
import { useStore } from './lib/store';
import { useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import StockPage from './pages/StockPage';
import ShiftsPage from './pages/ShiftsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProductsPage from './pages/ProductsPage';
import OutletsPage from './pages/OutletsPage';
import UsersPage from './pages/UsersPage';
import NewSalePage from './pages/NewSalePage';
import ShiftOpenPage from './pages/ShiftOpenPage';
import ShiftClosePage from './pages/ShiftClosePage';
import MpesaImportPage from './pages/MpesaImportPage';
import AlertsPage from './pages/AlertsPage';
import OnboardingPage from './pages/OnboardingPage';
import SplashScreen from './components/SplashScreen';
import SyncIndicator from './components/SyncIndicator';

function App() {
  const { currentUser } = useStore();
  const { isOnline } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await seedDemoData();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SyncIndicator />
      <Routes>
        <Route path="/login" element={
          currentUser ? <Navigate to="/" /> : <LoginPage />
        } />
        <Route path="/onboarding" element={
          currentUser ? <Navigate to="/" /> : <OnboardingPage />
        } />
        <Route path="/*" element={
          currentUser ? (
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/sales/new" element={<NewSalePage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/shifts/open" element={<ShiftOpenPage />} />
                <Route path="/shifts/close" element={<ShiftClosePage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/products" element={<ProductsPage />} />
                <Route path="/settings/outlets" element={<OutletsPage />} />
                <Route path="/settings/users" element={<UsersPage />} />
                <Route path="/mpesa" element={<MpesaImportPage />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </div>
  );
}

export default App;
