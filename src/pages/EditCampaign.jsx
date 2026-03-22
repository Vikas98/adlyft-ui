import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCampaignApi, updateCampaignApi } from '../services/api';

const OBJECTIVE_OPTIONS = [
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'traffic', label: 'Drive Traffic' },
  { value: 'conversions', label: 'Conversions' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    objective: 'brand_awareness',
    status: 'draft',
    startDate: '',
    endDate: '',
    totalBudget: '',
    dailyBudget: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCampaignApi(id);
        const c = res.data?.data || res.data;
        setForm({
          name: c.name || '',
          objective: c.objective || 'brand_awareness',
          status: c.status || 'draft',
          startDate: c.startDate ? c.startDate.slice(0, 10) : '',
          endDate: c.endDate ? c.endDate.slice(0, 10) : '',
          totalBudget: c.totalBudget || '',
          dailyBudget: c.dailyBudget || '',
        });
      } catch {
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCampaignApi(id, {
        ...form,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : undefined,
        dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : undefined,
      });
      navigate(`/campaigns/${id}`);
    } catch {
      navigate(`/campaigns/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/campaigns/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Edit Campaign</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Campaign Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Objective"
              value={form.objective}
              onChange={(e) => update('objective', e.target.value)}
              options={OBJECTIVE_OPTIONS}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Budget (₹)"
              type="number"
              value={form.totalBudget}
              onChange={(e) => update('totalBudget', e.target.value)}
              placeholder="50000"
            />
            <Input
              label="Daily Budget (₹)"
              type="number"
              value={form.dailyBudget}
              onChange={(e) => update('dailyBudget', e.target.value)}
              placeholder="5000"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link to={`/campaigns/${id}`}>
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
