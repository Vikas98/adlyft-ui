import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adlyft_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adlyft_token');
      localStorage.removeItem('adlyft_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginApi = (email, password) => api.post('/auth/login', { email, password });
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');

// Campaigns
export const getCampaignsApi = (params) => api.get('/campaigns', { params });
export const getCampaignApi = (id) => api.get(`/campaigns/${id}`);
export const createCampaignApi = (data) => api.post('/campaigns', data);
export const updateCampaignApi = (id, data) => api.put(`/campaigns/${id}`, data);
export const updateCampaignStatusApi = (id, status) => api.put(`/campaigns/${id}/status`, { status });
export const deleteCampaignApi = (id) => api.delete(`/campaigns/${id}`);

// Publishers
export const getPublishersApi = (params) => api.get('/publishers', { params });
export const getPublisherApi = (id) => api.get(`/publishers/${id}`);
export const createPublisherApi = (data) => api.post('/publishers', data);
export const updatePublisherApi = (id, data) => api.put(`/publishers/${id}`, data);
export const deletePublisherApi = (id) => api.delete(`/publishers/${id}`);

// Slots
export const getSlotsApi = (params) => api.get('/slots', { params });
export const createSlotApi = (data) => api.post('/slots', data);
export const updateSlotApi = (id, data) => api.put(`/slots/${id}`, data);
export const deleteSlotApi = (id) => api.delete(`/slots/${id}`);

// Notifications
export const getNotificationsApi = (params) => api.get('/notifications', { params });
export const getUnreadCountApi = () => api.get('/notifications/unread-count');
export const markNotificationReadApi = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = () => api.put('/notifications/read-all');
export const deleteNotificationApi = (id) => api.delete(`/notifications/${id}`);

// Ads
export const uploadAdApi = (formData) => api.post('/ads/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Analytics
export const getAnalyticsOverviewApi = () => api.get('/analytics/overview');
export const getAnalyticsTimeseriesApi = (range) => api.get('/analytics/timeseries', { params: { range } });
export const getAnalyticsPublishersApi = () => api.get('/analytics/publishers');
export const getAnalyticsCampaignsApi = () => api.get('/analytics/campaigns');

// Billing
export const getBillingOverviewApi = () => api.get('/billing/overview');
export const getInvoicesApi = () => api.get('/billing/invoices');

// Settings
export const getProfileApi = () => api.get('/settings/profile');
export const updateProfileApi = (data) => api.put('/settings/profile', data);
export const updateNotificationsApi = (data) => api.put('/settings/notifications', data);
export const getApiKeyApi = () => api.get('/settings/api-key');
export const regenerateApiKeyApi = () => api.post('/settings/api-key/regenerate');

export default api;
