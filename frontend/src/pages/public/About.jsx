import React from 'react';
import { Building, ShieldCheck, HeartHandshake, Users, Sparkles, Award } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> Our Mission
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Reinventing Room Discovery for Students & Working Professionals
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            RentiFy is built to remove the chaos, fake listings, and heavy broker commissions from renting rooms in India's top educational and IT destinations.
          </p>
        </div>

        {/* Story Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>The RentiFy Story</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Every year, millions of students and young professionals relocate to cities like Pune, Bengaluru, Hyderabad, and Delhi NCR. Finding a safe, affordable, and clean room traditionally required wading through spam-filled WhatsApp groups, paying up to a full month’s rent in brokerage fees, and visiting stale or already-rented flats.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            RentiFy unifies the entire discovery and enquiry pipeline into one transparent, role-based platform where landlords post verified rooms with real photos, and seekers find their next home in minutes.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-3" style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>100% Verified</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Listing moderation ensures only genuine properties and authentic room photos are published.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Zero Brokerage</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Direct seeker-to-owner connection means you never have to pay a single rupee in broker commission.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--info-light)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Student Centric</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Filters tailored specifically for roommates, gender-safe accommodations, and PG budget requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
