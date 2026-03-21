import React from 'react';
import Card from '../common/Card';

export default function StatsCard({ label, value, trend, trendLabel, icon: Icon, iconColor = 'bg-primary-100 text-primary-600' }) {
  const isPositive = trend > 0;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              <span>{isPositive ? '↑' : '↓'} {Math.abs(trend)}%</span>
              {trendLabel && <span className="text-gray-400">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
