export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/campaigns', label: 'Campaigns', icon: 'Megaphone' },
  { path: '/publishers', label: 'Publishers', icon: 'Building2' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/billing', label: 'Billing', icon: 'CreditCard' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const ROLE_NAV_ITEMS = {
  admin: [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', exact: true },
    { path: '/campaigns', label: 'Campaigns', icon: 'Megaphone' },
    { path: '/publishers', label: 'Publishers', icon: 'Building2' },
    { path: '/users', label: 'Users', icon: 'Users' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/billing', label: 'Billing', icon: 'CreditCard' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  advertiser: [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', exact: true },
    { path: '/campaigns', label: 'Campaigns', icon: 'Megaphone' },
    { path: '/publishers', label: 'Publishers', icon: 'Building2' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/billing', label: 'Billing', icon: 'CreditCard' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  publisher: [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', exact: true },
    { path: '/my-slots', label: 'My Ad Slots', icon: 'Layout' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/billing', label: 'Billing', icon: 'CreditCard' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
};

export const ROLE_LABELS = {
  admin: 'Admin',
  advertiser: 'Advertiser',
  publisher: 'Publisher',
};

export const ROLE_COLORS = {
  admin: 'purple',
  advertiser: 'blue',
  publisher: 'green',
};

export const PORTAL_NAMES = {
  admin: 'Admin Portal',
  advertiser: 'Advertiser Portal',
  publisher: 'Publisher Portal',
};

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
