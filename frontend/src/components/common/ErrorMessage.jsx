import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div style={{
      backgroundColor: 'var(--danger-light)',
      border: '1px solid #fecaca',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      margin: '1rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)' }}>
        <AlertCircle size={24} />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>Error</h4>
          <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.1rem' }}>{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm btn-secondary"
          style={{ borderColor: '#fca5a5', color: '#991b1b' }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
