import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Monitor, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AddSlotModal from '../components/publishers/AddSlotModal';
import { getSlotsApi, deleteSlotApi } from '../services/api';
import { mockSlots } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

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

export default function MySlots() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSlotsApi({ publisherId: user?._id });
      const data = res.data?.data ?? res.data ?? [];
      setSlots(Array.isArray(data) ? data : []);
      setIsDemo(false);
    } catch {
      setSlots(mockSlots);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

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

  const statsTotal = slots.length;
  const statsAvailable = slots.filter((s) => s.status === 'available').length;
  const statsOccupied = slots.filter((s) => s.status === 'occupied').length;

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock slot data.</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-gray-900">{statsTotal}</p>
          <p className="text-xs text-gray-500 mt-1">Total Slots</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-green-600">{statsAvailable}</p>
          <p className="text-xs text-gray-500 mt-1">Available</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-blue-600">{statsOccupied}</p>
          <p className="text-xs text-gray-500 mt-1">Occupied</p>
        </Card>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{slots.length} ad slot{slots.length !== 1 ? 's' : ''}</p>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Slot
        </Button>
      </div>

      {/* Slots list */}
      {slots.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="No ad slots yet"
          description="Add your first ad slot to start monetizing your app."
          action={
            <Button onClick={() => setAddOpen(true)} className="mt-2">
              <Plus className="h-4 w-4" />
              Add Slot
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <Card key={slot._id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{slot.name}</span>
                  <Badge color={typeColors[slot.type] || 'gray'}>{slot.type}</Badge>
                  <Badge color={slot.status === 'available' ? 'green' : slot.status === 'occupied' ? 'red' : 'yellow'}>
                    {slot.status || 'available'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                  {(slot.size || slot.dimensions) && <span>{slot.size || slot.dimensions}</span>}
                  {slot.screen && <span>Screen: {slot.screen}</span>}
                  {slot.pricePerMonth && (
                    <span className="text-green-700 font-medium">{formatPrice(slot.pricePerMonth)}/mo</span>
                  )}
                  {slot.cpm && <span>CPM: ₹{slot.cpm}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingSlot(slot)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit slot"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingSlot(slot)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete slot"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
        publisherId={user?._id}
      />

      {/* Edit Slot Modal */}
      <AddSlotModal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        onSaved={handleSaved}
        publisherId={user?._id}
        slot={editingSlot}
      />

      {/* Delete Confirmation */}
      {deletingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
