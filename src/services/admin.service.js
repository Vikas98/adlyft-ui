import api from './api';

// Dashboard
export const getAdminStats = () => api.get('/admin/dashboard/stats');

// Publishers
export const getPublishers = (params) => api.get('/admin/publishers', { params });
export const getPublisher = (id) => api.get(`/admin/publishers/${id}`);
export const approvePublisher = (id) => api.put(`/admin/publishers/${id}/approve`);
export const rejectPublisher = (id, reason) => api.put(`/admin/publishers/${id}/reject`, { reason });
export const blockPublisher = (id) => api.put(`/admin/publishers/${id}/block`);
export const deletePublisher = (id) => api.delete(`/admin/publishers/${id}`);

// Advertisers
export const getAdvertisers = (params) => api.get('/admin/advertisers', { params });
export const getAdvertiser = (id) => api.get(`/admin/advertisers/${id}`);
export const blockAdvertiser = (id) => api.put(`/admin/advertisers/${id}/block`);

// Ads (approval queue)
export const getAds = (params) => api.get('/admin/ads', { params });
export const getAd = (id) => api.get(`/admin/ads/${id}`);
export const approveAd = (id) => api.put(`/admin/ads/${id}/approve`);
export const rejectAd = (id, note) => api.put(`/admin/ads/${id}/reject`, { adminNote: note });

// Slots
export const getAllSlots = (params) => api.get('/admin/slots', { params });
export const deleteSlot = (id) => api.delete(`/admin/slots/${id}`);

// Campaigns
export const getAllCampaigns = (params) => api.get('/admin/campaigns', { params });

// Users
export const getUsers = (params) => api.get('/admin/users', { params });
export const blockUser = (id) => api.put(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.put(`/admin/users/${id}/unblock`);

// Analytics
export const getAdminAnalytics = (params) => api.get('/admin/analytics/overview', { params });
