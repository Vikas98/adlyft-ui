import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import CampaignStepper from './CampaignStepper';
import PublisherList from '../publishers/PublisherList';
import SlotSelector from '../publishers/SlotSelector';
import { CAMPAIGN_STEPS } from '../../utils/constants';
import { Upload, CheckCircle } from 'lucide-react';

const initialForm = {
  name: '', objective: 'awareness', startDate: '', endDate: '', budget: '', targetUrl: '',
  publisherId: null, publisherName: '', slotId: null, slotName: '', adFile: null,
};

export default function CreateCampaignForm({ publishers = [], onSubmit, loading }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handlePublisherSelect = (publisher) => {
    setSelectedPublisher(publisher);
    update('publisherId', publisher._id);
    update('publisherName', publisher.name);
  };

  const handleSlotSelect = (slot) => {
    update('slotId', slot._id);
    update('slotName', slot.name);
  };

  const handleFileChange = (e) => {
    update('adFile', e.target.files[0]);
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div>
      <CampaignStepper steps={CAMPAIGN_STEPS} currentStep={step} />

      <div className="min-h-64">
        {/* Step 0: Campaign Details */}
        {step === 0 && (
          <div className="space-y-4 max-w-xl">
            <Input label="Campaign Name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Summer Sale 2024" />
            <Select label="Objective" value={form.objective} onChange={(e) => update('objective', e.target.value)}
              options={[
                { value: 'awareness', label: 'Brand Awareness' },
                { value: 'traffic', label: 'Drive Traffic' },
                { value: 'installs', label: 'App Installs' },
                { value: 'conversions', label: 'Conversions' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
              <Input label="End Date" type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
            </div>
            <Input label="Total Budget (₹)" type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder="50000" />
            <Input label="Target URL" type="url" value={form.targetUrl} onChange={(e) => update('targetUrl', e.target.value)} placeholder="https://yoursite.com" />
          </div>
        )}

        {/* Step 1: Publisher */}
        {step === 1 && (
          <div>
            {selectedPublisher && (
              <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700">
                ✓ Selected: <strong>{selectedPublisher.name}</strong>
              </div>
            )}
            <PublisherList publishers={publishers} onSelect={handlePublisherSelect} selectedId={form.publisherId} compact />
          </div>
        )}

        {/* Step 2: Slot */}
        {step === 2 && (
          <SlotSelector publisherId={form.publisherId} selectedSlotId={form.slotId} onSelect={handleSlotSelect} />
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
          <div className="max-w-xl">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('adFileInput').click()}>
              <input id="adFileInput" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
              {form.adFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="font-medium text-gray-900">{form.adFile.name}</p>
                  <p className="text-xs text-gray-400">{(form.adFile.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Click to upload ad creative</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF, MP4 (max 10MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="max-w-xl space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Review Your Campaign</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {[
                ['Campaign Name', form.name],
                ['Objective', form.objective],
                ['Start Date', form.startDate],
                ['End Date', form.endDate],
                ['Budget', form.budget ? `₹${Number(form.budget).toLocaleString('en-IN')}` : '—'],
                ['Publisher', form.publisherName || '—'],
                ['Ad Slot', form.slotName || '—'],
                ['Creative', form.adFile?.name || '—'],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium text-gray-900">{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          Previous
        </Button>
        {step < CAMPAIGN_STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !form.name}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} variant="primary">
            Launch Campaign
          </Button>
        )}
      </div>
    </div>
  );
}
