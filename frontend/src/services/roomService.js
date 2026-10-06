import api from './api';
import { MOCK_ROOMS } from './mockData';
import { storage } from '../utils/storage';

let localRooms = [...MOCK_ROOMS];

export const roomService = {
  getRooms: async (params = {}) => {
    try {
      const response = await api.get('/rooms', { params });
      return response.data;
    } catch (err) {
      return {
        content: localRooms.filter(r => r.listingStatus === 'ACTIVE'),
        totalElements: localRooms.length,
        totalPages: 1,
        page: 0,
        size: 20
      };
    }
  },

  searchRooms: async (filters = {}) => {
    try {
      const response = await api.get('/rooms/search', { params: filters });
      return response.data;
    } catch (err) {
      let filtered = [...localRooms].filter(r => r.listingStatus === 'ACTIVE');

      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        filtered = filtered.filter(
          r => r.title.toLowerCase().includes(kw) ||
               r.description.toLowerCase().includes(kw) ||
               r.locality.toLowerCase().includes(kw) ||
               r.city.toLowerCase().includes(kw)
        );
      }

      if (filters.city && filters.city !== 'All') {
        filtered = filtered.filter(r => r.city.toLowerCase() === filters.city.toLowerCase());
      }

      if (filters.locality) {
        filtered = filtered.filter(r => r.locality.toLowerCase().includes(filters.locality.toLowerCase()));
      }

      if (filters.minRent) {
        filtered = filtered.filter(r => r.rent >= Number(filters.minRent));
      }

      if (filters.maxRent) {
        filtered = filtered.filter(r => r.rent <= Number(filters.maxRent));
      }

      if (filters.genderPreference && filters.genderPreference !== 'ANY') {
        filtered = filtered.filter(r => r.genderPreference === filters.genderPreference || r.genderPreference === 'ANY');
      }

      if (filters.furnishingStatus) {
        filtered = filtered.filter(r => r.furnishingStatus === filters.furnishingStatus);
      }

      if (filters.roomType) {
        filtered = filtered.filter(r => r.roomType === filters.roomType);
      }

      if (filters.availabilityStatus) {
        filtered = filtered.filter(r => r.availabilityStatus === filters.availabilityStatus);
      }

      // Sorting
      if (filters.sort === 'rent_asc') {
        filtered.sort((a, b) => a.rent - b.rent);
      } else if (filters.sort === 'rent_desc') {
        filtered.sort((a, b) => b.rent - a.rent);
      } else if (filters.sort === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return {
        content: filtered,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / 10) || 1,
        page: 0,
        size: 10
      };
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (err) {
      const found = localRooms.find(r => r.id === Number(id));
      if (!found) throw new Error('Room not found');
      return found;
    }
  },

  getMyOwnerRooms: async () => {
    try {
      const response = await api.get('/rooms/owner/my');
      return response.data;
    } catch (err) {
      const user = storage.getUser();
      const ownerId = user?.id || 2;
      const ownerRooms = localRooms.filter(r => r.ownerId === ownerId || r.ownerEmail === user?.email);
      return {
        content: ownerRooms,
        totalElements: ownerRooms.length
      };
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (err) {
      const user = storage.getUser();
      const newRoom = {
        id: Date.now(),
        ...roomData,
        ownerId: user?.id || 2,
        ownerName: user?.name || 'Mr. Ramesh Rao',
        ownerEmail: user?.email || 'owner@rentify.com',
        ownerPhone: '9812345678',
        averageRating: 0,
        totalReviews: 0,
        availabilityStatus: 'AVAILABLE',
        listingStatus: 'ACTIVE',
        verificationStatus: 'PENDING',
        images: roomData.images && roomData.images.length > 0 ? roomData.images : [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
        ],
        createdAt: new Date().toISOString()
      };
      localRooms = [newRoom, ...localRooms];
      return newRoom;
    }
  },

  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (err) {
      const index = localRooms.findIndex(r => r.id === Number(id));
      if (index !== -1) {
        localRooms[index] = { ...localRooms[index], ...roomData };
        return localRooms[index];
      }
      throw new Error('Room not found');
    }
  },

  deleteRoom: async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      return true;
    } catch (err) {
      localRooms = localRooms.filter(r => r.id !== Number(id));
      return true;
    }
  },

  updateAvailability: async (id, status) => {
    try {
      const response = await api.patch(`/rooms/${id}/availability`, { availabilityStatus: status });
      return response.data;
    } catch (err) {
      const room = localRooms.find(r => r.id === Number(id));
      if (room) {
        room.availabilityStatus = status;
        return room;
      }
      throw new Error('Room not found');
    }
  }
};
