import api from './api';
import { MOCK_USERS, MOCK_ADMIN_METRICS, MOCK_ROOMS } from './mockData';

let localUsers = [...MOCK_USERS];
let localRooms = [...MOCK_ROOMS];

export const adminService = {
  getDashboardMetrics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (err) {
      return {
        ...MOCK_ADMIN_METRICS,
        totalUsers: localUsers.length,
        totalListings: localRooms.length,
        activeListings: localRooms.filter(r => r.listingStatus === 'ACTIVE').length
      };
    }
  },

  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (err) {
      return {
        content: localUsers,
        totalElements: localUsers.length
      };
    }
  },

  toggleUserStatus: async (userId, enabled) => {
    try {
      const response = await api.put(`/admin/users/${userId}/disable`);
      return response.data;
    } catch (err) {
      const user = localUsers.find(u => u.id === Number(userId));
      if (user) {
        user.enabled = enabled !== undefined ? enabled : !user.enabled;
        return user;
      }
      throw new Error('User not found');
    }
  },

  verifyUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/verify`);
      return response.data;
    } catch (err) {
      const user = localUsers.find(u => u.id === Number(userId));
      if (user) {
        user.verified = true;
        return user;
      }
      throw new Error('User not found');
    }
  },

  getAllListings: async (params = {}) => {
    try {
      const response = await api.get('/admin/listings', { params });
      return response.data;
    } catch (err) {
      return {
        content: localRooms,
        totalElements: localRooms.length
      };
    }
  },

  verifyListing: async (roomId, verificationStatus, remark = '') => {
    try {
      const response = await api.put(`/admin/listings/${roomId}/verify`, { verificationStatus, remark });
      return response.data;
    } catch (err) {
      const room = localRooms.find(r => r.id === Number(roomId));
      if (room) {
        room.verificationStatus = verificationStatus;
        return room;
      }
      throw new Error('Room not found');
    }
  },

  deleteListing: async (roomId) => {
    try {
      await api.delete(`/admin/listings/${roomId}`);
      return true;
    } catch (err) {
      localRooms = localRooms.filter(r => r.id !== Number(roomId));
      return true;
    }
  }
};
