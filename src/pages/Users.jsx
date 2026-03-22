import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Shield, UserCheck, Building2 } from 'lucide-react';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import api from '../services/api';

const mockUsers = [
  { _id: 'u1', name: 'Admin User', email: 'admin@adlyft.com', role: 'admin', company: 'Adlyft', createdAt: '2024-01-01T00:00:00Z' },
  { _id: 'u2', name: 'Demo Advertiser', email: 'demo@adlyft.com', role: 'advertiser', company: 'Demo Corp', createdAt: '2024-02-15T00:00:00Z' },
  { _id: 'u3', name: 'Metro Publisher', email: 'metro@adlyft.com', role: 'publisher', company: 'MetroGo', createdAt: '2024-03-01T00:00:00Z' },
  { _id: 'u4', name: 'GameZone Pub', email: 'games@adlyft.com', role: 'publisher', company: 'GameZone', createdAt: '2024-03-10T00:00:00Z' },
  { _id: 'u5', name: 'Brand X', email: 'brandx@adlyft.com', role: 'advertiser', company: 'Brand X Inc', createdAt: '2024-04-01T00:00:00Z' },
];

const roleIcons = { admin: Shield, advertiser: UserCheck, publisher: Building2 };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        const data = res.data?.data ?? res.data ?? [];
        setUsers(Array.isArray(data) ? data : []);
        setIsDemo(false);
      } catch {
        setUsers(mockUsers);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.company?.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-600 text-sm">⚠️</span>
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock user data.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { role: 'admin', label: 'Admins', icon: Shield, bgClass: 'bg-purple-100', textClass: 'text-purple-600' },
          { role: 'advertiser', label: 'Advertisers', icon: UserCheck, bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
          { role: 'publisher', label: 'Publishers', icon: Building2, bgClass: 'bg-green-100', textClass: 'text-green-600' },
        ].map(({ role, label, icon: Icon, bgClass, textClass }) => (
          <Card key={role} className="flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgClass}`}>
              <Icon className={`h-5 w-5 ${textClass}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleCounts[role] || 0}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Search users by name, email or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => {
              const RoleIcon = roleIcons[u.role] || UsersIcon;
              return (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{u.name?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.company || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge color={ROLE_COLORS[u.role] || 'gray'}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {ROLE_LABELS[u.role] || u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
