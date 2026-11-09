import api from './api';
import { storage } from '../utils/storage';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;
      storage.setToken(data.token);
      storage.setUser({
        id: data.userId,
        email: data.email || email,
        name: data.name,
        role: data.role
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid credentials';
      throw new Error(message);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(message);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to request password reset';
      throw new Error(message);
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to reset password';
      throw new Error(message);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        storage.setUser(response.data);
      }
      return response.data;
    } catch (err) {
      return storage.getUser();
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      if (response.data) {
        storage.setUser(response.data);
      }
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile';
      throw new Error(message);
    }
  },

  logout: () => {
    storage.clearAuth();
  }
};
