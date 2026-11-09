import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewModal from '../../components/review/ReviewModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Star, Trash2, Edit3 } from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

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
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingReview(rev)}
                  title="Edit review"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary text-danger"
                  onClick={() => handleDelete(rev.id)}
                  title="Delete review"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
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

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewModal
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          roomId={editingReview.roomId}
          initialReview={editingReview}
          onSuccess={() => {
            setEditingReview(null);
            fetchReviews();
          }}
        />
      )}
    </div>
  );
};

export default MyReviews;
