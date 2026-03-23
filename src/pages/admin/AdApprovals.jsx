import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getAds, approveAd, rejectAd } from '../../services/admin.service';

const TABS = ['pending', 'approved', 'rejected'];

export default function AdApprovals() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  const fetchAds = () => {
    setLoading(true);
    getAds({ status: tab })
      .then((res) => setAds(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAds(); }, [tab]);

  const handleApprove = async (id) => {
    await approveAd(id).catch(() => {});
    fetchAds();
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    await rejectAd(rejectModal, rejectNote).catch(() => {});
    setRejectModal(null);
    setRejectNote('');
    fetchAds();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ad Approvals</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex gap-1 p-4 border-b border-gray-200">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t}</button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          : ads.length === 0 ? <EmptyState title={`No ${tab} ads`} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>{['Preview','Title','Advertiser','Publisher','Slot','Destination','Submitted','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ads.map((ad) => (
                    <tr key={ad._id || ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {ad.imageUrl ? <img src={ad.imageUrl} alt={ad.title} className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No img</div>}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.advertiserName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.publisherName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.slotName || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{ad.destinationUrl}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div>
                          <StatusBadge status={ad.status} />
                          {ad.adminNote && <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{ad.adminNote}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {tab === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(ad._id || ad.id)} className="text-gray-400 hover:text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => setRejectModal(ad._id || ad.id)} className="text-gray-400 hover:text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-3">Reject Ad</h3>
            <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={3} placeholder="Enter rejection note..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
