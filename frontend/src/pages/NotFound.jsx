import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <AlertCircle size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', marginBottom: '2rem', lineHeight: 1.6 }}>
        The page you are looking for might have been moved, deleted, or does not exist.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return Home
        </Link>
        <Link to="/rooms" className="btn btn-secondary">
          <Search size={16} /> Explore Rooms
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
