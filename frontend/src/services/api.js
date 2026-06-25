import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const boardApi = {
  getAll: () => api.get('/boards'),
  getOne: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
};

export const taskApi = {
  getAll: (boardId, params) => api.get(`/boards/${boardId}/tasks`, { params }),
  create: (boardId, data) => api.post(`/boards/${boardId}/tasks`, data),
  update: (boardId, id, data) => api.put(`/boards/${boardId}/tasks/${id}`, data),
  move: (boardId, id, data) => api.patch(`/boards/${boardId}/tasks/${id}/move`, data),
  delete: (boardId, id) => api.delete(`/boards/${boardId}/tasks/${id}`),
  getStats: (boardId) => api.get(`/boards/${boardId}/tasks/stats`),
};

export const aiApi = {
  suggestEstimate: (data) => api.post('/ai/suggest-estimate', data),
};

export default api;
