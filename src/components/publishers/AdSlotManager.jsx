import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Monitor } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import AddSlotModal from './AddSlotModal';
import { getSlotsApi, deleteSlotApi } from '../../services/api';
import { mockSlots } from '../../data/mockData';

const typeColors = {
  banner: 'blue',
  interstitial: 'purple',
  native: 'green',
  fullscreen: 'yellow',
  video: 'red',
};

function formatPrice(val) {
  if (!val && val !== 0) return '—';
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

export default function AdSlotManager({ publisherId, userRole }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAdmin = userRole === 'admin';

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await getSlotsApi({ publisherId });
      const data = res.data?.data ?? res.data ?? [];
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      setSlots(mockSlots.filter((s) => s.publisherId === publisherId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publisherId) fetchSlots();
  }, [publisherId]);

  const handleSaved = () => {
    fetchSlots();
    setAddOpen(false);
    setEditingSlot(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteSlotApi(deletingSlot._id);
    } catch { /* fallback */ }
    setSlots((prev) => prev.filter((s) => s._id !== deletingSlot._id));
    setDeleteLoading(false);
    setDeletingSlot(null);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-gray-500" />
          Ad Slots
          {slots.length > 0 && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {slots.length}
            </span>
          )}
        </h4>
        {isAdmin && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Slot
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner className="h-24" />
      ) : slots.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="No ad slots yet"
          description={isAdmin ? 'Add the first ad slot for this publisher.' : 'No ad slots available for this publisher.'}
        />
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 truncate">{slot.name}</span>
                  <Badge color={typeColors[slot.type] || 'gray'}>{slot.type}</Badge>
                  <Badge color={slot.status === 'available' ? 'green' : slot.status === 'occupied' ? 'red' : 'yellow'}>
                    {slot.status || 'available'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                  {(slot.size || slot.dimensions) && (
                    <span>{slot.size || slot.dimensions}</span>
                  )}
                  {slot.screen && <span>Screen: {slot.screen}</span>}
                  {slot.pricePerMonth && (
                    <span className="text-green-700 font-medium">{formatPrice(slot.pricePerMonth)}/mo</span>
                  )}
                  {slot.cpm && <span>CPM: ₹{slot.cpm}</span>}
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingSlot(slot)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit slot"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingSlot(slot)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
        publisherId={publisherId}
      />

      {/* Edit Slot Modal */}
      <AddSlotModal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        onSaved={handleSaved}
        publisherId={publisherId}
        slot={editingSlot}
      />

      {/* Delete Confirmation */}
      {deletingSlot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeletingSlot(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Ad Slot</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{deletingSlot.name}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeletingSlot(null)}>Cancel</Button>
              <Button variant="danger" size="sm" loading={deleteLoading} onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
