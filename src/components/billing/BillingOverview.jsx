import React from 'react';
import StatsCard from '../dashboard/StatsCard';
import { DollarSign, TrendingUp, Clock, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function BillingOverview({ overview }) {
  if (!overview) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard label="Total Spend" value={formatCurrency(overview.totalSpend)} icon={DollarSign} iconColor="bg-blue-100 text-blue-600" />
      <StatsCard label="This Month" value={formatCurrency(overview.currentMonthSpend)} icon={TrendingUp} iconColor="bg-green-100 text-green-600" />
      <StatsCard label="Pending Amount" value={formatCurrency(overview.pendingAmount)} icon={Clock} iconColor="bg-yellow-100 text-yellow-600" />
      <StatsCard label="Credit Balance" value={formatCurrency(overview.creditBalance)} icon={CreditCard} iconColor="bg-purple-100 text-purple-600" />
    </div>
  );
}
