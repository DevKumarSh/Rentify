import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { BarChart3, TrendingUp, Users, Building, MessageSquare, ShieldCheck } from 'lucide-react';

const Analytics = () => {
  return (
    <div>
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Analytics & Metrics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Overview of platform traffic, regional demand, and listing performance.
        </p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <DashboardCard title="Total Volume" value="₹12.4L" subtitle="Est. monthly rental GMV" icon={TrendingUp} color="success" />
        <DashboardCard title="User Growth" value="+28%" subtitle="Month-over-month signups" icon={Users} color="primary" />
        <DashboardCard title="Enquiry Success" value="84%" subtitle="Response within 24h" icon={MessageSquare} color="info" />
        <DashboardCard title="Verified Ratio" value="92%" subtitle="Properties with badge" icon={ShieldCheck} color="warning" />
      </div>

      {/* Regional Demand Distribution */}
      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Top Cities by Enquiry Volume
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { city: 'Pune (Kothrud, Hinjewadi)', percent: 38, count: '83 enquiries' },
              { city: 'Bengaluru (Hebbal, Koramangala)', percent: 32, count: '70 enquiries' },
              { city: 'Hyderabad (Madhapur, Hitec City)', percent: 18, count: '39 enquiries' },
              { city: 'Delhi NCR (Gurugram)', percent: 12, count: '26 enquiries' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.city}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.count} ({item.percent}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Room Type Popularity Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { type: '1 BHK Apartments', percent: 42 },
              { type: 'Single Private Rooms', percent: 28 },
              { type: 'Shared Rooms / 2-Sharing', percent: 18 },
              { type: 'PG Beds with Food', percent: 12 }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.type}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.percent}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#0ea5e9', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
