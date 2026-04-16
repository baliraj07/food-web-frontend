import axios from 'axios';

// For Vite, use import.meta.env, not process.env
const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  console.error('VITE_API_BASE environment variable is not set!');
}

const api = axios.create({
  baseURL: API_BASE,
});

// ... rest of your code (interceptors, etc.) stays the same


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ✅ Restaurant
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  createRestaurant: (data) => api.post('/restaurants', data),
};

// ✅ Orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user'),
  reorder: (orderId, data) => api.post(`/orders/${orderId}/reorder`, data),
};

// ✅ User
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
};

// ✅ Review
export const reviewAPI = {
  getByRestaurant: (id) => api.get(`/reviews/${id}`),
  create: (id, data) => api.post(`/reviews/${id}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ✅ Payment
export const paymentAPI = {
  process: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
};

// ✅ Address
export const addressAPI = {
  create: (data) => api.post('/address', data),
  getUserAddresses: () => api.get('/address/user'),
};

export default api;