import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import Badge from '../common/Badge';
import { ROLE_LABELS, ROLE_COLORS } from '../../utils/constants';

export default function Header({ title }) {
  const { user } = useAuth();
  const roleLabel = ROLE_LABELS[user?.role] || 'Advertiser';
  const roleColor = ROLE_COLORS[user?.role] || 'blue';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 leading-tight">{user?.name || 'User'}</span>
            <Badge color={roleColor} className="text-[10px] py-0 px-1.5 mt-0.5">{roleLabel}</Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
