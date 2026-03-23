import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getSlot, updateSlot } from '../../services/publisher.service';

const SIZES = ['banner', 'leaderboard', 'rectangle', 'skyscraper', 'interstitial'];
const POSITIONS = ['header', 'sidebar', 'footer', 'in-content'];
const PRICING_MODELS = ['CPM', 'CPC'];
const CATEGORIES = ['technology', 'fashion', 'finance', 'sports', 'entertainment', 'health', 'travel'];

export default function EditSlot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSlot(id)
      .then((res) => {
        const s = res.data?.slot || res.data;
        setForm({
          name: s.name || '',
          description: s.description || '',
          size: s.size || '',
          position: s.position || '',
          pricingModel: s.pricingModel || '',
          price: s.price?.toString() || '',
          allowedCategories: s.allowedCategories || [],
          blockedCategories: s.blockedCategories || [],
          isActive: s.isActive ?? true,
        });
      })
      .catch(() => setError('Failed to load slot'));
  }, [id]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const toggleCategory = (field, cat) => {
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(cat) ? p[field].filter((c) => c !== cat) : [...p[field], cat],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateSlot(id, { ...form, price: parseFloat(form.price) });
      navigate('/publisher/slots');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update slot');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="flex justify-center py-20">{error ? <p className="text-red-600">{error}</p> : <LoadingSpinner size="lg" />}</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Ad Slot</h1>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Name *</label>
            <input type="text" value={form.name} onChange={set('name')} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
              <select value={form.size} onChange={set('size')} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select size</option>
                {SIZES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <select value={form.position} onChange={set('position')} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select position</option>
                {POSITIONS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model *</label>
              <select value={form.pricingModel} onChange={set('pricingModel')} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select model</option>
                {PRICING_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" value={form.price} onChange={set('price')} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Ad Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.allowedCategories.includes(cat)} onChange={() => toggleCategory('allowedCategories', cat)} className="rounded" />
                  <span className="text-sm text-gray-600 capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blocked Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.blockedCategories.includes(cat)} onChange={() => toggleCategory('blockedCategories', cat)} className="rounded" />
                  <span className="text-sm text-gray-600 capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
