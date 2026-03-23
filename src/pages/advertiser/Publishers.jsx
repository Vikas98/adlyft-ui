import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { getPublishers } from '../../services/advertiser.service';

export default function AdvertiserPublishers() {
  const navigate = useNavigate();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchPublishers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    getPublishers(params)
      .then((res) => setPublishers(res.data?.publishers || res.data || []))
      .catch(() => setPublishers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPublishers(); }, [search, category]);

  const CATEGORIES = ['', 'technology', 'fashion', 'finance', 'sports', 'entertainment', 'health', 'travel', 'other'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Publishers</h1>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search publishers..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none capitalize">
          {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c || 'All categories'}</option>)}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        : publishers.length === 0 ? <EmptyState title="No publishers found" />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishers.map((pub) => (
              <div key={pub._id || pub.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate(`/advertiser/publishers/${pub._id || pub.id}`)}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{pub.name}</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{pub.category}</span>
                </div>
                {pub.website && (
                  <a href={pub.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mb-2">
                    <ExternalLink className="w-3 h-3" /> {pub.website}
                  </a>
                )}
                {pub.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{pub.description}</p>}
                <p className="text-xs text-gray-400">{pub.activeSlots ?? 0} active slots</p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
