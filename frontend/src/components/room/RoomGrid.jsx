import React from 'react';
import RoomCard from './RoomCard';
import { Home } from 'lucide-react';

const RoomGrid = ({ rooms = [], loading = false, onFavoriteToggle, emptyMessage = 'No rooms found matching your search criteria.' }) => {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card" style={{ height: '360px', overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: '200px', width: '100%' }} />
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="skeleton" style={{ height: '14px', width: '40%' }} />
              <div className="skeleton" style={{ height: '20px', width: '85%' }} />
              <div className="skeleton" style={{ height: '14px', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--border-medium)',
        margin: '1.5rem 0',
        width: '100%'
      }}>
        <div style={{
          display: 'inline-flex',
          padding: '1.25rem',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          marginBottom: '1rem'
        }}>
          <Home size={36} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Listings Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
      gap: '1.5rem',
      width: '100%'
    }}>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};

export default RoomGrid;
