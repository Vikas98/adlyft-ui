import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Megaphone, BarChart3, CreditCard, AlertTriangle, Info } from 'lucide-react';
import {
  getNotificationsApi,
  getUnreadCountApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from '../../services/api';

const mockNotifications = [
  { _id: 'n1', type: 'campaign', title: 'Campaign Launched', message: 'Your campaign "Summer Sale 2024" is now live.', createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), read: false },
  { _id: 'n2', type: 'budget', title: 'Budget Alert', message: 'Campaign "Brand Awareness Q3" has reached 80% of its budget.', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false },
  { _id: 'n3', type: 'analytics', title: 'Weekly Report Ready', message: 'Your weekly performance report is available.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true },
  { _id: 'n4', type: 'billing', title: 'Invoice Generated', message: 'Invoice INV-2024-004 for ₹71,000 has been generated.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const typeIcon = {
  campaign: <Megaphone className="h-4 w-4 text-primary-600" />,
  budget: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  analytics: <BarChart3 className="h-4 w-4 text-blue-500" />,
  billing: <CreditCard className="h-4 w-4 text-green-600" />,
  info: <Info className="h-4 w-4 text-gray-500" />,
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread count on mount and every 60s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch full list when opened
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCountApi();
      setUnreadCount(res.data?.count ?? 0);
    } catch {
      const count = mockNotifications.filter((n) => !n.read).length;
      setUnreadCount(count);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotificationsApi({ limit: 20 });
      const list = res.data?.data ?? res.data ?? [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
    } catch { /* fallback */ }
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
    } catch { /* fallback */ }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id) => {
    const notification = notifications.find((n) => n._id === id);
    try {
      await deleteNotificationApi(id);
    } catch { /* fallback */ }
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (notification && !notification.read) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const handleItemClick = (notification) => {
    if (!notification.read) handleMarkRead(notification._id);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-gray-400 hover:text-gray-600 transition-colors relative p-1"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Bell className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? 'bg-primary-50/40' : ''}`}
                >
                  <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    {typeIcon[n.type] || typeIcon.info}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-gray-900 ${!n.read ? 'font-semibold' : ''}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(n._id); }}
                        className="text-primary-600 hover:text-primary-700"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
