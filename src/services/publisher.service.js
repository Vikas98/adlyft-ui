import api from './api';

export const getPublisherStats = () => api.get('/publisher/dashboard/stats');
export const getMySlots = () => api.get('/publisher/slots');
export const createSlot = (data) => api.post('/publisher/slots', data);
export const getSlot = (id) => api.get(`/publisher/slots/${id}`);
export const updateSlot = (id, data) => api.put(`/publisher/slots/${id}`, data);
export const deleteSlot = (id) => api.delete(`/publisher/slots/${id}`);
export const toggleSlot = (id) => api.put(`/publisher/slots/${id}/toggle`);
export const getRunningAds = () => api.get('/publisher/ads');
export const getPublisherAnalytics = () => api.get('/publisher/analytics/overview');
export const getSlotAnalytics = () => api.get('/publisher/analytics/slots');
export const getEarnings = () => api.get('/publisher/earnings');
