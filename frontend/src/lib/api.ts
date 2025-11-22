import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data: any) =>
    api.put('/auth/me', data),
};

// Routes API
export const routesAPI = {
  list: (params?: any) =>
    api.get('/routes', { params }),

  create: (data: any) =>
    api.post('/routes', data),

  get: (id: string) =>
    api.get(`/routes/${id}`),

  update: (id: string, data: any) =>
    api.put(`/routes/${id}`, data),

  delete: (id: string) =>
    api.delete(`/routes/${id}`),

  browsePublic: (params?: any) =>
    api.get('/routes/public', { params }),
};

// Activities API
export const activitiesAPI = {
  list: (params?: any) =>
    api.get('/activities', { params }),

  create: (data: any) =>
    api.post('/activities', data),

  get: (id: string) =>
    api.get(`/activities/${id}`),

  update: (id: string, data: any) =>
    api.put(`/activities/${id}`, data),

  delete: (id: string) =>
    api.delete(`/activities/${id}`),

  getStats: (params?: any) =>
    api.get('/activities/stats', { params }),
};

// Workouts API
export const workoutsAPI = {
  // Get all exercises
  getExercises: (params?: any) =>
    api.get('/workouts/exercises', { params }),

  // Get last exercise weight for progressive overload
  getLastExerciseWeight: (exerciseId: string) =>
    api.get(`/workouts/exercises/${exerciseId}/last-weight`),

  // List workouts
  list: (params?: any) =>
    api.get('/workouts', { params }),

  // Create workout
  create: (data: any) =>
    api.post('/workouts', data),

  // Get single workout
  get: (id: string) =>
    api.get(`/workouts/${id}`),

  // Update workout
  update: (id: string, data: any) =>
    api.put(`/workouts/${id}`, data),

  // Delete workout
  delete: (id: string) =>
    api.delete(`/workouts/${id}`),

  // Templates
  listTemplates: () =>
    api.get('/workouts/templates'),

  createTemplate: (data: any) =>
    api.post('/workouts/templates', data),

  getTemplate: (id: string) =>
    api.get(`/workouts/templates/${id}`),

  deleteTemplate: (id: string) =>
    api.delete(`/workouts/templates/${id}`),
};

export default api;
