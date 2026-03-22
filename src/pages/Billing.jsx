import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import BillingOverview from '../components/billing/BillingOverview';
import InvoiceTable from '../components/billing/InvoiceTable';
import PaymentMethods from '../components/billing/PaymentMethods';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { getBillingOverviewApi, getInvoicesApi } from '../services/api';
import { mockBillingOverview, mockInvoices } from '../data/mockData';
import { getErrorMessage } from '../services/api';

export default function Billing() {
  const [overview, setOverview] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ovRes, invRes] = await Promise.all([getBillingOverviewApi(), getInvoicesApi()]);
      setOverview(ovRes.data);
      setInvoices(invRes.data.invoices || invRes.data || []);
      setIsDemo(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (!navigator.onLine || msg.includes('Network')) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, invRes] = await Promise.all([getBillingOverviewApi(), getInvoicesApi()]);
        setOverview(ovRes.data?.data || ovRes.data || {});
        const rawInvoices = invRes.data?.data;
        setInvoices(Array.isArray(rawInvoices) ? rawInvoices : []);
      } catch {
        setOverview(mockBillingOverview);
        setInvoices(mockInvoices);
        setIsDemo(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner className="h-64" size="lg" />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Failed to load billing information</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchData}><RefreshCw className="h-4 w-4" />Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700"><strong>Demo Mode</strong> — Showing mock data.</p>
        </div>
      )}

      <BillingOverview overview={overview} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Invoices</h2>
          <InvoiceTable invoices={invoices} />
        </Card>
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <PaymentMethods />
        </Card>
      </div>
    </div>
  );
}
