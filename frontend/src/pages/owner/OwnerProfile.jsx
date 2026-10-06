import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Mail, Phone, ShieldCheck, Save, CheckCircle2, Building } from 'lucide-react';

const OwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Mr. Ramesh Rao',
    phone: user?.phone || '9812345678',
    email: user?.email || 'owner@rentify.com'
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <label className="form-label">Owner Email Address</label>
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
        </div>

        <div className="form-group">
          <label className="form-label">Public Phone Number for Tenant Calls</label>
          <div className="auth-input-wrapper">
            <Phone size={18} className="auth-input-icon" />
            <input
              type="tel"
              className="form-input with-icon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Verification Badge Status</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'var(--success-light)',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={18} />
            <span>Verified Landlord Account</span>
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
