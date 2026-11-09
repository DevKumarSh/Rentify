import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Rating from './Rating';
import { reviewService } from '../../services/reviewService';

const ReviewModal = ({ isOpen, onClose, roomId, initialReview = null, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 5);
      setComment(initialReview.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
    setError('');
  }, [initialReview, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please provide feedback of at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (initialReview?.id) {
        await reviewService.updateReview(initialReview.id, { rating, comment: comment.trim() });
      } else {
        await reviewService.addReview({ roomId, rating, comment: comment.trim() });
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialReview ? "Edit Your Property Review" : "Write a Property Review"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ textAlign: 'center', margin: '1rem 0' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Your Overall Rating
          </label>
          <Rating value={rating} onChange={setRating} size={28} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {rating === 5 ? '5/5 Stars - Excellent' : `${rating}/5 Stars`}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Review / Experience (min 10 chars)</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience regarding cleanliness, amenities, landlord communication, and safety..."
            required
            minLength={10}
            maxLength={500}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (initialReview ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
