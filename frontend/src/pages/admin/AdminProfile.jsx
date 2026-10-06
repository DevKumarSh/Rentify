import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Mail, Phone, ShieldCheck, Save, CheckCircle2, Lock, KeyRound, Briefcase } from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Priya Mehta',
    phone: user?.phone || '9900112233',
    email: user?.email || 'admin@rentify.com',
    department: 'Platform Operations & Moderation',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If attempting password update
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      const updatedFields = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department
      };
      await authService.updateProfile(updatedFields);
      updateUser(updatedFields);
      setSaved(true);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', width: '100%' }}>
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
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Profile Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your administrator credentials, system contact information, and security.
          </p>
        </div>
        <span className="badge badge-primary">
          <ShieldCheck size={14} /> Super Administrator
        </span>
      </div>

      {saved && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'var(--success-light)',
          color: '#065f46',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>Administrator profile details updated successfully!</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'var(--danger-light)',
          color: '#991b1b',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 600
        }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="card" style={{ padding: '2.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Personal & System Information
        </h3>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">Administrator Full Name</label>
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

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Admin Email (Primary Auth)</label>
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

        {/* Contact Phone & Department */}
        <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Contact Phone</label>
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

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department / Designation</label>
            <div className="auth-input-wrapper">
              <Briefcase size={18} className="auth-input-icon" />
              <input
                type="text"
                className="form-input with-icon"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Role Privileges */}
        <div className="form-group">
          <label className="form-label">Platform Privileges</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            fontWeight: 600
          }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>Full System Moderation, User Control, Listing Verification & Analytics</span>
          </div>
        </div>

        <div style={{ margin: '2rem 0 1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Change Password (Optional)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Leave blank if you do not wish to change your current administrator password.
          </p>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <div className="auth-input-wrapper">
                <KeyRound size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="Min 6 characters"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="Repeat new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Save size={18} />
            <span>{loading ? 'Saving Changes...' : 'Save Admin Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
