import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Users, Bed, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import FavoriteButton from './FavoriteButton';
import './RoomCard.css';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80';

const RoomCard = ({ room, onFavoriteToggle }) => {
  const isVerified = room.verificationStatus === 'VERIFIED';
  const isRented = room.availabilityStatus === 'RENTED';
  const primaryImage = room.images && room.images.length > 0
    ? room.images[0]
    : DEFAULT_ROOM_IMAGE;

  const handleImageError = (e) => {
    e.target.src = DEFAULT_ROOM_IMAGE;
  };

  const formatGender = (gender) => {
    if (gender === 'MALE_ONLY') return 'Boys';
    if (gender === 'FEMALE_ONLY') return 'Girls';
    if (gender === 'FAMILY_ONLY') return 'Family';
    return 'Anyone';
  };

  const formatRoomType = (type) => {
    if (type === 'ONE_BHK') return '1 BHK';
    if (type === 'TWO_BHK') return '2 BHK';
    if (type === 'SINGLE_ROOM') return 'Single';
    if (type === 'SHARED_ROOM') return 'Shared';
    if (type === 'PG_BED') return 'PG Bed';
    return type?.replace('_', ' ') || 'Room';
  };

  return (
    <div className={`card room-card ${isRented ? 'room-card-rented' : ''}`}>
      {/* Thumbnail with overlay badges */}
      <div className="room-card-image-wrapper">
        <img
          src={primaryImage}
          alt={room.title}
          className="room-card-image"
          loading="lazy"
          onError={handleImageError}
        />

        <div className="room-card-badges-top">
          {isVerified && (
            <span className="badge badge-success verified-badge">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {isRented ? (
            <span className="badge badge-danger">Rented</span>
          ) : (
            <span className="badge badge-primary">Available</span>
          )}
        </div>

        <div className="room-card-favorite-pos">
          <FavoriteButton roomId={room.id} onToggle={onFavoriteToggle} />
        </div>

        <div className="room-card-price-tag">
          <span className="price-amount">{formatCurrency(room.rent)}</span>
          <span className="price-period">/ month</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="room-card-body">
        <div className="room-card-location">
          <MapPin size={15} color="var(--primary)" />
          <span>{room.locality}, {room.city}</span>
        </div>

        <h3 className="room-card-title">
          <Link to={`/rooms/${room.id}`}>{room.title}</Link>
        </h3>

        {/* Feature Pills */}
        <div className="room-card-features">
          <span className="feature-pill">
            <Bed size={13} /> {formatRoomType(room.roomType)}
          </span>
          <span className="feature-pill">
            <Users size={13} /> {formatGender(room.genderPreference)}
          </span>
          <span className="feature-pill">
            {room.furnishingStatus?.replace('_', ' ').toLowerCase()}
          </span>
        </div>

        {/* Footer with Rating & Action */}
        <div className="room-card-footer">
          <div className="room-rating-box">
            <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
            <span className="rating-score">{room.averageRating || '4.8'}</span>
            <span className="rating-count">({room.totalReviews || 1})</span>
          </div>

          <Link to={`/rooms/${room.id}`} className="btn btn-sm btn-outline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
