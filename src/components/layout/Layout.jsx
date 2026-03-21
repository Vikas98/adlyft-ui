import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
