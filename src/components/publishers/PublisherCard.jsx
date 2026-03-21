import React from 'react';
import { Users, Star, Layout } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatNumber } from '../../utils/formatters';

const categoryColors = {
  Transport: 'blue', Gaming: 'purple', News: 'yellow', Finance: 'green',
  Food: 'red', Health: 'green', Education: 'blue', Entertainment: 'purple',
};

export default function PublisherCard({ publisher, onSelect, selected, compact }) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all ${selected ? 'ring-2 ring-primary-500 border-primary-200' : ''} ${compact ? 'p-4' : ''}`}
      onClick={() => onSelect?.(publisher)}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {publisher.logo || '📱'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{publisher.name}</h3>
            <Badge color={categoryColors[publisher.category] || 'gray'}>{publisher.category}</Badge>
          </div>
          {!compact && <p className="text-xs text-gray-500 mt-0.5">{publisher.description}</p>}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(publisher.dau)} DAU</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />{publisher.rating}</span>
            <span className="flex items-center gap-1"><Layout className="h-3 w-3" />{publisher.slots} slots</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
