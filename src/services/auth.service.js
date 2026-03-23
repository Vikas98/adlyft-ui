import api from './api';

export const loginApi = (email, password) => api.post('/auth/login', { email, password });
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');
export const updateMeApi = (data) => api.put('/auth/me', data);
export const logoutApi = () => api.post('/auth/logout');
