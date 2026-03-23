import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getAllCampaigns } from '../../services/admin.service';

const STATUSES = ['all', 'active', 'paused', 'draft', 'completed'];

export default function AllCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = status !== 'all' ? { status } : {};
    getAllCampaigns(params)
      .then((res) => setCampaigns(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Campaigns</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex gap-1 p-4 border-b border-gray-200 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${status === s ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{s}</button>
          ))}
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : campaigns.length === 0 ? <EmptyState title="No campaigns found" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Advertiser','Campaign','Budget','Spent','Status','Start','End'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((c) => (
                    <tr key={c._id || c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{c.advertiserName || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">${c.budget?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600">${c.spent?.toLocaleString() ?? '0'}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-gray-600">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}</td>
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
