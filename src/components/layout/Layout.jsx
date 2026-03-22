import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorBoundary from '../common/ErrorBoundary';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/create': 'Create Campaign',
  '/publishers': 'Publishers',
  '/analytics': 'Analytics',
  '/billing': 'Billing',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Adlyft';
  const isOnline = useNetworkStatus();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={title} />
        {!isOnline && (
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2 text-sm">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            <span>You are offline. Some features may not work.</span>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
