import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const CATEGORY_OPTIONS = [
  { value: 'Transport', label: 'Transport' },
  { value: 'Social', label: 'Social' },
  { value: 'News', label: 'News' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Other', label: 'Other' },
];

const PLATFORM_OPTIONS = [
  { value: 'Android', label: 'Android' },
  { value: 'iOS', label: 'iOS' },
  { value: 'Both', label: 'Both' },
  { value: 'Web', label: 'Web' },
];

const initialForm = {
  name: '',
  appName: '',
  category: 'Transport',
  description: '',
  website: '',
  dailyActiveUsers: '',
  platform: 'Android',
  contactEmail: '',
};

export default function AddPublisherModal({ isOpen, onClose, onSave, publisher }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (publisher) {
      setForm({
        name: publisher.name || '',
        appName: publisher.appName || '',
        category: publisher.category || 'Transport',
        description: publisher.description || '',
        website: publisher.website || '',
        dailyActiveUsers: publisher.dailyActiveUsers || publisher.dau || '',
        platform: publisher.platform || 'Android',
        contactEmail: publisher.contactEmail || '',
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [publisher, isOpen]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.appName.trim()) newErrors.appName = 'App name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      newErrors.contactEmail = 'Invalid email address';
    }
    if (form.website) {
      try {
        const url = new URL(form.website);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          newErrors.website = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.website = 'Please enter a valid URL';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        dailyActiveUsers: form.dailyActiveUsers ? Number(form.dailyActiveUsers) : undefined,
      };
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={publisher ? 'Edit Publisher' : 'Add Publisher'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Publisher Name *"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Delhi Metro Sarthi"
            error={errors.name}
          />
          <Input
            label="App Name *"
            value={form.appName}
            onChange={(e) => update('appName', e.target.value)}
            placeholder="e.g. Delhi Metro Sarthi"
            error={errors.appName}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category *"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            options={CATEGORY_OPTIONS}
            error={errors.category}
          />
          <Select
            label="Platform"
            value={form.platform}
            onChange={(e) => update('platform', e.target.value)}
            options={PLATFORM_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Brief description of the app..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Website"
            type="url"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            placeholder="https://example.com"
            error={errors.website}
          />
          <Input
            label="Daily Active Users"
            type="number"
            value={form.dailyActiveUsers}
            onChange={(e) => update('dailyActiveUsers', e.target.value)}
            placeholder="75000"
          />
        </div>

        <Input
          label="Contact Email"
          type="email"
          value={form.contactEmail}
          onChange={(e) => update('contactEmail', e.target.value)}
          placeholder="ads@example.com"
          error={errors.contactEmail}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>
            {publisher ? 'Save Changes' : 'Add Publisher'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
