import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency, formatNumber, formatDate, formatPercentage } from '../../utils/formatters';

const statusColors = { active: 'green', paused: 'yellow', completed: 'blue', draft: 'gray' };

export default function CampaignCard({ campaign, onStatusChange }) {
  const spentPercent = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
          {campaign.publisherName && <p className="text-xs text-gray-400 mt-0.5">{campaign.publisherName}</p>}
        </div>
        <Badge color={statusColors[campaign.status] || 'gray'}>{campaign.status}</Badge>
      </div>

      {/* Budget bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Budget spent</span>
          <span>{Math.round(spentPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-primary-500 rounded-full transition-all"
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatCurrency(campaign.spent)}</span>
          <span>{formatCurrency(campaign.budget)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-400">Impressions</p>
          <p className="text-sm font-semibold text-gray-900">{formatNumber(campaign.impressions)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Clicks</p>
          <p className="text-sm font-semibold text-gray-900">{formatNumber(campaign.clicks)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">CTR</p>
          <p className="text-sm font-semibold text-gray-900">{formatPercentage(campaign.ctr)}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Calendar className="h-3.5 w-3.5" />
        <span>{formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}</span>
      </div>
    </Card>
  );
}
