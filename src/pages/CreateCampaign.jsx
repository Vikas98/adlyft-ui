import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import CreateCampaignForm from '../components/campaigns/CreateCampaignForm';
import { createCampaignApi, uploadAdApi, getPublishersApi } from '../services/api';
import { mockPublishers } from '../data/mockData';

export default function CreateCampaign() {
  const [loading, setLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const res = await getPublishersApi();
        setPublishers(res.data.publishers || res.data || []);
      } catch {
        setPublishers(mockPublishers);
      }
    };
    fetchPublishers();
  }, []);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      // Upload ad creative if present
      let adUrl = '';
      if (form.adFile) {
        const formData = new FormData();
        formData.append('file', form.adFile);
        try {
          const uploadRes = await uploadAdApi(formData);
          adUrl = uploadRes.data.url || '';
        } catch { /* ignore upload errors in demo mode */ }
      }

      const campaignData = {
        name: form.name,
        objective: form.objective,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        targetUrl: form.targetUrl,
        publisherId: form.publisherId,
        slotId: form.slotId,
        adUrl,
      };

      await createCampaignApi(campaignData);
      navigate('/campaigns');
    } catch {
      // Demo mode: just redirect
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Campaign</h2>
        <CreateCampaignForm publishers={publishers} onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
}
