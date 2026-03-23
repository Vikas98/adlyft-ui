import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getMyAds } from '../../services/advertiser.service';

const TABS = ['all', 'pending', 'approved', 'rejected', 'active'];

export default function MyAds() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = tab !== 'all' ? { status: tab } : {};
    getMyAds(params)
      .then((res) => setAds(res.data?.ads || res.data || []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
        <button onClick={() => navigate('/advertiser/ads/create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Ad
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex gap-1 p-4 border-b border-gray-200 flex-wrap">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t}</button>
          ))}
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : ads.length === 0 ? <EmptyState title="No ads found" actionLabel="Create Ad" onAction={() => navigate('/advertiser/ads/create')} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Preview','Title','Campaign','Publisher','Slot','Status','Submitted','Note'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {ads.map((ad) => (
                    <tr key={ad._id || ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {ad.imageUrl ? <img src={ad.imageUrl} alt={ad.title} className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-gray-100 rounded" />}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.campaignName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.publisherName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.slotName || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                      <td className="px-4 py-3 text-gray-600">{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate text-xs">{ad.adminNote || '—'}</td>
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
