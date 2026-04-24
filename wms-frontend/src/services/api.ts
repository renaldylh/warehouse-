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
  update: async (id: number, product: any) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
};

export const receivingService = {
  getAll: async () => {
    const response = await api.get('/receiving');
    return response.data;
  },
};

export const shippingService = {
  getAll: async () => {
    const response = await api.get('/shipping');
    return response.data;
  },
};

export default api;
