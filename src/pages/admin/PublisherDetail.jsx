import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Ban } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPublisher, approvePublisher, rejectPublisher, blockPublisher } from '../../services/admin.service';

export default function PublisherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetch = () => {
    setLoading(true);
    getPublisher(id)
      .then((res) => setData(res.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const handleApprove = async () => { await approvePublisher(id).catch(() => {}); fetch(); };
  const handleReject = async () => { await rejectPublisher(id, rejectReason).catch(() => {}); setRejectModal(false); fetch(); };
  const handleBlock = async () => { await blockPublisher(id).catch(() => {}); fetch(); };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Publisher not found</div>;

  const publisher = data.publisher || data;
  const slots = data.slots || [];

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{publisher.name}</h1>
            <p className="text-gray-500">{publisher.email}</p>
          </div>
          <StatusBadge status={publisher.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {publisher.website && <div><span className="text-gray-500">Website:</span> <a href={publisher.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{publisher.website}</a></div>}
          {publisher.category && <div><span className="text-gray-500">Category:</span> <span className="capitalize">{publisher.category}</span></div>}
          {publisher.createdAt && <div><span className="text-gray-500">Registered:</span> {new Date(publisher.createdAt).toLocaleDateString()}</div>}
        </div>
        <div className="flex gap-3 mt-4">
          {publisher.status === 'pending' && <button onClick={handleApprove} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"><CheckCircle className="w-4 h-4" />Approve</button>}
          {publisher.status === 'pending' && <button onClick={() => setRejectModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"><XCircle className="w-4 h-4" />Reject</button>}
          {publisher.status !== 'blocked' && <button onClick={handleBlock} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Ban className="w-4 h-4" />Block</button>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Ad Slots ({slots.length})</h2>
        {slots.length === 0 ? <p className="text-sm text-gray-500">No slots created yet</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Name','Size','Position','Pricing','Price','Status'].map(h=><th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {slots.map((s) => (
                  <tr key={s._id || s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2 capitalize">{s.size}</td>
                    <td className="px-4 py-2 capitalize">{s.position}</td>
                    <td className="px-4 py-2 uppercase">{s.pricingModel}</td>
                    <td className="px-4 py-2">${s.price}</td>
                    <td className="px-4 py-2"><StatusBadge status={s.status || (s.isActive ? 'active' : 'inactive')} /></td>
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
            <h3 className="font-semibold text-gray-900 mb-3">Reject Publisher</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Enter rejection reason..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRejectModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
