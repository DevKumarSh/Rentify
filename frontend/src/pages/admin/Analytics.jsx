import React, { useState, useEffect } from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import { ROOM_TYPES } from '../../utils/constants';
import { BarChart3, TrendingUp, Users, Building, MessageSquare, ShieldCheck } from 'lucide-react';

const Analytics = () => {
  const [metrics, setMetrics] = useState({});
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [metricData, listingsData] = await Promise.all([
          adminService.getDashboardMetrics(),
          adminService.getAllListings({ size: 100 })
        ]);
        setMetrics(metricData || {});
        setListings(listingsData?.content || []);
      } catch (err) {
        console.error('Failed to load platform analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Compute dynamic stats from real backend data
  const totalListings = listings.length;
  const activeListings = listings.filter((r) => r.listingStatus === 'ACTIVE');
  const verifiedListings = listings.filter((r) => r.verificationStatus === 'VERIFIED');
  const verifiedRatio = totalListings > 0 ? Math.round((verifiedListings.length / totalListings) * 100) : 0;

  const totalGMV = activeListings.reduce((sum, r) => sum + (Number(r.rent) || 0), 0);

  // Group listings by city dynamically
  const cityCountMap = {};
  listings.forEach((r) => {
    const city = r.city || 'Other';
    cityCountMap[city] = (cityCountMap[city] || 0) + 1;
  });

  const cityBreakdown = Object.entries(cityCountMap)
    .map(([city, count]) => ({
      city,
      count,
      percent: totalListings > 0 ? Math.round((count / totalListings) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Group listings by room type dynamically
  const typeCountMap = {};
  listings.forEach((r) => {
    const type = r.roomType || 'SINGLE_ROOM';
    typeCountMap[type] = (typeCountMap[type] || 0) + 1;
  });

  const roomTypeLabel = (typeKey) => {
    const found = ROOM_TYPES.find((rt) => rt.value === typeKey);
    return found ? found.label : typeKey;
  };

  const roomTypeBreakdown = Object.entries(typeCountMap)
    .map(([type, count]) => ({
      type: roomTypeLabel(type),
      count,
      percent: totalListings > 0 ? Math.round((count / totalListings) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Analytics & Metrics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time dynamic overview of platform inventory, regional demand, and listing performance.
        </p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <DashboardCard
          title="Total Rental Volume"
          value={formatCurrency(totalGMV)}
          subtitle={`${activeListings.length} Active properties listed`}
          icon={TrendingUp}
          color="success"
        />
        <DashboardCard
          title="Total Users"
          value={metrics.totalUsers ?? 0}
          subtitle={`${metrics.totalSeekers ?? 0} Seekers, ${metrics.totalOwners ?? 0} Owners`}
          icon={Users}
          color="primary"
        />
        <DashboardCard
          title="Enquiries Logged"
          value={metrics.totalEnquiries ?? 0}
          subtitle="Tenant enquiries sent"
          icon={MessageSquare}
          color="info"
        />
        <DashboardCard
          title="Verified Ratio"
          value={`${verifiedRatio}%`}
          subtitle={`${verifiedListings.length} Verified of ${totalListings}`}
          icon={ShieldCheck}
          color="warning"
        />
      </div>

      {/* Regional Demand Distribution */}
      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Top Cities by Listing Inventory
          </h3>
          {cityBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No listings posted in any city yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cityBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.city}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {item.count} listings ({item.percent}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Room Type Inventory Breakdown
          </h3>
          {roomTypeBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No room types recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roomTypeBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.type}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#0ea5e9', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
