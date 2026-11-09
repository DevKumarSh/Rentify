import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { enquiryService } from '../../services/enquiryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  User,
  Phone,
  Mail,
  Calendar,
  Send
} from 'lucide-react';

const EnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchEnquiry = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enquiryService.getEnquiryById(id);
      setEnquiry(data);
    } catch (err) {
      setError(err.message || 'Failed to load enquiry details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const handleCloseEnquiry = async () => {
    if (!window.confirm('Are you sure you want to mark this enquiry as closed?')) return;
    setUpdating(true);
    try {
      const updated = await enquiryService.updateEnquiryStatus(id, 'CLOSED');
      setEnquiry(updated);
    } catch (err) {
      alert(err.message || 'Failed to update enquiry status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESPONDED':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> Responded
          </span>
        );
      case 'CLOSED':
        return (
          <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={14} /> Closed
          </span>
        );
      default:
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> Pending Response
          </span>
        );
    }
  };

  if (loading) return <LoadingSpinner message="Loading enquiry thread..." />;
  if (error || !enquiry) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'Enquiry not found'} />
        <Link to="/seeker/enquiries" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to My Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link to="/seeker/enquiries" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Enquiries
        </Link>
        <div>{getStatusBadge(enquiry.status)}</div>
      </div>

      {/* Property Summary Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>Listing Information</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>
            <Link to={`/rooms/${enquiry.roomId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {enquiry.roomTitle}
            </Link>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {enquiry.roomCity} · Monthly Rent: <strong>{formatCurrency(enquiry.roomRent)}</strong>
          </p>
        </div>
        <Link to={`/rooms/${enquiry.roomId}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Home size={16} /> View Room Details
        </Link>
      </div>

      {/* Thread Container */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          Communication History
        </h3>

        {/* Seeker Enquiry Message */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-subtle, #ede9fe)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={20} />
          </div>
          <div style={{ flex: 1, background: 'var(--bg-subtle, #f8fafc)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>You ({enquiry.seekerName || 'Seeker'})</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDateTime(enquiry.createdAt)}</span>
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>"{enquiry.message}"</p>
          </div>
        </div>

        {/* Owner Reply */}
        {enquiry.response ? (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Home size={20} />
            </div>
            <div style={{ flex: 1, background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#15803d' }}>Property Owner Response</strong>
                <span style={{ fontSize: '0.8rem', color: '#15803d' }}>{formatDateTime(enquiry.respondedAt)}</span>
              </div>
              <p style={{ lineHeight: 1.6, color: '#166534', fontWeight: 500 }}>"{enquiry.response}"</p>

              {/* Reveal Owner Contact Details */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #bbf7d0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                {enquiry.ownerPhone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534' }}>
                    <Phone size={14} /> Phone: <strong>{enquiry.ownerPhone}</strong>
                  </span>
                )}
                {enquiry.ownerEmail && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534' }}>
                    <Mail size={14} /> Email: <strong>{enquiry.ownerEmail}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', textAlign: 'center', color: '#92400e' }}>
            <Clock size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 600 }}>Awaiting response from property owner</p>
            <p style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '0.25rem' }}>
              The landlord has been notified and usually responds within 24 hours.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {enquiry.status !== 'CLOSED' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseEnquiry}
            disabled={updating}
          >
            <XCircle size={16} /> Mark Enquiry as Closed
          </button>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetails;

