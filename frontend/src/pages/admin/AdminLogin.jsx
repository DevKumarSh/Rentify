import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, LogIn } from 'lucide-react';
import '../public/AuthPages.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: 'admin@rentify.com', password: 'password123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied: You need Administrator privileges to enter this portal.');
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="brand-logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
            <Shield size={22} color="#fff" />
          </div>
          <h2 className="auth-title">RentiFy Admin Portal</h2>
          <p className="auth-subtitle">Restricted moderation access for platform administrators.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input with-icon"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="form-input with-icon"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
