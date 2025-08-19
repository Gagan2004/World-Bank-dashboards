import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (username, password) =>
  api.post('/token/', { username, password });

export const getFilterOptions = () => api.get('/filter-options/');

export const getWorldData = (params) =>
  api.get('/world-data/', { params });

export default api;
