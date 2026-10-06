import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPhone, isValidPassword } from '../../utils/validators';
import { UserPlus, User, Building, Mail, Phone, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_SEEKER'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="brand-logo-icon" style={{ margin: '0 auto 1rem' }}>
            <UserPlus size={20} color="#fff" />
          </div>
          <h2 className="auth-title">Create Your RentiFy Account</h2>
          <p className="auth-subtitle">Join thousands of students and verified property owners.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065f46' }}>Account Created!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I want to join as:</label>
              <div className="role-selector-grid">
                <div
                  className={`role-select-card ${formData.role === 'ROLE_SEEKER' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'ROLE_SEEKER' })}
                >
                  <User size={22} />
                  <h4>Room Seeker</h4>
                  <p>Student / Professional</p>
                </div>

                <div
                  className={`role-select-card ${formData.role === 'ROLE_OWNER' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'ROLE_OWNER' })}
                >
                  <Building size={22} />
                  <h4>Room Owner</h4>
                  <p>Landlord / PG Operator</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  className="form-input with-icon"
                  placeholder="Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="aarav@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Mobile Number (10 digits)</label>
              <div className="auth-input-wrapper">
                <Phone size={18} className="auth-input-icon" />
                <input
                  type="tel"
                  className="form-input with-icon"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              <UserPlus size={18} />
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
