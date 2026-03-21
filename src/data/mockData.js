// Mock data fallback when backend is offline

export const mockPublishers = [
  { _id: 'p1', name: 'MetroGo', appName: 'MetroGo', category: 'Transport', dau: 50000, rating: 4.5, slots: 4, description: 'Urban metro commuter app', logo: '🚇' },
  { _id: 'p2', name: 'GameZone', appName: 'GameZone', category: 'Gaming', dau: 120000, rating: 4.7, slots: 6, description: 'Casual gaming platform', logo: '🎮' },
  { _id: 'p3', name: 'DailyBuzz', appName: 'DailyBuzz', category: 'News', dau: 85000, rating: 4.3, slots: 5, description: 'Daily news aggregator', logo: '📰' },
  { _id: 'p4', name: 'FinTrack', appName: 'FinTrack', category: 'Finance', dau: 35000, rating: 4.6, slots: 3, description: 'Personal finance tracker', logo: '💰' },
  { _id: 'p5', name: 'FoodRush', appName: 'FoodRush', category: 'Food', dau: 95000, rating: 4.4, slots: 4, description: 'Food delivery aggregator', logo: '🍕' },
  { _id: 'p6', name: 'FitLife', appName: 'FitLife', category: 'Health', dau: 40000, rating: 4.8, slots: 4, description: 'Fitness and wellness app', logo: '🏋️' },
];

export const mockSlots = [
  { _id: 's1', publisherId: 'p1', name: 'Home Screen Banner', type: 'banner', dimensions: '320x50', price: 5000, availability: 'available' },
  { _id: 's2', publisherId: 'p1', name: 'Interstitial Full Screen', type: 'interstitial', dimensions: '320x480', price: 12000, availability: 'available' },
  { _id: 's3', publisherId: 'p1', name: 'Native Feed Ad', type: 'native', dimensions: '320x150', price: 8000, availability: 'limited' },
  { _id: 's4', publisherId: 'p1', name: 'Rewarded Video', type: 'video', dimensions: '1080x1920', price: 18000, availability: 'available' },
  { _id: 's5', publisherId: 'p2', name: 'Game Pause Banner', type: 'banner', dimensions: '320x50', price: 7000, availability: 'available' },
  { _id: 's6', publisherId: 'p2', name: 'Level Up Interstitial', type: 'interstitial', dimensions: '320x480', price: 15000, availability: 'available' },
  { _id: 's7', publisherId: 'p3', name: 'Article Header', type: 'banner', dimensions: '320x100', price: 6000, availability: 'available' },
  { _id: 's8', publisherId: 'p4', name: 'Dashboard Banner', type: 'banner', dimensions: '320x50', price: 4500, availability: 'available' },
];

export const mockCampaigns = [
  { _id: 'c1', name: 'Summer Sale 2024', status: 'active', budget: 50000, spent: 32000, impressions: 145000, clicks: 2900, ctr: 2.0, startDate: '2024-06-01', endDate: '2024-08-31', publisherName: 'MetroGo' },
  { _id: 'c2', name: 'Brand Awareness Q3', status: 'active', budget: 80000, spent: 45000, impressions: 210000, clicks: 3800, ctr: 1.8, startDate: '2024-07-01', endDate: '2024-09-30', publisherName: 'GameZone' },
  { _id: 'c3', name: 'Product Launch', status: 'paused', budget: 35000, spent: 18000, impressions: 89000, clicks: 1600, ctr: 1.8, startDate: '2024-05-15', endDate: '2024-07-15', publisherName: 'DailyBuzz' },
  { _id: 'c4', name: 'Festive Season', status: 'completed', budget: 120000, spent: 119500, impressions: 580000, clicks: 12760, ctr: 2.2, startDate: '2024-10-01', endDate: '2024-11-15', publisherName: 'FoodRush' },
  { _id: 'c5', name: 'App Install Drive', status: 'active', budget: 60000, spent: 28000, impressions: 170000, clicks: 5100, ctr: 3.0, startDate: '2024-08-01', endDate: '2024-10-31', publisherName: 'FitLife' },
  { _id: 'c6', name: 'Finance Products', status: 'draft', budget: 40000, spent: 0, impressions: 0, clicks: 0, ctr: 0, startDate: '2024-12-01', endDate: '2025-01-31', publisherName: 'FinTrack' },
];

const generateTimeseriesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * 20000) + 10000,
      clicks: Math.floor(Math.random() * 500) + 200,
      spend: Math.floor(Math.random() * 5000) + 2000,
      ctr: parseFloat((Math.random() * 2 + 1).toFixed(2)),
    });
  }
  return data;
};

export const mockTimeseries = generateTimeseriesData();

export const mockAnalyticsOverview = {
  totalImpressions: 1234567,
  totalClicks: 24691,
  avgCtr: 2.0,
  totalSpend: 245000,
  activeCampaigns: 3,
  totalPublishers: 6,
};

export const mockInvoices = [
  { _id: 'inv1', invoiceNumber: 'INV-2024-001', amount: 45000, status: 'paid', date: '2024-07-01', period: 'June 2024' },
  { _id: 'inv2', invoiceNumber: 'INV-2024-002', amount: 62000, status: 'paid', date: '2024-08-01', period: 'July 2024' },
  { _id: 'inv3', invoiceNumber: 'INV-2024-003', amount: 58000, status: 'paid', date: '2024-09-01', period: 'August 2024' },
  { _id: 'inv4', invoiceNumber: 'INV-2024-004', amount: 71000, status: 'pending', date: '2024-10-01', period: 'September 2024' },
];

export const mockActivities = [
  { _id: 'a1', type: 'campaign_launched', message: 'Campaign "Summer Sale 2024" went live', time: '2 hours ago' },
  { _id: 'a2', type: 'budget_alert', message: 'Campaign "Brand Awareness Q3" reached 50% budget', time: '5 hours ago' },
  { _id: 'a3', type: 'campaign_paused', message: 'Campaign "Product Launch" was paused', time: '1 day ago' },
  { _id: 'a4', type: 'invoice_paid', message: 'Invoice INV-2024-003 was paid', time: '2 days ago' },
  { _id: 'a5', type: 'campaign_completed', message: 'Campaign "Festive Season" completed successfully', time: '3 days ago' },
  { _id: 'a6', type: 'new_publisher', message: 'FitLife joined as a new publisher', time: '4 days ago' },
  { _id: 'a7', type: 'campaign_launched', message: 'Campaign "App Install Drive" went live', time: '5 days ago' },
  { _id: 'a8', type: 'milestone', message: 'Reached 1M impressions milestone!', time: '1 week ago' },
];

export const mockBillingOverview = {
  totalSpend: 245000,
  currentMonthSpend: 71000,
  pendingAmount: 71000,
  creditBalance: 10000,
};

export const mockProfile = {
  name: 'Demo Advertiser',
  email: 'demo@adlyft.com',
  company: 'Demo Corp',
  phone: '+91 9876543210',
  website: 'https://democorp.com',
};
