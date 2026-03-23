import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2X2, PlayCircle, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPublisherStats } from '../../services/publisher.service';

export default function PublisherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublisherStats()
      .then((res) => setStats(res.data?.data || {}))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const cards = [
    { title: 'My Slots', value: stats?.totalSlots ?? 0, icon: Grid2X2, color: 'emerald' },
    { title: 'Active Slots', value: stats?.activeSlots ?? 0, icon: PlayCircle, color: 'green' },
    { title: 'Pending Ads', value: stats?.pendingAds ?? 0, icon: Clock, color: 'amber' },
    { title: 'Approved Ads Running', value: stats?.activeAds ?? 0, icon: CheckCircle, color: 'blue' },
    { title: 'Total Impressions', value: (stats?.totalImpressions ?? 0).toLocaleString(), icon: TrendingUp, color: 'indigo' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'green' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publisher Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      <div className="flex gap-3 mb-8">
        <button onClick={() => navigate('/publisher/slots/create')} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">Create New Slot</button>
        <button onClick={() => navigate('/publisher/analytics')} className="px-4 py-2 border border-emerald-600 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors">View Analytics</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Ads on My Slots</h2>
        {(stats?.recentAds?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">No ads yet. Create a slot to get started.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentAds.map((ad) => (
              <div key={ad._id || ad.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                  <p className="text-xs text-gray-500">{ad.advertiserName} · {ad.slotName}</p>
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
