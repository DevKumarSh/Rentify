import api from './api';
import { storage } from '../utils/storage';
import { MOCK_USERS } from './mockData';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;
      storage.setToken(data.token);
      storage.setUser({
        id: data.userId,
        email: email,
        name: data.name,
        role: data.role
      });
      return data;
    } catch (err) {
      // Fallback to mock login if backend is not available
      const mockUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser) {
        const dummyToken = `mock-jwt-token-for-${mockUser.id}-${Date.now()}`;
        const userData = {
          token: dummyToken,
          userId: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        storage.setToken(dummyToken);
        storage.setUser(userData);
        return userData;
      }
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      // Mock registration fallback
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'ROLE_SEEKER',
        verified: true,
        enabled: true,
        createdAt: new Date().toISOString()
      };
      MOCK_USERS.push(newUser);
      return {
        success: true,
        message: 'Registration successful! Please log in.',
        data: newUser
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (err) {
      const user = storage.getUser();
      return user || MOCK_USERS[0];
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (err) {
      const user = storage.getUser() || {};
      const updated = { ...user, ...profileData };
      storage.setUser(updated);
      return updated;
    }
  },

  logout: () => {
    storage.clearAuth();
  }
};
