import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ShieldCheck, Grid2X2, Megaphone,
  UserCog, BarChart2, LogOut, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/publishers', label: 'Publishers', icon: Users },
  { path: '/admin/advertisers', label: 'Advertisers', icon: Building2 },
  { path: '/admin/ad-approvals', label: 'Ad Approvals', icon: ShieldCheck },
  { path: '/admin/slots', label: 'All Slots', icon: Grid2X2 },
  { path: '/admin/campaigns', label: 'All Campaigns', icon: Megaphone },
  { path: '/admin/users', label: 'Users', icon: UserCog },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-800">
          <span className="text-xl font-bold tracking-wide">Adlyft Admin</span>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item)
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-800">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name || 'Admin'}</span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
