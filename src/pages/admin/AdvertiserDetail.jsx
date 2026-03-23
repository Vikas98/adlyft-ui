import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdvertiser } from '../../services/admin.service';

export default function AdvertiserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdvertiser(id)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Advertiser not found</div>;

  const advertiser = data.advertiser || data;
  const campaigns = data.campaigns || [];
  const ads = data.ads || [];

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{advertiser.name}</h1>
        <p className="text-gray-500">{advertiser.email}</p>
        {advertiser.company && <p className="text-sm text-gray-600 mt-1">Company: {advertiser.company}</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Campaigns ({campaigns.length})</h2>
        {campaigns.length === 0 ? <p className="text-sm text-gray-500">No campaigns yet</p> : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <div key={c._id || c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-800">{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Ads ({ads.length})</h2>
        {ads.length === 0 ? <p className="text-sm text-gray-500">No ads yet</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Title','Publisher','Slot','Status'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad) => (
                  <tr key={ad._id || ad.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{ad.title}</td>
                    <td className="px-4 py-2">{ad.publisherName || '—'}</td>
                    <td className="px-4 py-2">{ad.slotName || '—'}</td>
                    <td className="px-4 py-2"><StatusBadge status={ad.status} /></td>
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
