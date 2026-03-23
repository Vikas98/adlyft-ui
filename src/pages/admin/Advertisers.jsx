import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Ban } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getAdvertisers, blockAdvertiser } from '../../services/admin.service';

export default function AdminAdvertisers() {
  const navigate = useNavigate();
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAdvertisers = () => {
    setLoading(true);
    const params = search ? { search } : {};
    getAdvertisers(params)
      .then((res) => setAdvertisers(res.data?.advertisers || res.data || []))
      .catch(() => setAdvertisers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdvertisers(); }, [search]);

  const handleBlock = async (id) => {
    await blockAdvertiser(id).catch(() => {});
    fetchAdvertisers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Advertisers</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">All Advertisers</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56" />
          </div>
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : advertisers.length === 0 ? <EmptyState title="No advertisers found" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Name','Email','Company','Campaigns','Ads','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {advertisers.map((a) => (
                    <tr key={a._id || a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                      <td className="px-4 py-3 text-gray-600">{a.email}</td>
                      <td className="px-4 py-3 text-gray-600">{a.company || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.campaignsCount ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.adsCount ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status || 'active'} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/admin/advertisers/${a._id || a.id}`)} className="text-gray-400 hover:text-indigo-600" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleBlock(a._id || a.id)} className="text-gray-400 hover:text-orange-600" title="Block"><Ban className="w-4 h-4" /></button>
                        </div>
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
