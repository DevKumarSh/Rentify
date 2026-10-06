import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquare, CheckCircle, Clock, User, Reply } from 'lucide-react';
import './EnquiryCard.css';

const EnquiryCard = ({ enquiry, isOwnerView = false, onRespond }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await onRespond(enquiry.id, replyText);
      setShowReplyBox(false);
      setReplyText('');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'RESPONDED') {
      return <span className="badge badge-success"><CheckCircle size={12} /> Responded</span>;
    }
    if (status === 'CLOSED') {
      return <span className="badge badge-neutral">Closed</span>;
    }
    return <span className="badge badge-warning"><Clock size={12} /> Pending</span>;
  };

  return (
    <div className="card enquiry-card">
      <div className="enquiry-card-header">
        <div>
          <h4 className="enquiry-room-title">
            <Link to={`/rooms/${enquiry.roomId}`}>{enquiry.roomTitle}</Link>
          </h4>
          <span className="enquiry-date">{formatDateTime(enquiry.createdAt)}</span>
        </div>
        <div>{getStatusBadge(enquiry.status)}</div>
      </div>

      <div className="enquiry-card-body">
        {/* Seeker Info */}
        <div className="enquiry-user-info">
          <div className="enquiry-avatar">
            <User size={16} />
          </div>
          <div>
            <p className="enquiry-user-name">
              {isOwnerView ? enquiry.seekerName : 'Your Enquiry'}
            </p>
            {isOwnerView && (
              <p className="enquiry-user-contact">
                Phone: {enquiry.seekerPhone} | Email: {enquiry.seekerEmail}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="enquiry-message-box">
          <p className="enquiry-message-text">"{enquiry.message}"</p>
        </div>

        {/* Owner's Response if available */}
        {enquiry.response && (
          <div className="enquiry-response-box">
            <div className="response-header">
              <Reply size={14} color="var(--primary)" />
              <span className="response-label">Owner Response ({formatDateTime(enquiry.respondedAt)})</span>
            </div>
            <p className="response-text">{enquiry.response}</p>
          </div>
        )}

        {/* Owner Action to Respond */}
        {isOwnerView && !enquiry.response && (
          <div className="enquiry-owner-action">
            {!showReplyBox ? (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setShowReplyBox(true)}
              >
                <Reply size={14} /> Respond to Tenant
              </button>
            ) : (
              <form onSubmit={handleSendResponse} className="reply-form">
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Type your response to the prospective tenant..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
                <div className="reply-form-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowReplyBox(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryCard;
