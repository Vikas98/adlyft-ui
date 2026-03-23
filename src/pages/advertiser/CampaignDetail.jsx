import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getCampaign } from '../../services/advertiser.service';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaign(id)
      .then((res) => setData(res.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Campaign not found</div>;

  const campaign = data.campaign || data;
  const ads = data.ads || [];
  const analytics = data.analytics || {};

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{campaign.name}</h1>
            {campaign.description && <p className="text-gray-500 mt-1">{campaign.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={campaign.status} />
            <button onClick={() => navigate(`/advertiser/campaigns/${id}/edit`)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Budget</p>
            <p className="font-semibold text-gray-900">${campaign.budget?.toLocaleString() ?? '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Spent</p>
            <p className="font-semibold text-gray-900">${(campaign.spent ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Impressions</p>
            <p className="font-semibold text-gray-900">{(analytics.impressions ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Clicks</p>
            <p className="font-semibold text-gray-900">{(analytics.clicks ?? 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Ads in this Campaign ({ads.length})</h2>
        {ads.length === 0 ? <p className="text-sm text-gray-500">No ads in this campaign yet.</p> : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <div key={ad._id || ad.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-16 h-10 object-cover rounded" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                  <p className="text-xs text-gray-500">{ad.publisherName} · {ad.slotName}</p>
                </div>
                <StatusBadge status={ad.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
