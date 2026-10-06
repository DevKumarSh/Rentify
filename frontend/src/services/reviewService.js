import api from './api';
import { MOCK_REVIEWS } from './mockData';
import { storage } from '../utils/storage';

let localReviews = [...MOCK_REVIEWS];

export const reviewService = {
  getRoomReviews: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}/reviews`);
      return response.data;
    } catch (err) {
      const reviews = localReviews.filter(r => r.roomId === Number(roomId));
      return {
        content: reviews,
        totalElements: reviews.length
      };
    }
  },

  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (err) {
      const user = storage.getUser() || { id: 1, name: 'Aarav Sharma' };
      const newReview = {
        id: Date.now(),
        roomId: Number(reviewData.roomId),
        seekerId: user.id,
        seekerName: user.name,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        createdAt: new Date().toISOString()
      };
      localReviews = [newReview, ...localReviews];
      return newReview;
    }
  },

  getSeekerReviews: async () => {
    const user = storage.getUser();
    const seekerId = user?.id || 1;
    return localReviews.filter(r => r.seekerId === seekerId);
  },

  deleteReview: async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      return true;
    } catch (err) {
      localReviews = localReviews.filter(r => r.id !== Number(id));
      return true;
    }
  }
};
