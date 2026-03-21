import React, { useState } from 'react';
import CampaignCard from './CampaignCard';
import EmptyState from '../common/EmptyState';
import { Megaphone } from 'lucide-react';

const STATUSES = ['all', 'active', 'paused', 'completed', 'draft'];

export default function CampaignList({ campaigns = [], onStatusChange }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="No campaigns found" description="Try a different filter or create a new campaign." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CampaignCard key={c._id} campaign={c} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
