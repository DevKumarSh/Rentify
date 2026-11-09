import api from './api';

export const adminService = {
  getDashboardMetrics: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/disable`);
    return response.data;
  },

  verifyUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
  },

  getAllListings: async (params = {}) => {
    const response = await api.get('/admin/listings', { params });
    return response.data;
  },

  verifyListing: async (roomId, verificationStatus, remark = '') => {
    const response = await api.put(`/admin/listings/${roomId}/verify`, { verificationStatus, remark });
    return response.data;
  },

  deleteListing: async (roomId) => {
    const response = await api.delete(`/admin/listings/${roomId}`);
    return response.data;
  }
};
