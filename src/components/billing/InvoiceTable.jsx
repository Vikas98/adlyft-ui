import React from 'react';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Download } from 'lucide-react';

export default function InvoiceTable({ invoices = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">Invoice #</th>
            <th className="pb-3 font-medium">Period</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td className="py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
              <td className="py-3 text-gray-600">{inv.period}</td>
              <td className="py-3 text-gray-600">{formatDate(inv.date)}</td>
              <td className="py-3 font-medium text-gray-900">{formatCurrency(inv.amount)}</td>
              <td className="py-3">
                <Badge color={inv.status === 'paid' ? 'green' : 'yellow'}>{inv.status}</Badge>
              </td>
              <td className="py-3">
                <button className="text-gray-400 hover:text-primary-600 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
