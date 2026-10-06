import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', size = 32 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '1rem',
      color: 'var(--primary)'
    }}>
      <Loader2 size={size} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {message && <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
