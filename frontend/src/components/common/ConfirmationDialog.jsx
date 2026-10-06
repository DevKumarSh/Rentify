import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        {isDangerous && (
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={36} />
          </div>
        )}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {message}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
