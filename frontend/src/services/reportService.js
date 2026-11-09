import api from './api';

export const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  resolveReport: async (id, adminRemark, status = 'RESOLVED') => {
    const response = await api.put(`/admin/reports/${id}`, { adminRemark, status });
    return response.data;
  }
};
