import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

const statusColors = { active: 'green', paused: 'yellow', completed: 'blue', draft: 'gray' };
const objectiveLabels = { brand_awareness: 'Brand Awareness', traffic: 'Drive Traffic', conversions: 'Conversions' };

export default function CampaignCard({ campaign, onStatusChange, onDelete }) {
  const navigate = useNavigate();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const totalBudget = campaign.totalBudget || campaign.budget || 0;
  const spent = campaign.spent || 0;
  const spentPercent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

  const statusOptions = ['active', 'paused', 'completed', 'draft'].filter((s) => s !== campaign.status);

  const handleStatusChange = async (status) => {
    setShowStatusMenu(false);
    await onStatusChange?.(campaign._id, status);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete?.(campaign._id);
    setDeleting(false);
    setShowDeleteModal(false);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('[data-no-navigate]')) return;
    navigate(`/campaigns/${campaign._id}`);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
            {campaign.publisherName && <p className="text-xs text-gray-400 mt-0.5">{campaign.publisherName}</p>}
            {campaign.objective && (
              <p className="text-xs text-gray-400 mt-0.5">{objectiveLabels[campaign.objective] || campaign.objective}</p>
            )}
          </div>
          <div className="flex items-center gap-2" data-no-navigate>
            <div className="relative">
              <button
                className="flex items-center gap-1"
                onClick={(e) => { e.stopPropagation(); setShowStatusMenu((v) => !v); }}
              >
                <Badge color={statusColors[campaign.status] || 'gray'}>{campaign.status}</Badge>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 capitalize"
                      onClick={() => handleStatusChange(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
              title="Delete campaign"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
            <span>{formatCurrency(spent)}</span>
            <span>{formatCurrency(totalBudget)}</span>
          </div>
        </div>

        {/* Budget details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400">Total Budget</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
          {campaign.dailyBudget != null && campaign.dailyBudget > 0 && (
            <div>
              <p className="text-xs text-gray-400">Daily Budget</p>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.dailyBudget)}</p>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}</span>
        </div>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Campaign" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{campaign.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
