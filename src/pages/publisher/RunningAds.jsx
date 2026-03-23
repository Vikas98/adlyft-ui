import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getRunningAds } from '../../services/publisher.service';

const TABS = ['all', 'active', 'pending', 'rejected'];

export default function RunningAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    setLoading(true);
    getRunningAds()
      .then((res) => setAds(res.data?.ads || res.data || []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? ads : ads.filter((a) => a.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Running Ads</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex gap-1 p-4 border-b border-gray-200 flex-wrap">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t}</button>
          ))}
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : filtered.length === 0 ? <EmptyState title="No ads found" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Preview','Title','Advertiser','Slot','Status','Destination','Start Date'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((ad) => (
                    <tr key={ad._id || ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {ad.imageUrl ? <img src={ad.imageUrl} alt={ad.title} className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-gray-100 rounded" />}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.advertiserName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.slotName || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{ad.destinationUrl}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '—'}</td>
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
