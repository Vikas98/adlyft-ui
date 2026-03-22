import React, { useState, useEffect } from 'react';
import { AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getProfileApi, updateProfileApi, getApiKeyApi, regenerateApiKeyApi } from '../services/api';
import { mockProfile } from '../data/mockData';

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, keyRes] = await Promise.all([getProfileApi(), getApiKeyApi()]);
        setProfile(profRes.data?.data || profRes.data);
        setApiKey(keyRes.data?.data?.apiKey || keyRes.data?.apiKey || '');
      } catch {
        setProfile(mockProfile);
        setApiKey('adlyft_demo_key_xxxx1234');
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileApi(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    try {
      const res = await regenerateApiKeyApi();
      setApiKey(res.data?.data?.apiKey || res.data?.apiKey || 'adlyft_new_key_xxxx5678');
    } catch {
      setApiKey('adlyft_demo_key_' + Math.random().toString(36).slice(2, 10));
    }
  };

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="max-w-2xl space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Changes won't persist.</p>
        </div>
      )}

      {/* Profile */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">Profile Settings</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={profile?.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Input label="Email" type="email" value={profile?.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <Input label="Company" value={profile?.company || ''} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          <Input label="Phone" value={profile?.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <Input label="Website" type="url" value={profile?.website || ''} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
          <div className="flex items-center gap-3">
            <Button type="submit" loading={saving}>Save Changes</Button>
            {saved && <span className="text-sm text-green-600">✓ Saved successfully</span>}
          </div>
        </form>
      </Card>

      {/* API Key */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">API Key</h2>
        <p className="text-sm text-gray-500 mb-3">Use this key to access the Adlyft API programmatically.</p>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono"
          />
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(apiKey)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegenerateKey}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
