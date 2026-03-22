import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Building2, BarChart3, CreditCard, Settings, LogOut, Zap, Users, Layout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAV_ITEMS, PORTAL_NAMES } from '../../utils/constants';

const icons = { LayoutDashboard, Megaphone, Building2, BarChart3, CreditCard, Settings, Users, Layout };

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'advertiser';
  const navItems = ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS.advertiser;
  const portalName = PORTAL_NAMES[role] || 'Advertiser Portal';

  return (
    <div className="w-64 min-h-screen bg-primary-950 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">Adlyft</span>
            <p className="text-primary-400 text-xs">{portalName}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = icons[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                }`
              }
            >
              {Icon && <Icon className="h-5 w-5" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-primary-800">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-primary-400 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
