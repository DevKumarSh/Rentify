import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/dashboard/DashboardCard';
import EnquiryCard from '../../components/enquiry/EnquiryCard';
import { roomService } from '../../services/roomService';
import { enquiryService } from '../../services/enquiryService';
import { Building, MessageSquare, PlusCircle, CheckCircle, Clock, Eye, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const roomRes = await roomService.getMyOwnerRooms();
      setRooms(roomRes.content || []);
      const enqRes = await enquiryService.getOwnerEnquiries();
      setEnquiries(enqRes.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async (enquiryId, reply) => {
    await enquiryService.respondToEnquiry(enquiryId, reply);
    fetchData();
  };

  const activeRooms = rooms.filter(r => r.availabilityStatus === 'AVAILABLE').length;
  const rentedRooms = rooms.filter(r => r.availabilityStatus === 'RENTED').length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'PENDING').length;

  return (
    <div className="owner-dashboard-page" style={{ width: '100%' }}>
      {/* Welcome & Action Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-lg)',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={14} color="#38bdf8" /> Landlord & PG Operator Dashboard
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
            Hello, {user?.name || 'Mr. Ramesh Rao'}!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Manage your rental units, reply to verified tenant enquiries, and update room vacancy in real time.
          </p>
        </div>

        <Link to="/owner/rooms/new" className="btn btn-primary btn-lg" style={{ fontWeight: 700, flexShrink: 0 }}>
          <PlusCircle size={18} /> Post New Room
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <DashboardCard
          title="Total Units"
          value={rooms.length}
          subtitle="Listed properties"
          icon={Building}
          color="primary"
        />
        <DashboardCard
          title="Available"
          value={activeRooms}
          subtitle="Ready for move-in"
          icon={CheckCircle}
          color="success"
        />
        <DashboardCard
          title="Rented Out"
          value={rentedRooms}
          subtitle="Occupied vacancies"
          icon={Eye}
          color="info"
        />
        <DashboardCard
          title="Tenant Enquiries"
          value={enquiries.length}
          subtitle={`${pendingEnquiries} awaiting response`}
          icon={MessageSquare}
          color="warning"
        />
      </div>

      {/* Enquiries Inbox & Listings Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left: Enquiries requiring response */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tenant Enquiries Inbox</h3>
            <Link to="/owner/enquiries" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All ({enquiries.length})
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {enquiries.slice(0, 3).map((enq) => (
                <EnquiryCard
                  key={enq.id}
                  enquiry={enq}
                  isOwnerView={true}
                  onRespond={handleRespond}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <MessageSquare size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600 }}>No enquiries yet</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Enquiries from prospective student renters will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Right: Quick Unit Status Management */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Property Listings</h3>
            <Link to="/owner/rooms" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Manage Units ({rooms.length})
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {rooms.slice(0, 4).map((room) => (
              <div
                key={room.id}
                className="card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  minWidth: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80'}
                    alt={room.title}
                    style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{
                      fontSize: '0.925rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {room.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      <strong style={{ color: 'var(--primary)' }}>{formatCurrency(room.rent)}/mo</strong> • {room.locality}, {room.city}
                    </p>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {room.availabilityStatus === 'AVAILABLE' ? (
                    <span className="badge badge-success">Available</span>
                  ) : (
                    <span className="badge badge-danger">Rented</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
