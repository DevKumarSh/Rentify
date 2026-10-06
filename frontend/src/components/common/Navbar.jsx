import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Search,
  Heart,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Building,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, role, isAuthenticated, isSeeker, isOwner, isAdmin, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const switchDemoRole = async (targetRole) => {
    if (targetRole === 'SEEKER') {
      await login('seeker@rentify.com', 'password123');
      navigate('/seeker/dashboard');
    } else if (targetRole === 'OWNER') {
      await login('owner@rentify.com', 'password123');
      navigate('/owner/dashboard');
    } else if (targetRole === 'ADMIN') {
      await login('admin@rentify.com', 'password123');
      navigate('/admin/dashboard');
    }
    setDemoMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-icon">
            <Building size={22} color="#ffffff" />
          </div>
          <span className="brand-title">
            Renti<span className="brand-highlight">Fy</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>
            <Search size={17} />
            <span>Explore Rooms</span>
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            About Us
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        {/* Right Action Items */}
        <div className="nav-actions desktop-only">
          {/* Quick Demo Switcher for pair-programming & evaluation */}
          <div className="demo-switcher-dropdown">
            <button
              type="button"
              className="btn btn-sm demo-badge-btn"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              title="Switch role instantly to test all features"
            >
              <Shield size={14} />
              <span>Demo Persona: {user ? role?.replace('ROLE_', '') : 'Guest'}</span>
            </button>
            {demoMenuOpen && (
              <div className="dropdown-menu demo-menu">
                <div className="dropdown-header">Quick Role Switcher</div>
                <button className="dropdown-item" onClick={() => switchDemoRole('SEEKER')}>
                  <User size={15} /> Log in as Room Seeker (Aarav)
                </button>
                <button className="dropdown-item" onClick={() => switchDemoRole('OWNER')}>
                  <Building size={15} /> Log in as Room Owner (Mr. Rao)
                </button>
                <button className="dropdown-item" onClick={() => switchDemoRole('ADMIN')}>
                  <Shield size={15} /> Log in as Platform Admin (Priya)
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {isSeeker && (
                <Link to="/seeker/favorites" className="nav-icon-btn" title="Saved Rooms">
                  <Heart size={20} />
                </Link>
              )}

              {isOwner && (
                <Link to="/owner/rooms/new" className="btn btn-sm btn-primary">
                  <PlusCircle size={16} />
                  <span>List a Room</span>
                </Link>
              )}

              {/* User Avatar & Dropdown */}
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar-badge">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="dropdown-menu user-menu">
                    <div className="dropdown-user-info">
                      <p className="user-full-name">{user?.name}</p>
                      <span className="user-role-badge">{role?.replace('ROLE_', '')}</span>
                    </div>
                    <div className="dropdown-divider" />
                    
                    <Link
                      to={getDashboardLink()}
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Home size={16} />
                      <span>My Dashboard</span>
                    </Link>

                    {isSeeker && (
                      <>
                        <Link
                          to="/seeker/enquiries"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <MessageSquare size={16} />
                          <span>My Enquiries</span>
                        </Link>
                        <Link
                          to="/seeker/favorites"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Heart size={16} />
                          <span>Favorites</span>
                        </Link>
                      </>
                    )}

                    {isOwner && (
                      <>
                        <Link
                          to="/owner/rooms"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Building size={16} />
                          <span>My Room Listings</span>
                        </Link>
                        <Link
                          to="/owner/enquiries"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <MessageSquare size={16} />
                          <span>Tenant Enquiries</span>
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin/verification"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <CheckCircle2 size={16} />
                          <span>Verify Listings</span>
                        </Link>
                        <Link
                          to="/admin/reports"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Shield size={16} />
                          <span>Open Reports</span>
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-sm btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer mobile-only">
          <Link to="/rooms" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Search size={18} /> Explore Rooms
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            About RentiFy
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact & Support
          </Link>

          <div className="mobile-divider" />

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Home size={18} /> Dashboard ({role?.replace('ROLE_', '')})
              </Link>
              {isOwner && (
                <Link to="/owner/rooms/new" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <PlusCircle size={18} /> List a New Room
                </Link>
              )}
              {isSeeker && (
                <Link to="/seeker/favorites" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={18} /> My Saved Rooms
                </Link>
              )}
              <button className="mobile-nav-link text-danger" onClick={handleLogout}>
                <LogOut size={18} /> Log Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-grid">
              <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
