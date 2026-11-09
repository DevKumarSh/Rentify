import api from './api';

export const roomService = {
  getRooms: async (params = {}) => {
    const response = await api.get('/rooms', { params });
    return response.data;
  },

  searchRooms: async (filters = {}) => {
    const response = await api.get('/rooms/search', { params: filters });
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  getMyOwnerRooms: async (params = {}) => {
    const response = await api.get('/rooms/owner/my', { params });
    return response.data;
  },

  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    await api.delete(`/rooms/${id}`);
    return true;
  },

  updateAvailability: async (id, status) => {
    const response = await api.patch(`/rooms/${id}/availability`, { availabilityStatus: status });
    return response.data;
  },

  uploadImages: async (roomId, formData) => {
    const response = await api.post(`/rooms/${roomId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteImage: async (roomId, imageId) => {
    await api.delete(`/rooms/${roomId}/images/${imageId}`);
    return true;
  }
};
