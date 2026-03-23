import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, PlayCircle, Image, CheckCircle, DollarSign, TrendingUp, MousePointer } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdvertiserStats } from '../../services/advertiser.service';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdvertiserStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const cards = [
    { title: 'Total Campaigns', value: stats?.totalCampaigns ?? 0, icon: Megaphone, color: 'blue' },
    { title: 'Active Campaigns', value: stats?.activeCampaigns ?? 0, icon: PlayCircle, color: 'green' },
    { title: 'Total Ads', value: stats?.totalAds ?? 0, icon: Image, color: 'indigo' },
    { title: 'Approved Ads', value: stats?.approvedAds ?? 0, icon: CheckCircle, color: 'emerald' },
    { title: 'Total Spent', value: `$${(stats?.totalSpent ?? 0).toLocaleString()}`, icon: DollarSign, color: 'amber' },
    { title: 'Total Impressions', value: (stats?.totalImpressions ?? 0).toLocaleString(), icon: TrendingUp, color: 'purple' },
    { title: 'Total Clicks', value: (stats?.totalClicks ?? 0).toLocaleString(), icon: MousePointer, color: 'blue' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Advertiser Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      <div className="flex gap-3 mb-8">
        <button onClick={() => navigate('/advertiser/campaigns/create')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Create Campaign</button>
        <button onClick={() => navigate('/advertiser/ads/create')} className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">Create Ad</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Recent Campaigns</h2>
          <button onClick={() => navigate('/advertiser/campaigns')} className="text-sm text-blue-600 hover:underline">View all</button>
        </div>
        {(stats?.recentCampaigns?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">No campaigns yet. <button onClick={() => navigate('/advertiser/campaigns/create')} className="text-blue-600 hover:underline">Create one</button></p>
        ) : (
          <div className="space-y-3">
            {stats.recentCampaigns.map((c) => (
              <div key={c._id || c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">Budget: ${c.budget?.toLocaleString()}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
