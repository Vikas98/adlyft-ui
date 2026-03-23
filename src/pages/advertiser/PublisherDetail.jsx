import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPublisher } from '../../services/advertiser.service';

export default function AdvertiserPublisherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublisher(id)
      .then((res) => setData(res.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Publisher not found</div>;

  const publisher = data.publisher || data;
  const slots = data.slots || data.activeSlots || [];

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{publisher.name}</h1>
            {publisher.website && (
              <a href={publisher.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                <ExternalLink className="w-3 h-3" /> {publisher.website}
              </a>
            )}
            {publisher.category && <p className="text-sm text-gray-500 mt-1 capitalize">Category: {publisher.category}</p>}
          </div>
          <button
            onClick={() => navigate('/advertiser/ads/create', { state: { publisherId: publisher._id || publisher.id } })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Ad
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Available Ad Slots ({slots.length})</h2>
        {slots.length === 0 ? <p className="text-sm text-gray-500">No active slots available</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <div key={slot._id || slot.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">{slot.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex justify-between"><span>Size</span><span className="capitalize font-medium">{slot.size}</span></div>
                  <div className="flex justify-between"><span>Position</span><span className="capitalize font-medium">{slot.position}</span></div>
                  <div className="flex justify-between"><span>Pricing</span><span className="uppercase font-medium">{slot.pricingModel}</span></div>
                  <div className="flex justify-between"><span>Price</span><span className="font-medium">${slot.price}</span></div>
                </div>
                {slot.allowedCategories?.length > 0 && <p className="text-xs text-gray-400">Allows: {slot.allowedCategories.join(', ')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
