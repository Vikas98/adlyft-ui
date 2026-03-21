import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const statusColors = { active: 'green', paused: 'yellow', completed: 'blue', draft: 'gray' };

export default function CampaignTable({ campaigns = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">Campaign</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Budget</th>
            <th className="pb-3 font-medium">Impressions</th>
            <th className="pb-3 font-medium">Clicks</th>
            <th className="pb-3 font-medium">CTR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {campaigns.map((c) => (
            <tr key={c._id} className="py-3">
              <td className="py-3">
                <Link to="/campaigns" className="font-medium text-gray-900 hover:text-primary-600">{c.name}</Link>
                {c.publisherName && <p className="text-xs text-gray-400">{c.publisherName}</p>}
              </td>
              <td className="py-3"><Badge color={statusColors[c.status] || 'gray'}>{c.status}</Badge></td>
              <td className="py-3 text-gray-700">{formatCurrency(c.budget)}</td>
              <td className="py-3 text-gray-700">{formatNumber(c.impressions)}</td>
              <td className="py-3 text-gray-700">{formatNumber(c.clicks)}</td>
              <td className="py-3 text-gray-700">{formatPercentage(c.ctr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {campaigns.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">No campaigns found</div>
      )}
    </div>
  );
}
