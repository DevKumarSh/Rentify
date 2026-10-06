import React from 'react';
import Rating from './Rating';
import { formatDate } from '../../utils/formatters';
import { User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      marginBottom: '1rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            {review.seekerName ? review.seekerName.charAt(0) : <User size={16} />}
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {review.seekerName || 'Anonymous Seeker'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <Rating value={review.rating} readOnly size={16} />
      </div>

      <p style={{
        fontSize: '0.925rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        paddingLeft: '3.25rem'
      }}>
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
