import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import PublisherFilters from '../components/publishers/PublisherFilters';
import PublisherList from '../components/publishers/PublisherList';
import Modal from '../components/common/Modal';
import PublisherCard from '../components/publishers/PublisherCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { getPublishersApi } from '../services/api';
import { mockPublishers } from '../data/mockData';
import { formatNumber } from '../utils/formatters';
import { getErrorMessage } from '../services/api';

export default function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [error, setError] = useState('');

  const fetchPublishers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPublishersApi();
      setPublishers(res.data.publishers || res.data || []);
      setIsDemo(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (!navigator.onLine || msg.includes('Network')) {
        setPublishers(mockPublishers);
        setIsDemo(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPublishers(); }, []);

  const filtered = publishers.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Failed to load publishers</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchPublishers}><RefreshCw className="h-4 w-4" />Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock data.</p>
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{filtered.length} publishers available</p>
      </div>
      <PublisherFilters category={category} setCategory={setCategory} search={search} setSearch={setSearch} />
      <PublisherList publishers={filtered} onSelect={setSelectedPublisher} />

      {selectedPublisher && (
        <Modal isOpen={!!selectedPublisher} onClose={() => setSelectedPublisher(null)} title={selectedPublisher.name} size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                {selectedPublisher.logo || '📱'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedPublisher.name}</h3>
                <p className="text-gray-500 text-sm">{selectedPublisher.category}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{selectedPublisher.description}</p>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatNumber(selectedPublisher.dau)}</p>
                <p className="text-xs text-gray-500">Daily Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{selectedPublisher.rating}</p>
                <p className="text-xs text-gray-500">App Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{selectedPublisher.slots}</p>
                <p className="text-xs text-gray-500">Ad Slots</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
