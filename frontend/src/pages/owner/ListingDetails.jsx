import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ImageUploader from '../../components/forms/ImageUploader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Bed,
  ShieldCheck,
  Star,
  Users,
  Image as ImageIcon
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRoomById(id);
      setRoom(data);
    } catch (err) {
      setError(err.message || 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const handleAvailabilityToggle = async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await roomService.updateAvailability(id, newStatus);
      setRoom(prev => ({ ...prev, availabilityStatus: updated.availabilityStatus || newStatus }));
    } catch (err) {
      alert(err.message || 'Failed to update availability');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      await roomService.deleteRoom(id);
      navigate('/owner/rooms');
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleImagesChange = (updatedImages) => {
    setRoom(prev => ({ ...prev, images: updatedImages }));
    roomService.updateRoom(id, { images: updatedImages }).catch(console.error);
  };

  if (loading) return <LoadingSpinner message="Loading listing details..." />;
  if (error || !room) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'Room listing not found'} />
        <Link to="/owner/rooms" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/owner/rooms" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to My Listings
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/rooms/${room.id}`} target="_blank" className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={16} /> Public Preview
          </Link>
          <Link to={`/owner/rooms/${room.id}/edit`} className="btn btn-sm btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={16} /> Edit Listing
          </Link>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleDelete} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Views</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{room.viewCount || 0}</h3>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Average Rating</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Star size={22} fill="#f59e0b" /> {room.averageRating || 4.5}
          </h3>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Verification Status</span>
          <div style={{ marginTop: '0.5rem' }}>
            {room.verificationStatus === 'VERIFIED' ? (
              <span className="badge badge-success"><CheckCircle size={14} /> Verified</span>
            ) : room.verificationStatus === 'REJECTED' ? (
              <span className="badge badge-danger"><AlertTriangle size={14} /> Rejected</span>
            ) : (
              <span className="badge badge-warning"><Clock size={14} /> Unverified</span>
            )}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Listing Status</span>
          <div style={{ marginTop: '0.5rem' }}>
            <span className={`badge ${room.listingStatus === 'ACTIVE' ? 'badge-primary' : 'badge-neutral'}`}>
              {room.listingStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Availability Management */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Listing Availability</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Mark your room as Rented when filled to hide it from general search.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${room.availabilityStatus === 'AVAILABLE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleAvailabilityToggle('AVAILABLE')}
            disabled={updating}
          >
            Available
          </button>
          <button
            type="button"
            className={`btn btn-sm ${room.availabilityStatus === 'RENTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleAvailabilityToggle('RENTED')}
            disabled={updating}
          >
            Mark Rented
          </button>
          <button
            type="button"
            className={`btn btn-sm ${room.availabilityStatus === 'TEMPORARILY_UNAVAILABLE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleAvailabilityToggle('TEMPORARILY_UNAVAILABLE')}
            disabled={updating}
          >
            Paused
          </button>
        </div>
      </div>

      {/* Main Listing Information */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{room.title}</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          <MapPin size={16} /> {room.address}, {room.locality}, {room.city} {room.pincode ? `- ${room.pincode}` : ''}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-subtle, #f8fafc)', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Rent</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(room.rent)}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security Deposit</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(room.securityDeposit || 0)}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room Type</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{room.roomType}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Furnishing</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{room.furnishingStatus}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender Preference</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{room.genderPreference}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Occupancy</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{room.numOccupants} Person(s)</p>
          </div>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Description</h4>
        <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1.5rem' }}>{room.description}</p>

        {room.amenities && room.amenities.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Amenities</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {room.amenities.map((amenity, idx) => (
                <span key={idx} className="badge badge-secondary" style={{ padding: '6px 12px' }}>
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Management Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={20} /> Property Photos ({room.images?.length || 0}/8)
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Manage your uploaded images or add new photos for your room listing.
        </p>
        <ImageUploader images={room.images || []} onChange={handleImagesChange} maxImages={8} />
      </div>
    </div>
  );
};

export default ListingDetails;

