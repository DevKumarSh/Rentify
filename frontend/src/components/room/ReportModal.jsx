import React, { useState } from 'react';
import Modal from '../common/Modal';
import { reportService } from '../../services/reportService';
import { REPORT_REASONS } from '../../utils/constants';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, room }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await reportService.createReport({
        roomId: room.id,
        roomTitle: room.title,
        reason,
        description
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Listing">
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065f46' }}>Report Submitted</h4>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Our moderation team will review this listing shortly. Thank you for keeping RentiFy safe!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem'
          }}>
            <AlertOctagon size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Flag this listing for review by platform administrators
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Flagging</label>
            <select
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Details / Evidence (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why this room listing is inaccurate, misleading, or violates rules..."
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReportModal;
