import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/room/SearchBar';
import RoomCard from '../../components/room/RoomCard';
import { roomService } from '../../services/roomService';
import {
  ShieldCheck,
  Zap,
  Users,
  Building,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomService.getRooms();
        setFeaturedRooms(res.content?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={15} color="#38bdf8" />
            <span>100% Direct Room Rental — Zero Brokerage</span>
          </div>

          <h1 className="hero-title">
            Find Your Ideal Student & Professional <br />
            <span className="hero-highlight">Rental Room in Minutes</span>
          </h1>

          <p className="hero-subtitle">
            Say goodbye to chaotic WhatsApp groups and costly broker fees. Discover verified rooms, connect directly with owners, and move in hassle-free.
          </p>

          {/* Integrated Search Bar */}
          <div className="hero-search-container">
            <SearchBar />
          </div>

          {/* Quick Stats Banner */}
          <div className="hero-stats-banner">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Verified Listings</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">₹0</span>
              <span className="stat-label">Brokerage Fee</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">2,400+</span>
              <span className="stat-label">Happy Tenants</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">8+</span>
              <span className="stat-label">Major Tech Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">Handpicked for You</span>
              <h2 className="section-title">Trending Rental Rooms</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline">
              <span>View All Rooms</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="card" style={{ height: '360px' }}>
                  <div className="skeleton" style={{ height: '200px' }} />
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                    <div className="skeleton" style={{ height: '20px', width: '80%' }} />
                  </div>
                </div>
              ))
            ) : (
              featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose RentiFy Feature Grid */}
      <section className="features-section">
        <div className="container">
          <div className="features-intro">
            <span className="section-tag">Why RentiFy?</span>
            <h2 className="section-title">Built Specifically for Modern Renters & Landlords</h2>
            <p className="features-subtitle">
              We eliminate the traditional headaches of searching for rooms in unfamiliar cities.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card feature-box">
              <div className="feature-icon-wrap" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                <ShieldCheck size={28} color="#ffffff" />
              </div>
              <h3>Verified Listings Only</h3>
              <p>Every listing goes through admin verification and owner check to prevent fraud, fake photos, or duplicate broker posts.</p>
            </div>

            <div className="card feature-box">
              <div className="feature-icon-wrap" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }}>
                <Zap size={28} color="#ffffff" />
              </div>
              <h3>Direct In-App Enquiries</h3>
              <p>No more endless WhatsApp calls. Submit structured enquiries, schedule site visits, and get direct owner responses.</p>
            </div>

            <div className="card feature-box">
              <div className="feature-icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <HeartHandshake size={28} color="#ffffff" />
              </div>
              <h3>Transparent Reviews & Zero Brokerage</h3>
              <p>Read authentic reviews from previous student and professional tenants. Save 100% of your brokerage fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Banner */}
      <section className="cta-dual-section">
        <div className="container">
          <div className="cta-grid">
            {/* For Seekers */}
            <div className="cta-card cta-seeker">
              <span className="badge badge-primary">Looking for a place?</span>
              <h3>Find Affordable Rooms Near Your College or Tech Park</h3>
              <p>Search by gender preference, budget, 1 BHK, shared PG bed, and amenities.</p>
              <Link to="/rooms" className="btn btn-primary">
                <span>Start Exploring</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* For Owners */}
            <div className="cta-card cta-owner">
              <span className="badge badge-success">Have a room to rent?</span>
              <h3>List Your Property & Receive Genuine Enquiries</h3>
              <p>Post once with high-res photos. Manage tenant enquiries and mark rented with 1-click.</p>
              <Link to="/register" className="btn btn-secondary">
                <span>Register as Owner</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
