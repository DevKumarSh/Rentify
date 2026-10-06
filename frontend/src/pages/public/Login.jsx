import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validators';
import { LogIn, User, Building, Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'ROLE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'SEEKER') {
      setFormData({ email: 'seeker@rentify.com', password: 'password123' });
    } else if (role === 'OWNER') {
      setFormData({ email: 'owner@rentify.com', password: 'password123' });
    } else if (role === 'ADMIN') {
      setFormData({ email: 'admin@rentify.com', password: 'password123' });
    }
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="brand-logo-icon" style={{ margin: '0 auto 1rem' }}>
            <LogIn size={20} color="#fff" />
          </div>
          <h2 className="auth-title">Welcome Back to RentiFy</h2>
          <p className="auth-subtitle">Log in to manage your bookings, listings, or enquiries.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input with-icon"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="form-input with-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Fast-Login Section */}
        <div className="demo-accounts-box">
          <p className="demo-box-title">⚡ Instant Demo Testing Logins:</p>
          <div className="demo-buttons-grid">
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemoAccount('SEEKER')}>
              <User size={14} /> Seeker (Aarav)
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemoAccount('OWNER')}>
              <Building size={14} /> Owner (Mr. Rao)
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fillDemoAccount('ADMIN')}>
              <Shield size={14} /> Admin (Priya)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
