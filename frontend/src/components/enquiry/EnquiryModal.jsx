import React, { useState } from 'react';
import Modal from '../common/Modal';
import { enquiryService } from '../../services/enquiryService';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle2 } from 'lucide-react';

const EnquiryModal = ({ isOpen, onClose, room, onSuccess }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState(
    `Hello, I am interested in renting this room (${room?.title}). I would like to schedule a visit. Please let me know suitable times.`
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write an enquiry message');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await enquiryService.sendEnquiry(room.id, message);
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enquire about: ${room?.title?.substring(0, 40)}...`}>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065f46' }}>Enquiry Sent Successfully!</h4>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            The owner ({room?.ownerName || 'Landlord'}) has received your enquiry and will respond through the platform.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem'
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Recipient: {room?.ownerName || 'Room Owner'}</p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Locality: {room?.locality}, {room?.city} | Rent: ₹{room?.rent}/mo</p>
          </div>

          <div className="form-group">
            <label className="form-label">Your Message to Owner</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, desired move-in date, or questions..."
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Sending...' : 'Send Enquiry'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
