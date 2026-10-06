import React, { useState, useEffect } from 'react';
import { favoriteService } from '../../services/favoriteService';
import RoomGrid from '../../components/room/RoomGrid';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getFavorites();
      setFavorites(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Saved Room Listings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Keep track of rooms you've bookmarked to compare and enquire.
          </p>
        </div>
        <span className="badge badge-primary">
          <Heart size={14} /> {favorites.length} Saved
        </span>
      </div>

      <RoomGrid
        rooms={favorites}
        loading={loading}
        onFavoriteToggle={fetchFavorites}
        emptyMessage="You haven't saved any rooms to your favorites yet."
      />
    </div>
  );
};

export default Favorites;
