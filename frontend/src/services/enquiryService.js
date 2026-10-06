import api from './api';
import { MOCK_ENQUIRIES, MOCK_ROOMS } from './mockData';
import { storage } from '../utils/storage';

let localEnquiries = [...MOCK_ENQUIRIES];

export const enquiryService = {
  sendEnquiry: async (roomId, message) => {
    try {
      const response = await api.post('/enquiries', { roomId, message });
      return response.data;
    } catch (err) {
      const user = storage.getUser() || { id: 1, name: 'Aarav Sharma', email: 'seeker@rentify.com', phone: '9876543210' };
      const room = MOCK_ROOMS.find(r => r.id === Number(roomId)) || MOCK_ROOMS[0];
      const newEnquiry = {
        id: Date.now(),
        roomId: Number(roomId),
        roomTitle: room.title,
        roomCity: room.city,
        roomRent: room.rent,
        seekerId: user.id,
        seekerName: user.name,
        seekerEmail: user.email,
        seekerPhone: user.phone || '9876543210',
        ownerId: room.ownerId || 2,
        message,
        response: null,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        respondedAt: null
      };
      localEnquiries = [newEnquiry, ...localEnquiries];
      return newEnquiry;
    }
  },

  getSeekerEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/enquiries/seeker', { params });
      return response.data;
    } catch (err) {
      const user = storage.getUser();
      const seekerId = user?.id || 1;
      const filtered = localEnquiries.filter(e => e.seekerId === seekerId || e.seekerEmail === user?.email);
      return {
        content: filtered,
        totalElements: filtered.length
      };
    }
  },

  getOwnerEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/enquiries/owner', { params });
      return response.data;
    } catch (err) {
      const user = storage.getUser();
      const ownerId = user?.id || 2;
      const filtered = localEnquiries.filter(e => e.ownerId === ownerId);
      return {
        content: filtered,
        totalElements: filtered.length
      };
    }
  },

  respondToEnquiry: async (enquiryId, responseText) => {
    try {
      const response = await api.put(`/enquiries/${enquiryId}/respond`, { response: responseText });
      return response.data;
    } catch (err) {
      const enquiry = localEnquiries.find(e => e.id === Number(enquiryId));
      if (enquiry) {
        enquiry.response = responseText;
        enquiry.status = 'RESPONDED';
        enquiry.respondedAt = new Date().toISOString();
        return enquiry;
      }
      throw new Error('Enquiry not found');
    }
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    try {
      const response = await api.put(`/enquiries/${enquiryId}/status`, { status });
      return response.data;
    } catch (err) {
      const enquiry = localEnquiries.find(e => e.id === Number(enquiryId));
      if (enquiry) {
        enquiry.status = status;
        return enquiry;
      }
      throw new Error('Enquiry not found');
    }
  }
};
