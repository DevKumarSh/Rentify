import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ roomId, initialIsFavorite = false, onToggle }) => {
  const { isAuthenticated, isSeeker } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || favoriteService.isFavorite(roomId));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isSeeker) {
      alert('Only Room Seekers can save favorite rooms. Switch to Seeker persona to test!');
      return;
    }

    setLoading(true);
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    try {
      if (nextState) {
        await favoriteService.addFavorite(roomId);
      } else {
        await favoriteService.removeFavorite(roomId);
      }
      if (onToggle) onToggle(nextState);
    } catch (err) {
      // Revert optimistic update
      setIsFavorite(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'transform 0.15s ease, background-color 0.15s ease',
        color: isFavorite ? '#ef4444' : '#64748b'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Heart
        size={18}
        fill={isFavorite ? '#ef4444' : 'none'}
        stroke={isFavorite ? '#ef4444' : 'currentColor'}
      />
    </button>
  );
};

export default FavoriteButton;
