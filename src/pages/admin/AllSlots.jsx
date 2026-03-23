import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getAllSlots, deleteSlot } from '../../services/admin.service';

export default function AllSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSlots = () => {
    setLoading(true);
    const params = search ? { search } : {};
    getAllSlots(params)
      .then((res) => setSlots(res.data?.slots || res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlots(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    await deleteSlot(id).catch(() => {});
    fetchSlots();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Ad Slots</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">Slots</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56" />
          </div>
        </div>
        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : slots.length === 0 ? <EmptyState title="No slots found" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Publisher','Slot Name','Size','Position','Pricing','Price','Status','Created','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {slots.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{s.publisherName || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{s.size}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{s.position}</td>
                      <td className="px-4 py-3 uppercase text-gray-600">{s.pricingModel}</td>
                      <td className="px-4 py-3 text-gray-600">${s.price}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.isActive ? 'active' : 'inactive'} /></td>
                      <td className="px-4 py-3 text-gray-600">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3"><button onClick={() => handleDelete(s._id || s.id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
