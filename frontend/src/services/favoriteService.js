import api from './api';
import { MOCK_ROOMS } from './mockData';

const FAVORITES_STORAGE_KEY = 'rentify_user_favorites';

const getStoredFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [1, 2];
  } catch {
    return [1, 2];
  }
};

const saveStoredFavorites = (ids) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
};

export const favoriteService = {
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (err) {
      const favIds = getStoredFavorites();
      const rooms = MOCK_ROOMS.filter(r => favIds.includes(r.id));
      return {
        content: rooms,
        totalElements: rooms.length
      };
    }
  },

  addFavorite: async (roomId) => {
    try {
      const response = await api.post('/favorites', { roomId });
      return response.data;
    } catch (err) {
      const favIds = getStoredFavorites();
      if (!favIds.includes(Number(roomId))) {
        favIds.push(Number(roomId));
        saveStoredFavorites(favIds);
      }
      return { success: true, message: 'Added to favorites' };
    }
  },

  removeFavorite: async (roomId) => {
    try {
      await api.delete(`/favorites/${roomId}`);
      return { success: true };
    } catch (err) {
      let favIds = getStoredFavorites();
      favIds = favIds.filter(id => id !== Number(roomId));
      saveStoredFavorites(favIds);
      return { success: true };
    }
  },

  isFavorite: (roomId) => {
    const favIds = getStoredFavorites();
    return favIds.includes(Number(roomId));
  }
};
