import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Pause, Play, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getMyCampaigns, deleteCampaign, pauseCampaign, resumeCampaign } from '../../services/advertiser.service';

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = () => {
    setLoading(true);
    getMyCampaigns()
      .then((res) => setCampaigns(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    await deleteCampaign(id).catch(() => {});
    fetchCampaigns();
  };

  const handlePause = async (id) => { await pauseCampaign(id).catch(() => {}); fetchCampaigns(); };
  const handleResume = async (id) => { await resumeCampaign(id).catch(() => {}); fetchCampaigns(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <button onClick={() => navigate('/advertiser/campaigns/create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        : campaigns.length === 0 ? <EmptyState title="No campaigns yet" description="Create your first campaign to start advertising." actionLabel="Create Campaign" onAction={() => navigate('/advertiser/campaigns/create')} />
        : (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Name','Budget','Spent','Status','Start','End','Ads','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((c) => (
                    <tr key={c._id || c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">${c.budget?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600">${c.spent?.toLocaleString() ?? '0'}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-gray-600">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{c.adsCount ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/advertiser/campaigns/${c._id || c.id}`)} className="text-gray-400 hover:text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => navigate(`/advertiser/campaigns/${c._id || c.id}/edit`)} className="text-gray-400 hover:text-blue-600" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          {c.status === 'active' ? <button onClick={() => handlePause(c._id || c.id)} className="text-gray-400 hover:text-orange-600" title="Pause"><Pause className="w-4 h-4" /></button>
                            : <button onClick={() => handleResume(c._id || c.id)} className="text-gray-400 hover:text-green-600" title="Resume"><Play className="w-4 h-4" /></button>}
                          <button onClick={() => handleDelete(c._id || c.id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
