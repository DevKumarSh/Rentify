import api from './api';

const FAVORITES_STORAGE_KEY = 'rentify_user_favorites';

const getStoredFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredFavorites = (ids) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage quota errors
  }
};

export const favoriteService = {
  getFavorites: async (params = {}) => {
    const response = await api.get('/favorites', { params });
    const data = response.data;
    if (data && Array.isArray(data.content)) {
      const ids = data.content.map(r => r.id);
      saveStoredFavorites(ids);
    }
    return data;
  },

  addFavorite: async (roomId) => {
    const response = await api.post('/favorites', { roomId: Number(roomId) });
    const favIds = getStoredFavorites();
    if (!favIds.includes(Number(roomId))) {
      favIds.push(Number(roomId));
      saveStoredFavorites(favIds);
    }
    return response.data;
  },

  removeFavorite: async (roomId) => {
    const response = await api.delete(`/favorites/${roomId}`);
    let favIds = getStoredFavorites();
    favIds = favIds.filter(id => id !== Number(roomId));
    saveStoredFavorites(favIds);
    return response.data;
  },

  isFavorite: (roomId) => {
    const favIds = getStoredFavorites();
    return favIds.includes(Number(roomId));
  }
};
