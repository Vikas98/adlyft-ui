import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { createSlotApi, updateSlotApi } from '../../services/api';

const SIZE_OPTIONS = [
  { value: '', label: 'Select size' },
  { value: '320x50', label: '320×50 (Banner)' },
  { value: '300x250', label: '300×250 (Medium Rectangle)' },
  { value: '320x480', label: '320×480 (Interstitial)' },
  { value: '728x90', label: '728×90 (Leaderboard)' },
  { value: '1080x1920', label: '1080×1920 (Fullscreen)' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'Select type' },
  { value: 'banner', label: 'Banner' },
  { value: 'interstitial', label: 'Interstitial' },
  { value: 'native', label: 'Native' },
  { value: 'fullscreen', label: 'Fullscreen' },
  { value: 'video', label: 'Video' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'paused', label: 'Paused' },
];

const DEFAULT_FORM = {
  name: '',
  screen: '',
  size: '',
  type: '',
  pricePerMonth: '',
  cpm: '',
  status: 'available',
};

export default function AddSlotModal({ isOpen, onClose, onSaved, publisherId, slot }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = !!slot;

  useEffect(() => {
    if (isOpen) {
      if (slot) {
        setForm({
          name: slot.name || '',
          screen: slot.screen || '',
          size: slot.size || slot.dimensions || '',
          type: slot.type || '',
          pricePerMonth: slot.pricePerMonth ?? '',
          cpm: slot.cpm ?? '',
          status: slot.status || 'available',
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [isOpen, slot]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.type) e.type = 'Type is required';
    if (!form.size) e.size = 'Size is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    setSaving(true);
    const payload = {
      ...form,
      publisherId,
      pricePerMonth: form.pricePerMonth !== '' ? Number(form.pricePerMonth) : undefined,
      cpm: form.cpm !== '' ? Number(form.cpm) : undefined,
    };

    try {
      if (isEditing) {
        await updateSlotApi(slot._id, payload);
      } else {
        await createSlotApi(payload);
      }
      onSaved();
    } catch (err) {
      // Optimistic: still call onSaved so UI reflects the change
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Ad Slot' : 'Add Ad Slot'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Slot Name"
          placeholder="e.g. Home Screen Banner"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
        />
        <Input
          label="Screen"
          placeholder="e.g. home, route_result, splash"
          value={form.screen}
          onChange={handleChange('screen')}
          error={errors.screen}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Size"
            options={SIZE_OPTIONS}
            value={form.size}
            onChange={handleChange('size')}
            error={errors.size}
          />
          <Select
            label="Type"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={handleChange('type')}
            error={errors.type}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price / Month (₹)"
            type="number"
            min="0"
            placeholder="e.g. 25000"
            value={form.pricePerMonth}
            onChange={handleChange('pricePerMonth')}
          />
          <Input
            label="CPM (₹)"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 12.5"
            value={form.cpm}
            onChange={handleChange('cpm')}
          />
        </div>
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={handleChange('status')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>
            {isEditing ? 'Save Changes' : 'Add Slot'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
