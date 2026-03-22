import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MousePointer, DollarSign, Megaphone, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import StatsCard from '../components/dashboard/StatsCard';
import CampaignTable from '../components/dashboard/CampaignTable';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { getAnalyticsOverviewApi, getAnalyticsTimeseriesApi, getCampaignsApi, getErrorMessage } from '../services/api';
import { mockAnalyticsOverview, mockTimeseries, mockCampaigns, mockActivities } from '../data/mockData';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ovRes, tsRes, campRes] = await Promise.all([
        getAnalyticsOverviewApi(),
        getAnalyticsTimeseriesApi('30d'),
        getCampaignsApi({ status: 'active' }),
      ]);
      setOverview(ovRes.data);
      setTimeseries(tsRes.data.data || tsRes.data || []);
      setCampaigns(campRes.data.campaigns || campRes.data || []);
      setActivities([]);
      setIsDemo(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (!navigator.onLine || msg.includes('Network')) {
        setOverview(mockAnalyticsOverview);
        setTimeseries(mockTimeseries);
        setCampaigns(mockCampaigns.filter((c) => c.status === 'active'));
        setActivities(mockActivities);
        setIsDemo(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchData}><RefreshCw className="h-4 w-4" />Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode</strong> — Backend is offline. Showing mock data. Start your backend at <code className="bg-yellow-100 px-1 rounded">localhost:5000</code>.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Total Impressions" value={formatNumber(overview?.totalImpressions || 0)} trend={12} trendLabel="vs last month" icon={TrendingUp} iconColor="bg-primary-100 text-primary-600" />
        <StatsCard label="Total Clicks" value={formatNumber(overview?.totalClicks || 0)} trend={8} trendLabel="vs last month" icon={MousePointer} iconColor="bg-cyan-100 text-cyan-600" />
        <StatsCard label="Avg CTR" value={formatPercentage(overview?.avgCtr || 0)} trend={0.3} trendLabel="vs last month" icon={TrendingUp} iconColor="bg-green-100 text-green-600" />
        <StatsCard label="Total Spend" value={formatCurrency(overview?.totalSpend || 0)} trend={15} trendLabel="vs last month" icon={DollarSign} iconColor="bg-purple-100 text-purple-600" />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Performance (Last 14 Days)</h2>
          </div>
          <PerformanceChart data={timeseries} />
        </Card>
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <RecentActivity activities={activities} />
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Active Campaigns</h2>
          <Link to="/campaigns/create">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
        <CampaignTable campaigns={campaigns} />
      </Card>
    </div>
  );
}
