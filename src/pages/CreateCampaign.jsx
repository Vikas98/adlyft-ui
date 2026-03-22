import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import CreateCampaignForm from '../components/campaigns/CreateCampaignForm';
import { createCampaignApi, uploadAdApi, getPublishersApi } from '../services/api';
import { mockPublishers } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function CreateCampaign() {
  const [loading, setLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const res = await getPublishersApi();
        const rawPublishers = res.data?.data;
        setPublishers(Array.isArray(rawPublishers) ? rawPublishers : []);
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
        } catch (uploadErr) {
          addToast('Ad creative upload failed. Campaign will be created without an ad file.', 'warning');
        }
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
      addToast('Campaign created successfully!', 'success');
      navigate('/campaigns');
    } catch (err) {
      const msg = getErrorMessage(err);
      if (!navigator.onLine || msg.includes('Network')) {
        addToast('Demo mode — campaign not saved to server.', 'warning');
        navigate('/campaigns');
      } else {
        addToast(msg || 'Failed to create campaign. Please try again.', 'error');
      }
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
