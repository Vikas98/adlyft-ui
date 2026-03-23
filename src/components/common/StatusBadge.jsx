import React from 'react';

const statusConfig = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Active' },
  paused: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Paused' },
  blocked: { bg: 'bg-red-100', text: 'text-red-800', label: 'Blocked' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Inactive' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
