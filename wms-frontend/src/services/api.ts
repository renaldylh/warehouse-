import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export const productService = {
  getAll: async (search = '', category = '') => {
    const response = await api.get(`/products?search=${search}&category=${category}`);
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
  exportCSV: () => {
    window.open(`${API_URL}/products/export/csv`, '_blank');
  }
};

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  create: async (order: any) => {
    const response = await api.post('/orders', order);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const receivingService = {
  getAll: async () => {
    const response = await api.get('/receiving');
    return response.data;
  },
  create: async (receiving: any) => {
    const response = await api.post('/receiving', receiving);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/receiving/${id}`);
    return response.data;
  },
};

export const shippingService = {
  getAll: async () => {
    const response = await api.get('/shipping');
    return response.data;
  },
  create: async (shipping: any) => {
    const response = await api.post('/shipping', shipping);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/shipping/${id}`);
    return response.data;
  },
};

export const masterDataService = {
  getSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  createSupplier: async (data: any) => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  createCustomer: async (data: any) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  getWarehouses: async () => {
    const response = await api.get('/warehouses');
    return response.data;
  },
  createWarehouse: async (data: any) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },
};

export const marketplaceService = {
  sync: async (marketplace: string) => {
    const response = await api.post(`/marketplace/sync/${marketplace}`);
    return response.data;
  },
};

export default api;
