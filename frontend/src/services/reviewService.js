import api from './api';

export const reviewService = {
  getRoomReviews: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}/reviews`);
    return response.data;
  },

  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  getSeekerReviews: async () => {
    const response = await api.get('/reviews/seeker');
    return {
      content: Array.isArray(response.data) ? response.data : [],
      totalElements: Array.isArray(response.data) ? response.data.length : 0
    };
  }
};
