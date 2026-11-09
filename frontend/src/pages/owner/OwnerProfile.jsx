import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Mail, Phone, ShieldCheck, Save, CheckCircle2, Building } from 'lucide-react';

const OwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile) {
          setFormData({
            name: profile.name || '',
            phone: profile.phone || '',
            email: profile.email || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch owner profile', err);
      }
    };
    fetchLatestProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      updateUser(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Owner Profile & Contact Details</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          This contact information is displayed to prospective tenants on your room listings.
        </p>
      </div>

      {saved && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'var(--success-light)',
          color: '#065f46',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>Owner profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name / PG Business Name</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              type="text"
              className="form-input with-icon"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address (Registered)</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              type="email"
              className="form-input with-icon"
              value={formData.email}
              disabled
              style={{ backgroundColor: 'var(--bg-surface)', cursor: 'not-allowed' }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Registered email used for verification and platform notices.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number (Tenant Call/WhatsApp)</label>
          <div className="auth-input-wrapper">
            <Phone size={18} className="auth-input-icon" />
            <input
              type="tel"
              className="form-input with-icon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9812345678"
              required
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            This phone number is visible to verified seekers after sending an enquiry.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Account Role & Verification</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
            <span className="badge badge-info">
              <Building size={12} style={{ marginRight: '0.25rem' }} /> Room Owner
            </span>
            <span className="badge badge-success">
              <ShieldCheck size={12} style={{ marginRight: '0.25rem' }} /> Verified Landlord
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          <Save size={16} />
          <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default OwnerProfile;
