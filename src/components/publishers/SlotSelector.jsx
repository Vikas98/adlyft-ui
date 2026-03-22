import React, { useState, useEffect } from 'react';
import { getSlotsApi } from '../../services/api';
import { mockSlots } from '../../data/mockData';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const typeColors = { banner: 'bg-blue-100 text-blue-700', interstitial: 'bg-purple-100 text-purple-700', native: 'bg-green-100 text-green-700', video: 'bg-red-100 text-red-700' };

export default function SlotSelector({ publisherId, selectedSlotId, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await getSlotsApi({ publisherId });
        const rawSlots = res.data?.data;
        setSlots(Array.isArray(rawSlots) ? rawSlots : []);
      } catch {
        setSlots(mockSlots.filter((s) => s.publisherId === publisherId));
      } finally {
        setLoading(false);
      }
    };
    if (publisherId) fetchSlots();
    else setLoading(false);
  }, [publisherId]);

  if (!publisherId) return <div className="text-sm text-gray-500 py-4">Please select a publisher first.</div>;
  if (loading) return <LoadingSpinner className="py-8" />;
  if (slots.length === 0) return <div className="text-sm text-gray-500 py-4">No slots available for this publisher.</div>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slots.map((slot) => (
        <div
          key={slot._id}
          onClick={() => onSelect(slot)}
          className={`p-4 border rounded-xl cursor-pointer transition-all ${
            selectedSlotId === slot._id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="font-medium text-sm text-gray-900">{slot.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[slot.type] || 'bg-gray-100 text-gray-600'}`}>{slot.type}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{slot.dimensions}</p>
          <p className="text-sm font-semibold text-primary-600 mt-2">{formatCurrency(slot.price)}/month</p>
        </div>
      ))}
    </div>
  );
}
