import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import ImpressionsChart from '../components/analytics/ImpressionsChart';
import ClicksChart from '../components/analytics/ClicksChart';
import CTRChart from '../components/analytics/CTRChart';
import SpendChart from '../components/analytics/SpendChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAnalyticsTimeseriesApi, getAnalyticsCampaignsApi } from '../services/api';
import { mockTimeseries, mockCampaigns } from '../data/mockData';

const RANGES = ['7d', '30d', '90d'];

export default function Analytics() {
  const [range, setRange] = useState('30d');
  const [timeseries, setTimeseries] = useState([]);
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tsRes, campRes] = await Promise.all([
          getAnalyticsTimeseriesApi(range),
          getAnalyticsCampaignsApi(),
        ]);
        setTimeseries(tsRes.data?.data || []);
        const rawCampaigns = campRes.data?.data;
        setTopCampaigns(Array.isArray(rawCampaigns) ? rawCampaigns : []);
      } catch {
        const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
        setTimeseries(mockTimeseries.slice(-days));
        setTopCampaigns(mockCampaigns);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  const chartData = timeseries.map((d) => ({ ...d, date: d.date?.slice(5) || d.date }));

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock data.</p>
        </div>
      )}

      {/* Range selector */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${range === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Impressions</h3>
          <ImpressionsChart data={chartData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Clicks</h3>
          <ClicksChart data={chartData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">CTR (%)</h3>
          <CTRChart data={chartData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Ad Spend (₹)</h3>
          <SpendChart data={chartData} />
        </Card>
      </div>

      {/* Top Campaigns */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Top Campaigns by Impressions</h3>
        <div className="space-y-3">
          {topCampaigns.slice(0, 5).map((c) => (
            <div key={c._id} className="flex items-center justify-between">
              <span className="text-sm text-gray-800">{c.name}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{(c.impressions || 0).toLocaleString('en-IN')} imp</span>
                <span className="font-medium text-primary-600">{c.ctr}% CTR</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
