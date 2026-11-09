import api from './api';

export const enquiryService = {
  sendEnquiry: async (roomId, message) => {
    const response = await api.post('/enquiries', { roomId, message });
    return response.data;
  },

  getEnquiryById: async (id) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  },

  getSeekerEnquiries: async (params = {}) => {
    const response = await api.get('/enquiries/seeker', { params });
    return response.data;
  },

  getOwnerEnquiries: async (params = {}) => {
    const response = await api.get('/enquiries/owner', { params });
    return response.data;
  },

  respondToEnquiry: async (enquiryId, responseText) => {
    const response = await api.put(`/enquiries/${enquiryId}/respond`, { response: responseText });
    return response.data;
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    const response = await api.put(`/enquiries/${enquiryId}/status`, { status });
    return response.data;
  }
};
