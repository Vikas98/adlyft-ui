import React, { useState, useEffect } from 'react';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getUsers, blockUser, unblockUser } from '../../services/admin.service';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = search ? { search } : {};
    getUsers(params)
      .then((res) => setUsers(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleBlock = async (id) => { await blockUser(id).catch(() => {}); fetchUsers(); };
  const handleUnblock = async (id) => { await unblockUser(id).catch(() => {}); fetchUsers(); };

  const roleBadge = (role) => {
    const colors = { admin: 'bg-purple-100 text-purple-800', publisher: 'bg-emerald-100 text-emerald-800', advertiser: 'bg-blue-100 text-blue-800' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[role] || 'bg-gray-100 text-gray-600'}`}>{role}</span>;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">All Users</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none w-56" />
          </div>
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : users.length === 0 ? <EmptyState title="No users found" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Name','Email','Role','Status','Created','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">{roleBadge(u.role)}</td>
                      <td className="px-4 py-3"><StatusBadge status={u.status || 'active'} /></td>
                      <td className="px-4 py-3 text-gray-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        {u.status === 'blocked'
                          ? <button onClick={() => handleUnblock(u._id || u.id)} className="text-gray-400 hover:text-green-600" title="Unblock"><ShieldCheck className="w-4 h-4" /></button>
                          : <button onClick={() => handleBlock(u._id || u.id)} className="text-gray-400 hover:text-red-600" title="Block"><ShieldOff className="w-4 h-4" /></button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
