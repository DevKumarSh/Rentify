import api from './api';
import { MOCK_REPORTS } from './mockData';
import { storage } from '../utils/storage';

let localReports = [...MOCK_REPORTS];

export const reportService = {
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (err) {
      const user = storage.getUser() || { id: 1, name: 'Aarav Sharma' };
      const newReport = {
        id: Date.now(),
        roomId: Number(reportData.roomId),
        roomTitle: reportData.roomTitle || 'Room Listing',
        seekerId: user.id,
        seekerName: user.name,
        reason: reportData.reason,
        description: reportData.description,
        status: 'OPEN',
        adminRemark: null,
        createdAt: new Date().toISOString()
      };
      localReports = [newReport, ...localReports];
      return newReport;
    }
  },

  getReports: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports', { params });
      return response.data;
    } catch (err) {
      return {
        content: localReports,
        totalElements: localReports.length
      };
    }
  },

  resolveReport: async (id, adminRemark, status = 'RESOLVED') => {
    try {
      const response = await api.put(`/admin/reports/${id}`, { adminRemark, status });
      return response.data;
    } catch (err) {
      const report = localReports.find(r => r.id === Number(id));
      if (report) {
        report.adminRemark = adminRemark;
        report.status = status;
        return report;
      }
      throw new Error('Report not found');
    }
  }
};
