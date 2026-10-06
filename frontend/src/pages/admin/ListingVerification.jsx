import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldCheck, CheckCircle2, XCircle, Eye, Building, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ListingVerification = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllListings();
      setListings(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleVerify = async (id, status) => {
    await adminService.verifyListing(id, status);
    fetchListings();
  };

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Listing Verification Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review room photos, descriptions, and pricing submitted by property owners.
          </p>
        </div>
        <span className="badge badge-warning">
          {listings.filter(l => l.verificationStatus === 'PENDING').length} Pending Review
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading listings for verification..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {listings.map((room) => {
            const isPending = room.verificationStatus === 'PENDING';
            const isVerified = room.verificationStatus === 'VERIFIED';

            return (
              <div
                key={room.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                <div style={{ height: '110px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                    alt={room.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${isVerified ? 'badge-success' : (isPending ? 'badge-warning' : 'badge-danger')}`}>
                      {room.verificationStatus}
                    </span>
                    <span className="badge badge-neutral">{room.roomType?.replace('_', ' ')}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0' }}>
                    <Link to={`/rooms/${room.id}`} style={{ color: 'var(--text-primary)' }}>
                      {room.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Owner: <strong>{room.ownerName}</strong> ({room.ownerEmail}) • {room.city}
                  </p>

                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.35rem' }}>
                    {formatCurrency(room.rent)}/mo • Deposit: {formatCurrency(room.securityDeposit || 0)}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '130px' }}>
                  <Link to={`/rooms/${room.id}`} className="btn btn-sm btn-secondary">
                    <Eye size={14} /> Preview Room
                  </Link>

                  {room.verificationStatus !== 'VERIFIED' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => handleVerify(room.id, 'VERIFIED')}
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  )}

                  {room.verificationStatus !== 'REJECTED' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleVerify(room.id, 'REJECTED')}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListingVerification;
