import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCampaignApi, updateCampaignStatusApi, deleteCampaignApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const statusColors = { active: 'green', paused: 'yellow', completed: 'blue', draft: 'gray' };
const objectiveLabels = { brand_awareness: 'Brand Awareness', traffic: 'Drive Traffic', conversions: 'Conversions' };
const STATUS_OPTIONS = ['active', 'paused', 'completed', 'draft'];

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCampaignApi(id);
        setCampaign(res.data?.data || res.data);
      } catch {
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusChange = async (status) => {
    setShowStatusMenu(false);
    try {
      await updateCampaignStatusApi(id, status);
      setCampaign((c) => ({ ...c, status }));
    } catch {
      setCampaign((c) => ({ ...c, status }));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCampaignApi(id);
    } catch { /* ignore */ }
    navigate('/campaigns');
  };

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;
  if (!campaign) return null;

  const publisher = campaign.publisherId;
  const slot = campaign.slotId;
  const ad = campaign.adId;
  const totalBudget = campaign.totalBudget || campaign.budget || 0;
  const spent = campaign.spent || 0;
  const spentPercent = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/campaigns" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{campaign.name}</h1>
            <p className="text-sm text-gray-500">{objectiveLabels[campaign.objective] || campaign.objective}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/campaigns/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status & Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Campaign Overview</h2>
          <div className="relative">
            <button
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
              onClick={() => setShowStatusMenu((v) => !v)}
            >
              <Badge color={statusColors[campaign.status] || 'gray'}>{campaign.status}</Badge>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[130px]">
                {STATUS_OPTIONS.filter((s) => s !== campaign.status).map((s) => (
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
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(campaign.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(campaign.endDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Budget</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
          {campaign.dailyBudget != null && campaign.dailyBudget > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Daily Budget</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(campaign.dailyBudget)}</p>
            </div>
          )}
        </div>

        {/* Budget progress */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Budget utilization</span>
            <span>{Math.round(spentPercent)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-primary-500 rounded-full transition-all"
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Spent: {formatCurrency(spent)}</span>
            <span>Total: {formatCurrency(totalBudget)}</span>
          </div>
        </div>
      </Card>

      {/* Publisher */}
      {publisher && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Publisher</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">📱</div>
            <div>
              <p className="font-medium text-gray-900">{publisher.name || publisher}</p>
              {publisher.category && <p className="text-xs text-gray-500">{publisher.category}</p>}
              {publisher.platform && <p className="text-xs text-gray-400">{publisher.platform}</p>}
            </div>
          </div>
        </Card>
      )}

      {/* Ad Slot */}
      {slot && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Ad Slot</h2>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">{slot.name || slot}</p>
            {slot.type && (
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Type: {slot.type}</span>
                {slot.size && <span>Size: {slot.size}</span>}
                {slot.cpm && <span>CPM: ₹{slot.cpm}</span>}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Ad Creative */}
      {ad && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Ad Creative</h2>
          {ad.imageUrl || ad.url ? (
            <img
              src={ad.imageUrl || ad.url}
              alt="Ad creative"
              className="max-w-full rounded-lg border border-gray-200"
            />
          ) : (
            <p className="text-sm text-gray-500">Ad ID: {ad._id || ad}</p>
          )}
          {ad.targetUrl && (
            <p className="text-xs text-gray-400 mt-2">Target URL: {ad.targetUrl}</p>
          )}
        </Card>
      )}

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Campaign" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{campaign.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
