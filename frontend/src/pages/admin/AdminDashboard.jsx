import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { Users, Building, ShieldCheck, Flag, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [pendingRooms, setPendingRooms] = useState([]);
  const [openReports, setOpenReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const metricData = await adminService.getDashboardMetrics();
      setMetrics(metricData);
      const listingsData = await adminService.getAllListings();
      setPendingRooms(listingsData.content?.filter(r => r.verificationStatus === 'PENDING') || []);
      const reportsData = await reportService.getReports();
      setOpenReports(reportsData.content?.filter(r => r.status === 'OPEN') || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVerify = async (id, status) => {
    await adminService.verifyListing(id, status);
    fetchDashboardData();
  };

  return (
    <div className="admin-dashboard-page" style={{ width: '100%' }}>
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            System-wide statistics, moderation queues, and listing verification.
          </p>
        </div>
        <span className="badge badge-primary">Admin Control Center</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <DashboardCard
          title="Total Users"
          value={metrics.totalUsers || 142}
          subtitle={`${metrics.totalSeekers || 110} Seekers, ${metrics.totalOwners || 32} Owners`}
          icon={Users}
          color="primary"
        />
        <DashboardCard
          title="Total Listings"
          value={metrics.totalListings || 58}
          subtitle={`${metrics.activeListings || 47} Active rooms`}
          icon={Building}
          color="info"
        />
        <DashboardCard
          title="Pending Review"
          value={pendingRooms.length}
          subtitle="Awaiting verification"
          icon={ShieldCheck}
          color="warning"
        />
        <DashboardCard
          title="Flagged Reports"
          value={openReports.length}
          subtitle="Open complaints"
          icon={Flag}
          color="danger"
        />
      </div>

      {/* Verification Queue & Open Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Verification Queue */}
        <div className="card" style={{ padding: '1.75rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verification Queue</h3>
            <Link to="/admin/verification" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Full Queue ({pendingRooms.length})
            </Link>
          </div>

          {pendingRooms.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRooms.slice(0, 3).map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    minWidth: 0
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {room.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      By {room.ownerName} • {room.city} • <strong style={{ color: 'var(--primary)' }}>{formatCurrency(room.rent)}/mo</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => handleVerify(room.id, 'VERIFIED')}
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleVerify(room.id, 'REJECTED')}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No pending listings in verification queue. All caught up!
            </p>
          )}
        </div>

        {/* Flagged Reports */}
        <div className="card" style={{ padding: '1.75rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Open Reports</h3>
            <Link to="/admin/reports" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Manage Reports ({openReports.length})
            </Link>
          </div>

          {openReports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {openReports.slice(0, 3).map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--danger-light)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--danger)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>
                      {rep.reason?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{formatDate(rep.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#7f1d1d', fontWeight: 500 }}>"{rep.description}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Zero open reports. The platform is clean!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
