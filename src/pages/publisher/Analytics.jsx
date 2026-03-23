import React, { useState, useEffect } from 'react';
import { TrendingUp, MousePointer, Percent, DollarSign } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LineChart from '../../components/charts/LineChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPublisherAnalytics, getSlotAnalytics } from '../../services/publisher.service';

export default function PublisherAnalytics() {
  const [overview, setOverview] = useState(null);
  const [slotData, setSlotData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPublisherAnalytics(), getSlotAnalytics()])
      .then(([ovRes, slotRes]) => {
        setOverview(ovRes.data);
        setSlotData(slotRes.data?.slots || slotRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const summary = overview?.summary || {};
  const timeseries = overview?.timeseries || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Impressions" value={(summary.totalImpressions ?? 0).toLocaleString()} icon={TrendingUp} color="emerald" />
        <StatCard title="Total Clicks" value={(summary.totalClicks ?? 0).toLocaleString()} icon={MousePointer} color="blue" />
        <StatCard title="CTR" value={`${(summary.ctr ?? 0).toFixed(2)}%`} icon={Percent} color="purple" />
        <StatCard title="Total Revenue" value={`$${(summary.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Performance Over Time</h2>
        {timeseries.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">No data available</p> : (
          <LineChart data={timeseries} lines={[{ key: 'impressions', label: 'Impressions', color: '#10b981' }, { key: 'clicks', label: 'Clicks', color: '#3b82f6' }]} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Per-Slot Performance</h2>
        {slotData.length === 0 ? <p className="text-sm text-gray-500">No slot data available</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Slot Name','Impressions','Clicks','CTR','Revenue'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {slotData.map((s) => (
                  <tr key={s._id || s.id || s.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-2 text-gray-600">{(s.impressions ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-600">{(s.clicks ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-600">{((s.ctr ?? 0)).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-gray-600">${(s.revenue ?? 0).toLocaleString()}</td>
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
