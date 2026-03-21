export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/campaigns', label: 'Campaigns', icon: 'Megaphone' },
  { path: '/publishers', label: 'Publishers', icon: 'Building2' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/billing', label: 'Billing', icon: 'CreditCard' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const CAMPAIGN_STATUSES = {
  active: { label: 'Active', color: 'green' },
  paused: { label: 'Paused', color: 'yellow' },
  completed: { label: 'Completed', color: 'blue' },
  draft: { label: 'Draft', color: 'gray' },
};

export const PUBLISHER_CATEGORIES = ['All', 'Transport', 'Gaming', 'News', 'Finance', 'Food', 'Health', 'Education', 'Entertainment'];

export const AD_TYPES = ['banner', 'interstitial', 'native', 'video'];

export const CAMPAIGN_STEPS = [
  'Campaign Details',
  'Select Publisher',
  'Choose Ad Slot',
  'Upload Creative',
  'Review & Launch',
];
