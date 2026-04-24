import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  create: async (product: any) => {
    const response = await api.post('/products', product);
    return response.data;
  },
};

export default api;
