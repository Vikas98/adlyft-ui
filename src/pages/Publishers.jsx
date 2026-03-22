import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import PublisherFilters from '../components/publishers/PublisherFilters';
import PublisherList from '../components/publishers/PublisherList';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import AddPublisherModal from '../components/publishers/AddPublisherModal';
import AdSlotManager from '../components/publishers/AdSlotManager';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getPublishersApi, createPublisherApi, updatePublisherApi, deletePublisherApi } from '../services/api';
import { mockPublishers } from '../data/mockData';
import { formatNumber } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function Publishers() {
  const { user } = useAuth();
  const userRole = user?.role || 'advertiser';
  const isAdmin = userRole === 'admin';

  const [publishers, setPublishers] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [deletingPublisher, setDeletingPublisher] = useState(null);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);

  const fetchPublishers = async () => {
    try {
      const res = await getPublishersApi();
      const rawPublishers = res.data?.data;
      setPublishers(Array.isArray(rawPublishers) ? rawPublishers : []);
      setIsDemo(false);
    } catch {
      setPublishers(mockPublishers);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleAddSave = async (data) => {
    try {
      await createPublisherApi(data);
      await fetchPublishers();
    } catch {
      setPublishers((prev) => [...prev, { ...data, _id: crypto.randomUUID() }]);
    }
  };

  const handleEditSave = async (data) => {
    try {
      await updatePublisherApi(editingPublisher._id, data);
      await fetchPublishers();
    } catch {
      setPublishers((prev) =>
        prev.map((p) => (p._id === editingPublisher._id ? { ...p, ...data } : p))
      );
    }
    setEditingPublisher(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmLoading(true);
    try {
      await deletePublisherApi(deletingPublisher._id);
    } catch { /* ignore */ }
    setPublishers((prev) => prev.filter((p) => p._id !== deletingPublisher._id));
    setDeleteConfirmLoading(false);
    setDeletingPublisher(null);
  };

  const filtered = publishers.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock data.</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} publishers available</p>
        {isAdmin && (
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Publisher
          </Button>
        )}
      </div>
      <PublisherFilters category={category} setCategory={setCategory} search={search} setSearch={setSearch} />
      <PublisherList
        publishers={filtered}
        onSelect={setSelectedPublisher}
        onEdit={isAdmin ? setEditingPublisher : undefined}
        onDelete={isAdmin ? setDeletingPublisher : undefined}
      />

      {/* Publisher Detail Modal */}
      {selectedPublisher && (
        <Modal isOpen={!!selectedPublisher} onClose={() => setSelectedPublisher(null)} title={selectedPublisher.name} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                {selectedPublisher.logo || '📱'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedPublisher.name}</h3>
                <p className="text-gray-500 text-sm">{selectedPublisher.category}</p>
                {selectedPublisher.platform && <p className="text-gray-400 text-xs">{selectedPublisher.platform}</p>}
              </div>
            </div>
            <p className="text-sm text-gray-600">{selectedPublisher.description}</p>
            {selectedPublisher.contactEmail && (
              <p className="text-sm text-gray-500">📧 {selectedPublisher.contactEmail}</p>
            )}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatNumber(selectedPublisher.dailyActiveUsers || selectedPublisher.dau)}</p>
                <p className="text-xs text-gray-500">Daily Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{selectedPublisher.rating || '—'}</p>
                <p className="text-xs text-gray-500">App Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{selectedPublisher.slots || selectedPublisher.adSlots?.length || 0}</p>
                <p className="text-xs text-gray-500">Ad Slots</p>
              </div>
            </div>
            <AdSlotManager publisherId={selectedPublisher._id} userRole={userRole} />
          </div>
        </Modal>
      )}

      {/* Add Publisher Modal */}
      {isAdmin && (
        <AddPublisherModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddSave}
        />
      )}

      {/* Edit Publisher Modal */}
      {isAdmin && (
        <AddPublisherModal
          isOpen={!!editingPublisher}
          onClose={() => setEditingPublisher(null)}
          onSave={handleEditSave}
          publisher={editingPublisher}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isAdmin && deletingPublisher && (
        <Modal isOpen={!!deletingPublisher} onClose={() => setDeletingPublisher(null)} title="Delete Publisher" size="sm">
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <strong>{deletingPublisher.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingPublisher(null)}>Cancel</Button>
            <Button variant="danger" loading={deleteConfirmLoading} onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
