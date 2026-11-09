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
  HeartHandshake,
  Search,
  MessageSquare,
  Key
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [totalRoomsCount, setTotalRoomsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomService.getRooms();
        setFeaturedRooms(res.content?.slice(0, 3) || []);
        setTotalRoomsCount(res.totalElements || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const popularCities = [
    { name: 'Pune', count: '140+ Rooms', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=600&q=80', desc: 'Kothrud, FC Road, Hinjewadi' },
    { name: 'Bengaluru', count: '220+ Rooms', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', desc: 'Koramangala, HSR, Indiranagar' },
    { name: 'Hyderabad', count: '110+ Rooms', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=600&q=80', desc: 'Madhapur, Gachibowli, Hitec City' },
    { name: 'Dehradun', count: '85+ Rooms', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', desc: 'Clement Town, Rajpur Road, Karanpur' }
  ];

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
              <span className="stat-number">{totalRoomsCount > 0 ? `${totalRoomsCount}+` : 'Active'}</span>
              <span className="stat-label">Verified Listings</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">₹0</span>
              <span className="stat-label">Brokerage Fee</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Direct Connection</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Instant Discovery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rental Hubs */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div>
              <span className="section-tag">Explore by Location</span>
              <h2 className="section-title">Popular Student & Tech Hubs</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline">
              <span>View All Cities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {popularCities.map((city) => (
              <Link
                key={city.name}
                to={`/rooms?city=${encodeURIComponent(city.name)}`}
                className="card"
                style={{
                  position: 'relative',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: '#fff',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
                />
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(79, 70, 229, 0.9)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {city.count}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.35rem 0 0.15rem 0' }}>{city.name}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{city.desc}</p>
                </div>
              </Link>
            ))}
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
            ) : featuredRooms.length > 0 ? (
              featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1.5rem' }} className="card">
                <Building size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Rooms Listed Yet</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                  Be the first property owner to list a room on RentiFy, connect directly with seekers, and move tenants in.
                </p>
                <Link to="/owner/rooms/new" className="btn btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
                  <Building size={16} /> Post a Room Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How RentiFy Works (3 Steps) */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-subtle, #f8fafc)' }}>
        <div className="container">
          <div className="features-intro" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">How RentiFy Works in 3 Easy Steps</h2>
            <p className="features-subtitle">
              Finding or listing a rental room has never been more straightforward.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light, #ede9fe)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Search size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Step 1</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>Search & Filter</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Filter listings by city, locality, budget, gender preference, furnishing level, and room type.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <MessageSquare size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Step 2</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>Enquire Directly</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Send enquiries straight to verified property landlords without paying middleman brokerage commissions.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Key size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>Step 3</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>Visit, Move In & Review</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Finalize your visit, move in comfortably, and leave an authentic review to guide future student seekers.
              </p>
            </div>
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
