import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/dashboard/DashboardCard';
import EnquiryCard from '../../components/enquiry/EnquiryCard';
import RoomCard from '../../components/room/RoomCard';
import { enquiryService } from '../../services/enquiryService';
import { favoriteService } from '../../services/favoriteService';
import { Heart, MessageSquare, Star, Search, ArrowRight, Sparkles } from 'lucide-react';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enqRes = await enquiryService.getSeekerEnquiries();
        setEnquiries(enqRes.content || []);
        const favRes = await favoriteService.getFavorites();
        setFavorites(favRes.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingEnquiries = enquiries.filter(e => e.status === 'PENDING').length;
  const respondedEnquiries = enquiries.filter(e => e.status === 'RESPONDED').length;

  return (
    <div className="seeker-dashboard-page" style={{ width: '100%' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: '#ffffff',
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={14} /> Room Seeker Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: '#e0e7ff', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Track your room enquiries, saved favorites, and owner responses in one place.
          </p>
        </div>

        <Link to="/rooms" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>
          <Search size={16} /> Explore New Rooms
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <DashboardCard
          title="Saved Rooms"
          value={favorites.length}
          subtitle="Properties in your shortlist"
          icon={Heart}
          color="danger"
        />
        <DashboardCard
          title="Active Enquiries"
          value={enquiries.length}
          subtitle={`${respondedEnquiries} responded, ${pendingEnquiries} pending`}
          icon={MessageSquare}
          color="primary"
        />
        <DashboardCard
          title="Broker Fee Saved"
          value="100%"
          subtitle="Direct owner connections"
          icon={Star}
          color="success"
        />
      </div>

      {/* Recent Enquiries & Saved Shortlist */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left: Recent Enquiries */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Recent Enquiries</h3>
            <Link to="/seeker/enquiries" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All ({enquiries.length})
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {enquiries.slice(0, 3).map((enq) => (
                <EnquiryCard key={enq.id} enquiry={enq} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <MessageSquare size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No enquiries sent yet</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Browse rooms and click "Send Enquiry" to contact owners directly.
              </p>
              <Link to="/rooms" className="btn btn-sm btn-primary">
                Browse Rooms
              </Link>
            </div>
          )}
        </div>

        {/* Right: Shortlisted Favorites */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Saved Rooms</h3>
            <Link to="/seeker/favorites" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All ({favorites.length})
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {favorites.slice(0, 2).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Heart size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Your favorites list is empty</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Save properties with the heart icon to compare them later.
              </p>
              <Link to="/rooms" className="btn btn-sm btn-outline">
                Find Rooms
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
