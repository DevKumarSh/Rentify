import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewCard from '../../components/review/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Star, Trash2 } from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getSeekerReviews();
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await reviewService.deleteReview(id);
      fetchReviews();
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Property Reviews</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ratings and feedback you've shared to assist other student seekers.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your reviews..." />
      ) : reviews.length > 0 ? (
        <div>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ position: 'relative' }}>
              <ReviewCard review={rev} />
              <button
                type="button"
                className="btn btn-sm btn-secondary text-danger"
                style={{ position: 'absolute', top: 12, right: 12 }}
                onClick={() => handleDelete(rev.id)}
                title="Delete review"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <Star size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No reviews written yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            After staying at or visiting a room, leave a helpful review for fellow students!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
