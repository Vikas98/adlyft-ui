import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getMySlots, deleteSlot, toggleSlot } from '../../services/publisher.service';

export default function MySlots() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = () => {
    setLoading(true);
    getMySlots()
      .then((res) => setSlots(res.data?.slots || res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    await deleteSlot(id).catch(() => {});
    fetchSlots();
  };

  const handleToggle = async (id) => {
    await toggleSlot(id).catch(() => {});
    fetchSlots();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Ad Slots</h1>
        <button onClick={() => navigate('/publisher/slots/create')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Slot
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        : slots.length === 0 ? <EmptyState title="No ad slots yet" description="Create your first ad slot to start monetizing your website." actionLabel="Create Slot" onAction={() => navigate('/publisher/slots/create')} />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot._id || slot.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{slot.name}</h3>
                  <StatusBadge status={slot.isActive ? 'active' : 'inactive'} />
                </div>
                {slot.description && <p className="text-xs text-gray-500 mb-3">{slot.description}</p>}
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><span>Size</span><span className="capitalize font-medium">{slot.size}</span></div>
                  <div className="flex justify-between"><span>Position</span><span className="capitalize font-medium">{slot.position}</span></div>
                  <div className="flex justify-between"><span>Pricing</span><span className="uppercase font-medium">{slot.pricingModel}</span></div>
                  <div className="flex justify-between"><span>Price</span><span className="font-medium">${slot.price}</span></div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => navigate(`/publisher/slots/${slot._id || slot.id}/edit`)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleToggle(slot._id || slot.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    {slot.isActive ? <ToggleRight className="w-3 h-3 text-green-600" /> : <ToggleLeft className="w-3 h-3" />}
                    {slot.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(slot._id || slot.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 ml-auto">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
