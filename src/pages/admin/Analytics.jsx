import React, { useState, useEffect } from 'react';
import { TrendingUp, MousePointer, Percent, DollarSign } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminAnalytics } from '../../services/admin.service';

const RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminAnalytics({ range })
      .then((res) => setData(res.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const timeseries = data?.timeseries || [];
  const revenueByPublisher = data?.revenueByPublisher || [];
  const summary = data?.summary || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button key={r.value} onClick={() => setRange(r.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${range === r.value ? 'bg-indigo-600 text-white' : 'text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{r.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Impressions" value={(summary.totalImpressions ?? 0).toLocaleString()} icon={TrendingUp} color="indigo" />
        <StatCard title="Total Clicks" value={(summary.totalClicks ?? 0).toLocaleString()} icon={MousePointer} color="blue" />
        <StatCard title="CTR" value={`${(summary.ctr ?? 0).toFixed(2)}%`} icon={Percent} color="purple" />
        <StatCard title="Total Revenue" value={`$${(summary.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Impressions & Clicks Over Time</h2>
        {timeseries.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">No data available</p> : (
          <LineChart data={timeseries} lines={[{ key: 'impressions', label: 'Impressions', color: '#6366f1' }, { key: 'clicks', label: 'Clicks', color: '#10b981' }]} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Revenue by Publisher</h2>
        {revenueByPublisher.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">No data available</p> : (
          <BarChart data={revenueByPublisher} bars={[{ key: 'revenue', label: 'Revenue', color: '#6366f1' }]} />
        )}
      </div>
    </div>
  );
}
