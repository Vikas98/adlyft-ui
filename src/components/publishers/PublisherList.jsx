import React from 'react';
import PublisherCard from './PublisherCard';
import EmptyState from '../common/EmptyState';
import { Building2 } from 'lucide-react';

export default function PublisherList({ publishers = [], onSelect, onEdit, onDelete, selectedId, compact }) {
  if (publishers.length === 0) {
    return <EmptyState icon={Building2} title="No publishers found" description="Try adjusting your filters." />;
  }
  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
      {publishers.map((p) => (
        <PublisherCard key={p._id} publisher={p} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} selected={selectedId === p._id} compact={compact} />
      ))}
    </div>
  );
}
