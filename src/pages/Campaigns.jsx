import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import CampaignList from '../components/campaigns/CampaignList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCampaignsApi, updateCampaignStatusApi } from '../services/api';
import { mockCampaigns } from '../data/mockData';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await getCampaignsApi();
        const rawCampaigns = res.data?.data;
        setCampaigns(Array.isArray(rawCampaigns) ? rawCampaigns : []);
      } catch {
        setCampaigns(mockCampaigns);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateCampaignStatusApi(id, status);
      setCampaigns((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch {
      setCampaigns((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    }
  };

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

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
