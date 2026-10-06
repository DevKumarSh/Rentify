import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { reviewService } from '../../services/reviewService';
import ImageGallery from '../../components/room/ImageGallery';
import FavoriteButton from '../../components/room/FavoriteButton';
import EnquiryModal from '../../components/enquiry/EnquiryModal';
import ReportModal from '../../components/room/ReportModal';
import ReviewModal from '../../components/review/ReviewModal';
import ReviewCard from '../../components/review/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  ShieldCheck,
  Bed,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Flag,
  ArrowLeft,
  Share2
} from 'lucide-react';
import './RoomDetailsPage.css';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isSeeker } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRoomData = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomData = await roomService.getRoomById(id);
      setRoom(roomData);
      const reviewsData = await reviewService.getRoomReviews(id);
      setReviews(reviewsData.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnquireClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnquiryOpen(true);
  };

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewOpen(true);
  };

  if (loading) return <LoadingSpinner message="Loading property details..." />;
  if (error || !room) return <ErrorMessage message={error || 'Room not found'} onRetry={fetchRoomData} />;

  const isVerified = room.verificationStatus === 'VERIFIED';
  const isRented = room.availabilityStatus === 'RENTED';

  return (
    <div className="room-details-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="details-top-bar">
          <Link to="/rooms" className="btn-back-link">
            <ArrowLeft size={18} />
            <span>Back to all rooms</span>
          </Link>

          <div className="details-top-actions">
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleShare}>
              <Share2 size={16} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary text-danger"
              onClick={() => setReportOpen(true)}
              title="Report this listing"
            >
              <Flag size={16} />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="details-gallery-section">
          <ImageGallery images={room.images} />
        </div>

        {/* Main Grid Layout */}
        <div className="details-layout-grid">
          {/* Left Column: Room Overview & Amenities */}
          <div className="details-main-info">
            <div className="card details-header-card">
              <div className="details-badges-row">
                {isVerified && (
                  <span className="badge badge-success">
                    <ShieldCheck size={14} /> Verified Property
                  </span>
                )}
                {isRented ? (
                  <span className="badge badge-danger">Currently Rented Out</span>
                ) : (
                  <span className="badge badge-primary">Available Now</span>
                )}
                <span className="badge badge-neutral">
                  Listed {formatDate(room.createdAt)}
                </span>
              </div>

              <h1 className="details-title">{room.title}</h1>

              <div className="details-location-text">
                <MapPin size={18} color="var(--primary)" />
                <span>{room.address || `${room.locality}, ${room.city}`}</span>
              </div>

              {/* Highlights Strip */}
              <div className="details-highlights-grid">
                <div className="highlight-item">
                  <span className="highlight-label">Room Type</span>
                  <p className="highlight-val"><Bed size={16} /> {room.roomType?.replace('_', ' ')}</p>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">Gender</span>
                  <p className="highlight-val"><Users size={16} /> {room.genderPreference?.replace('_', ' ')}</p>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">Furnishing</span>
                  <p className="highlight-val"><Building size={16} /> {room.furnishingStatus?.replace('_', ' ')}</p>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">Deposit</span>
                  <p className="highlight-val">₹{room.securityDeposit || 0}</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="card details-section-card">
              <h3 className="section-card-title">About this Property</h3>
              <p className="details-description-text">{room.description}</p>
            </div>

            {/* Amenities Card */}
            <div className="card details-section-card">
              <h3 className="section-card-title">Amenities & Facilities</h3>
              <div className="amenities-pills-grid">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-pill-item">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Standard amenities provided.</p>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card details-section-card">
              <div className="reviews-header-wrap">
                <div>
                  <h3 className="section-card-title">Tenant Reviews ({reviews.length})</h3>
                  <div className="reviews-rating-banner">
                    <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
                    <span className="rating-score-large">{room.averageRating || '4.8'}</span>
                    <span className="rating-out-of">/ 5.0</span>
                  </div>
                </div>

                <button type="button" className="btn btn-outline" onClick={handleReviewClick}>
                  <Star size={16} />
                  <span>Write a Review</span>
                </button>
              </div>

              <div className="reviews-list-wrap">
                {reviews.length > 0 ? (
                  reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>
                    No reviews yet. Be the first tenant to leave a review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Owner Contact Box */}
          <aside className="details-booking-sidebar">
            <div className="card booking-action-card">
              <div className="booking-price-header">
                <div>
                  <span className="price-number">{formatCurrency(room.rent)}</span>
                  <span className="price-unit">/ month</span>
                </div>
                <FavoriteButton roomId={room.id} />
              </div>

              <div className="deposit-notice">
                <span>Security Deposit: <strong>{formatCurrency(room.securityDeposit || 0)}</strong></span>
                <span className="broker-zero-tag">0% Brokerage</span>
              </div>

              {/* Owner Info Box */}
              <div className="owner-profile-card">
                <div className="owner-avatar">
                  {room.ownerName ? room.ownerName.charAt(0) : 'O'}
                </div>
                <div>
                  <h4 className="owner-name">{room.ownerName || 'Verified Landlord'}</h4>
                  <p className="owner-badge-text">
                    <ShieldCheck size={13} color="var(--success)" /> Verified Room Owner
                  </p>
                </div>
              </div>

              {/* Direct Enquiry CTA */}
              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={handleEnquireClick}
                disabled={isRented}
              >
                <MessageSquare size={18} />
                <span>{isRented ? 'Currently Rented' : 'Send Enquiry to Owner'}</span>
              </button>

              <div className="owner-contact-details">
                <div className="contact-row">
                  <Phone size={15} color="var(--primary)" />
                  <span>{room.ownerPhone || '+91 98123 45678'}</span>
                </div>
                <div className="contact-row">
                  <Mail size={15} color="var(--primary)" />
                  <span>{room.ownerEmail || 'owner@rentify.com'}</span>
                </div>
              </div>

              <div className="trust-points-list">
                <p><CheckCircle2 size={14} color="var(--success)" /> Direct contact with property owner</p>
                <p><CheckCircle2 size={14} color="var(--success)" /> Verified pricing & no hidden charges</p>
                <p><CheckCircle2 size={14} color="var(--success)" /> Schedule inspection before token payment</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        room={room}
      />
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        room={room}
      />
      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        roomId={room.id}
        onSuccess={fetchRoomData}
      />
    </div>
  );
};

export default RoomDetailsPage;
