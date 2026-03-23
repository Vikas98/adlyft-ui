import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Info } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getEarnings } from '../../services/publisher.service';

export default function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEarnings()
      .then((res) => setData(res.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const summary = data?.summary || {};
  const payouts = data?.payouts || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Earned" value={`$${(summary.totalEarned ?? 0).toLocaleString()}`} icon={DollarSign} color="emerald" />
        <StatCard title="This Month" value={`$${(summary.thisMonth ?? 0).toLocaleString()}`} icon={Calendar} color="blue" />
        <StatCard title="Last Month" value={`$${(summary.lastMonth ?? 0).toLocaleString()}`} icon={Calendar} color="indigo" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">Payouts are processed on the 1st of every month. Minimum payout threshold: $50.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Payout History</h2>
        {payouts.length === 0 ? (
          <p className="text-sm text-gray-500">No payout history yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Date','Amount','Status'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((p, i) => (
                  <tr key={p._id || p.id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{p.date ? new Date(p.date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-2 font-medium text-gray-800">${p.amount?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
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
