import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPublishers, getPublisher, getMyCampaigns, createAd } from '../../services/advertiser.service';

const STEPS = ['Select Publisher', 'Select Ad Slot', 'Ad Details'];

export default function CreateAd() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ campaignId: '', title: '', description: '', imageUrl: '', destinationUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getPublishers({ status: 'approved' })
      .then((res) => setPublishers(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => {});
    getMyCampaigns()
      .then((res) => setCampaigns(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => {});
  }, []);

  const handleSelectPublisher = async (pub) => {
    setSelectedPublisher(pub);
    setLoading(true);
    try {
      const res = await getPublisher(pub._id || pub.id);
      const data = res.data?.data;
      setSlots(data?.slots || data?.activeSlots || []);
    } catch { setSlots([]); }
    finally { setLoading(false); }
    setStep(1);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setStep(2);
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createAd({
        ...form,
        publisherId: selectedPublisher._id || selectedPublisher.id,
        slotId: selectedSlot._id || selectedSlot.id,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ad');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ad Submitted!</h2>
        <p className="text-gray-500 mb-6">Your ad has been submitted for admin review. You'll be notified once it's approved.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/advertiser/ads')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">View My Ads</button>
          <button onClick={() => { setSuccess(false); setStep(0); setSelectedPublisher(null); setSelectedSlot(null); setForm({ campaignId: '', title: '', description: '', imageUrl: '', destinationUrl: '' }); }} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Create Another</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Ad</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${i === step ? 'bg-blue-600 text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {i < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Publisher */}
      {step === 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Select a Publisher</h2>
          {publishers.length === 0 ? <p className="text-gray-500">No approved publishers available.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishers.map((pub) => (
                <button key={pub._id || pub.id} onClick={() => handleSelectPublisher(pub)} className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1">{pub.name}</h3>
                  <p className="text-xs text-blue-600 mb-1">{pub.website}</p>
                  <p className="text-xs text-gray-500 capitalize">{pub.category}</p>
                  {pub.activeSlots !== undefined && <p className="text-xs text-gray-400 mt-1">{pub.activeSlots} active slots</p>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Slot */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Select a Slot from <span className="text-blue-600">{selectedPublisher?.name}</span></h2>
            <button onClick={() => setStep(0)} className="text-sm text-gray-500 hover:text-gray-700">← Change Publisher</button>
          </div>
          {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
            : slots.length === 0 ? <p className="text-gray-500">No active slots available for this publisher.</p>
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                  <button key={slot._id || slot.id} onClick={() => handleSelectSlot(slot)} className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                    <h3 className="font-semibold text-gray-800 mb-2">{slot.name}</h3>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between"><span>Size</span><span className="capitalize font-medium">{slot.size}</span></div>
                      <div className="flex justify-between"><span>Position</span><span className="capitalize font-medium">{slot.position}</span></div>
                      <div className="flex justify-between"><span>Pricing</span><span className="uppercase font-medium">{slot.pricingModel}</span></div>
                      <div className="flex justify-between"><span>Price</span><span className="font-medium">${slot.price}</span></div>
                    </div>
                    {slot.allowedCategories?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">Allows: {slot.allowedCategories.join(', ')}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Step 3: Ad Details */}
      {step === 2 && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ad Details</h2>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">← Change Slot</button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
            Publisher: <strong>{selectedPublisher?.name}</strong> · Slot: <strong>{selectedSlot?.name}</strong>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
              <select value={form.campaignId} onChange={set('campaignId')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select campaign (optional)</option>
                {campaigns.map((c) => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title *</label>
              <input type="text" value={form.title} onChange={set('title')} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Description</label>
              <textarea value={form.description} onChange={set('description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input type="url" value={form.imageUrl} onChange={set('imageUrl')} required placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {form.imageUrl && (
                <div className="mt-2">
                  <img src={form.imageUrl} alt="Preview" className="max-h-32 rounded-lg border border-gray-200 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL *</label>
              <input type="url" value={form.destinationUrl} onChange={set('destinationUrl')} required placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Ad for Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
