import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Megaphone, Image, Clock, ShieldCheck, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminStats } from '../../services/admin.service';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const cards = [
    { title: 'Total Publishers', value: stats?.totalPublishers ?? 0, icon: Users, color: 'indigo' },
    { title: 'Total Advertisers', value: stats?.totalAdvertisers ?? 0, icon: Building2, color: 'blue' },
    { title: 'Total Campaigns', value: stats?.totalCampaigns ?? 0, icon: Megaphone, color: 'purple' },
    { title: 'Total Ads', value: stats?.totalAds ?? 0, icon: Image, color: 'amber' },
    { title: 'Pending Publishers', value: stats?.pendingPublishers ?? 0, icon: Clock, color: 'red' },
    { title: 'Pending Ad Approvals', value: stats?.pendingAds ?? 0, icon: ShieldCheck, color: 'red' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'green' },
    { title: 'Total Impressions', value: (stats?.totalImpressions ?? 0).toLocaleString(), icon: TrendingUp, color: 'blue' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Publisher Registrations</h2>
            <button onClick={() => navigate('/admin/publishers')} className="text-sm text-indigo-600 hover:underline">View all</button>
          </div>
          {(stats?.recentPublishers?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500">No recent registrations</p>
          ) : (
            <div className="space-y-3">
              {stats.recentPublishers.map((p) => (
                <div key={p._id || p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.email}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Ad Approval Requests</h2>
            <button onClick={() => navigate('/admin/ad-approvals')} className="text-sm text-indigo-600 hover:underline">View all</button>
          </div>
          {(stats?.recentAds?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAds.map((ad) => (
                <div key={ad._id || ad.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                    <p className="text-xs text-gray-500">{ad.advertiserName}</p>
                  </div>
                  <StatusBadge status={ad.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate('/admin/publishers')}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Review Publishers
        </button>
        <button
          onClick={() => navigate('/admin/ad-approvals')}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Review Ads
        </button>
      </div>
    </div>
  );
}
