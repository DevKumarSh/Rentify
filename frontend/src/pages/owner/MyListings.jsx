import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlusCircle, Edit3, Trash2, CheckCircle, Eye, ShieldCheck, MapPin, Building } from 'lucide-react';

const MyListings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getMyOwnerRooms();
      setRooms(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleToggleAvailability = async (roomId, currentStatus) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE';
    try {
      await roomService.updateAvailability(roomId, newStatus);
      fetchRooms();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await roomService.deleteRoom(deleteTargetId);
      setDeleteTargetId(null);
      fetchRooms();
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Room Listings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage room information, toggle rented vacancy, and update photos.
          </p>
        </div>

        <Link to="/owner/rooms/new" className="btn btn-primary">
          <PlusCircle size={16} /> Add New Listing
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your listings..." />
      ) : rooms.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rooms.map((room) => {
            const isAvailable = room.availabilityStatus === 'AVAILABLE';
            const isVerified = room.verificationStatus === 'VERIFIED';

            return (
              <div
                key={room.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Photo */}
                <div style={{
                  height: '120px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                    alt={room.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isVerified && (
                    <span style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      backgroundColor: 'rgba(16, 185, 129, 0.9)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <ShieldCheck size={10} /> Verified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {isAvailable ? 'AVAILABLE NOW' : 'RENTED OUT'}
                    </span>
                    <span className="badge badge-neutral">
                      {room.roomType?.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <Link to={`/rooms/${room.id}`} style={{ color: 'var(--text-primary)' }}>
                      {room.title}
                    </Link>
                  </h3>

                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{room.locality}, {room.city}</span>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(room.rent)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ month</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                      Deposit: {formatCurrency(room.securityDeposit || 0)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '150px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${isAvailable ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleToggleAvailability(room.id, room.availabilityStatus)}
                  >
                    <CheckCircle size={14} />
                    <span>{isAvailable ? 'Mark as Rented' : 'Mark as Available'}</span>
                  </button>

                  <Link to={`/owner/rooms/${room.id}/edit`} className="btn btn-sm btn-outline">
                    <Edit3 size={14} /> Edit Listing
                  </Link>

                  <button
                    type="button"
                    className="btn btn-sm btn-secondary text-danger"
                    onClick={() => setDeleteTargetId(room.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <Building size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No listings published yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            List your rental rooms to start receiving enquiries from verified seekers.
          </p>
          <Link to="/owner/rooms/new" className="btn btn-primary">
            <PlusCircle size={16} /> Post Your First Room
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Room Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete Listing"
        isDangerous={true}
      />
    </div>
  );
};

export default MyListings;
