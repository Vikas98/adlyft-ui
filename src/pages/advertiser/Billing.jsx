import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, CreditCard, Download } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getBillingSummary, getInvoices } from '../../services/advertiser.service';

export default function Billing() {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    Promise.all([getBillingSummary(), getInvoices()])
      .then(([sumRes, invRes]) => {
        setSummary(sumRes.data?.data || null);
        setInvoices(Array.isArray(invRes.data?.data) ? invRes.data.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Spent" value={`$${(summary?.totalSpent ?? 0).toLocaleString()}`} icon={DollarSign} color="blue" />
        <StatCard title="Available Balance" value={`$${(summary?.balance ?? 500).toLocaleString()}`} icon={CreditCard} color="green" />
        <StatCard title="Next Billing Date" value={summary?.nextBillingDate || '—'} icon={Calendar} color="indigo" />
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={showToast} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + Add Funds
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Invoice #','Date','Amount','Status','Download'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv, i) => (
                  <tr key={inv._id || inv.id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{inv.invoiceNumber || `#${String(i + 1).padStart(4, '0')}`}</td>
                    <td className="px-4 py-2 text-gray-600">{inv.date ? new Date(inv.date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-2 text-gray-600">${inv.amount?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {inv.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button disabled className="flex items-center gap-1 text-xs text-gray-400 cursor-not-allowed">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toastVisible && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
          Feature coming soon!
        </div>
      )}
    </div>
  );
}
