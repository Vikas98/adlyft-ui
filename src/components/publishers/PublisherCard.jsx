import React from 'react';
import { Users, Star, Layout, Pencil, Trash2, Mail, Smartphone } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatNumber } from '../../utils/formatters';

const categoryColors = {
  Transport: 'blue', Gaming: 'purple', News: 'yellow', Finance: 'green',
  Food: 'red', Health: 'green', Education: 'blue', Entertainment: 'purple',
  Social: 'blue', Shopping: 'red', Other: 'gray',
};

export default function PublisherCard({ publisher, onSelect, onEdit, onDelete, selected, compact }) {
  const dau = publisher.dailyActiveUsers || publisher.dau;

  return (
    <Card
      className={`hover:shadow-md transition-all ${selected ? 'ring-2 ring-primary-500 border-primary-200' : ''} ${compact ? 'p-4' : ''} ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(publisher)}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {publisher.logo || '📱'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{publisher.name}</h3>
            <div className="flex items-center gap-2">
              <Badge color={categoryColors[publisher.category] || 'gray'}>{publisher.category}</Badge>
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {onEdit && (
                    <button
                      className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                      onClick={() => onEdit(publisher)}
                      title="Edit publisher"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => onDelete(publisher)}
                      title="Delete publisher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {!compact && publisher.appName && publisher.appName !== publisher.name && (
            <p className="text-xs text-gray-500 mt-0.5">{publisher.appName}</p>
          )}
          {!compact && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{publisher.description}</p>}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
            {dau && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(dau)} DAU</span>}
            {publisher.rating && <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />{publisher.rating}</span>}
            {(publisher.slots || publisher.adSlots?.length > 0) && (
              <span className="flex items-center gap-1"><Layout className="h-3 w-3" />{publisher.slots || publisher.adSlots?.length} slots</span>
            )}
            {publisher.platform && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />{publisher.platform}</span>}
            {!compact && publisher.contactEmail && (
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{publisher.contactEmail}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
