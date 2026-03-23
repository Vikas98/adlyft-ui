import React, { useState, useEffect } from 'react';
import { TrendingUp, MousePointer, Percent, DollarSign } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LineChart from '../../components/charts/LineChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdvertiserAnalytics } from '../../services/advertiser.service';

export default function AdvertiserAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdvertiserAnalytics()
      .then((res) => setData(res.data?.data || {}))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const summary = data?.summary || {};
  const timeseries = data?.timeseries || [];
  const campaignData = data?.campaigns || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Impressions" value={(summary.totalImpressions ?? 0).toLocaleString()} icon={TrendingUp} color="blue" />
        <StatCard title="Total Clicks" value={(summary.totalClicks ?? 0).toLocaleString()} icon={MousePointer} color="indigo" />
        <StatCard title="CTR" value={`${(summary.ctr ?? 0).toFixed(2)}%`} icon={Percent} color="purple" />
        <StatCard title="Total Spent" value={`$${(summary.totalSpent ?? 0).toLocaleString()}`} icon={DollarSign} color="amber" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Performance Over Time</h2>
        {timeseries.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">No data available</p> : (
          <LineChart data={timeseries} lines={[{ key: 'impressions', label: 'Impressions', color: '#3b82f6' }, { key: 'clicks', label: 'Clicks', color: '#8b5cf6' }]} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Per-Campaign Performance</h2>
        {campaignData.length === 0 ? <p className="text-sm text-gray-500">No campaign data available</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Campaign','Impressions','Clicks','CTR','Spent'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {campaignData.map((c) => (
                  <tr key={c._id || c.id || c.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-2 text-gray-600">{(c.impressions ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-600">{(c.clicks ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-600">{(c.ctr ?? 0).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-gray-600">${(c.spent ?? 0).toLocaleString()}</td>
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
