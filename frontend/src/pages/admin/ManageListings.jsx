import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trash2, Eye, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

  const handleDelete = async () => {
    if (deleteTargetId) {
      await adminService.deleteListing(deleteTargetId);
      setDeleteTargetId(null);
      fetchListings();
    }
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Platform Listings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Total {listings.length} properties listed across all cities.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading all platform listings..." />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Property</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Location</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Rent</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Owner</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((room) => (
                <tr key={room.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>#{room.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    <Link to={`/rooms/${room.id}`} style={{ color: 'var(--text-primary)' }}>
                      {room.title?.substring(0, 35)}...
                    </Link>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{room.locality}, {room.city}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {formatCurrency(room.rent)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{room.ownerName}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${room.verificationStatus === 'VERIFIED' ? 'badge-success' : 'badge-warning'}`}>
                      {room.verificationStatus}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <Link to={`/rooms/${room.id}`} className="btn btn-sm btn-secondary">
                        <Eye size={14} />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary text-danger"
                        onClick={() => setDeleteTargetId(room.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Remove Listing"
        message="Are you sure you want to remove this property listing from the platform?"
        confirmText="Remove"
        isDangerous={true}
      />
    </div>
  );
};

export default ManageListings;
