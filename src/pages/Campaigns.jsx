import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import CampaignList from '../components/campaigns/CampaignList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCampaignsApi, updateCampaignStatusApi } from '../services/api';
import { mockCampaigns } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCampaignsApi();
      setCampaigns(res.data.campaigns || res.data || []);
      setIsDemo(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (!navigator.onLine || msg.includes('Network')) {
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await getCampaignsApi();
        const rawCampaigns = res.data?.data;
        setCampaigns(Array.isArray(rawCampaigns) ? rawCampaigns : []);
      } catch {
        setCampaigns(mockCampaigns);
        setIsDemo(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateCampaignStatusApi(id, status);
      setCampaigns((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
      addToast('Campaign status updated.', 'success');
    } catch (err) {
      addToast(getErrorMessage(err) || 'Failed to update campaign status.', 'error');
    }
  };

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Failed to load campaigns</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchCampaigns}><RefreshCw className="h-4 w-4" />Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock data.</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{campaigns.length} total campaigns</p>
        </div>
        <Link to="/campaigns/create">
          <Button>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>
      <CampaignList campaigns={campaigns} onStatusChange={handleStatusChange} />
    </div>
  );
}
