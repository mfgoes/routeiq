import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ email, password, firstName, lastName });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await authAPI.getMe();
      const { user } = response.data;
      set({ user, isLoading: false });
    } catch (error) {
      set({ user: null, token: null, isLoading: false });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  clearError: () => set({ error: null }),
}));
