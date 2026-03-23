import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, CheckCircle, XCircle, Ban, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getPublishers, approvePublisher, rejectPublisher, blockPublisher, deletePublisher } from '../../services/admin.service';

const TABS = ['all', 'pending', 'approved', 'rejected', 'blocked'];

export default function AdminPublishers() {
  const navigate = useNavigate();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPublishers = () => {
    setLoading(true);
    const params = {};
    if (tab !== 'all') params.status = tab;
    if (search) params.search = search;
    getPublishers(params)
      .then((res) => setPublishers(res.data?.publishers || res.data || []))
      .catch(() => setPublishers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPublishers(); }, [tab, search]);

  const handleApprove = async (id) => {
    await approvePublisher(id).catch(() => {});
    fetchPublishers();
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    await rejectPublisher(rejectModal, rejectReason).catch(() => {});
    setRejectModal(null);
    setRejectReason('');
    fetchPublishers();
  };

  const handleBlock = async (id) => {
    await blockPublisher(id).catch(() => {});
    fetchPublishers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this publisher?')) return;
    await deletePublisher(id).catch(() => {});
    fetchPublishers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publishers</h1>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 border-b border-gray-200">
          <div className="flex gap-1 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : publishers.length === 0 ? (
          <EmptyState title="No publishers found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Website', 'Category', 'Status', 'Registered', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {publishers.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.email}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.website}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/publishers/${p._id || p.id}`)} className="text-gray-400 hover:text-indigo-600" title="View"><Eye className="w-4 h-4" /></button>
                        {p.status === 'pending' && <button onClick={() => handleApprove(p._id || p.id)} className="text-gray-400 hover:text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>}
                        {p.status === 'pending' && <button onClick={() => setRejectModal(p._id || p.id)} className="text-gray-400 hover:text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>}
                        {p.status !== 'blocked' && <button onClick={() => handleBlock(p._id || p.id)} className="text-gray-400 hover:text-orange-600" title="Block"><Ban className="w-4 h-4" /></button>}
                        <button onClick={() => handleDelete(p._id || p.id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-3">Reject Publisher</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
