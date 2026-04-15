import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  createRestaurant: (data) => api.post('/restaurants', data),
};

export const foodAPI = {
  getByRestaurant: (restaurantId) => api.get(`/foods/${restaurantId}`),
};

export const reviewAPI = {
  getByRestaurant: (restaurantId) => api.get(`/reviews/${restaurantId}`),
  create: (restaurantId, data) => api.post(`/reviews/${restaurantId}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user'),
  reorder: (orderId, data) => api.post(`/orders/${orderId}/reorder`, data),
};

export const paymentAPI = {
  process: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
};

export const addressAPI = {
  create: (data) => api.post('/address', data),
  getUserAddresses: () => api.get('/address/user'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
};

const API_URL = "https://your-backend.onrender.com";
export default api;


