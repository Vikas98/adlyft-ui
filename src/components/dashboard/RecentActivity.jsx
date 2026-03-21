import React from 'react';
import { Activity, TrendingUp, PauseCircle, CheckCircle, AlertCircle, Star } from 'lucide-react';

const icons = {
  campaign_launched: { Icon: TrendingUp, color: 'text-green-500 bg-green-50' },
  budget_alert: { Icon: AlertCircle, color: 'text-yellow-500 bg-yellow-50' },
  campaign_paused: { Icon: PauseCircle, color: 'text-orange-500 bg-orange-50' },
  invoice_paid: { Icon: CheckCircle, color: 'text-blue-500 bg-blue-50' },
  campaign_completed: { Icon: CheckCircle, color: 'text-purple-500 bg-purple-50' },
  new_publisher: { Icon: Star, color: 'text-cyan-500 bg-cyan-50' },
  milestone: { Icon: Star, color: 'text-primary-500 bg-primary-50' },
};

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const config = icons[activity.type] || { Icon: Activity, color: 'text-gray-500 bg-gray-50' };
        const { Icon, color } = config;
        return (
          <div key={activity._id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        );
      })}
      {activities.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
      )}
    </div>
  );
}
