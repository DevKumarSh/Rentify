import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { isValidEmail } from '../../utils/validators';
import { KeyRound, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import './AuthPages.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setStep(2);
    }
  }, [searchParams]);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid registered email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authService.forgotPassword(email);
      const generated = res?.data?.token || '';
      setGeneratedToken(generated);
      if (generated) {
        setToken(generated);
      }
      setSuccessMsg(res?.message || 'Password reset token generated successfully.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to generate password reset token. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter your 12-character reset token');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authService.resetPassword(token.trim(), newPassword);
      setSuccessMsg(res?.message || 'Your password has been reset successfully!');
      setResetCompleted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="brand-logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <KeyRound size={22} color="#fff" />
          </div>
          <h2 className="auth-title">
            {resetCompleted ? 'Password Updated!' : step === 1 ? 'Forgot Password?' : 'Reset Your Password'}
          </h2>
          <p className="auth-subtitle">
            {resetCompleted
              ? 'You can now sign in with your new credentials.'
              : step === 1
              ? 'Enter your registered email address and we will generate a secure reset token.'
              : 'Enter your verification token and choose a new password.'}
          </p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !resetCompleted && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            backgroundColor: 'var(--success-light, #ecfdf5)',
            color: '#065f46',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 500
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span>{successMsg}</span>
              {generatedToken && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <code style={{
                    backgroundColor: '#ffffff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #a7f3d0',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: '#047857'
                  }}>
                    {generatedToken}
                  </code>
                  <button
                    type="button"
                    onClick={copyToken}
                    className="btn btn-sm"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {resetCompleted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Your account password has been updated. Redirecting to login in 3 seconds...
            </p>
            <Link to="/login" className="btn btn-primary w-full">
              Proceed to Sign In
            </Link>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleRequestToken} className="auth-form">
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              <KeyRound size={18} />
              <span>{loading ? 'Generating Token...' : 'Generate Reset Token'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label className="form-label">Reset Token</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 8A3F12BC9E04"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (min 8 chars)</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              <CheckCircle2 size={18} />
              <span>{loading ? 'Resetting Password...' : 'Reset Password'}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => { setStep(1); setError(''); setSuccessMsg(''); }}
              style={{ marginTop: '0.5rem' }}
            >
              Request Different Token
            </button>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
