import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  MessageSquare,
  Heart,
  Star,
  Users,
  ShieldCheck,
  Flag,
  BarChart3,
  User,
  LogOut
} from 'lucide-react';
import './DashboardSidebar.css';

const DashboardSidebar = () => {
  const { user, role, isSeeker, isOwner, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* User profile summary */}
      <div className="sidebar-user-header">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="sidebar-user-details">
          <h4 className="sidebar-name">{user?.name}</h4>
          <span className="sidebar-role-tag">{role?.replace('ROLE_', '')}</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {/* Seeker Links */}
        {isSeeker && (
          <>
            <div className="sidebar-nav-title">Seeker Portal</div>
            <NavLink to="/seeker/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/seeker/favorites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Heart size={18} />
              <span>Saved Rooms</span>
            </NavLink>
            <NavLink to="/seeker/enquiries" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} />
              <span>My Enquiries</span>
            </NavLink>
            <NavLink to="/seeker/reviews" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Star size={18} />
              <span>My Reviews</span>
            </NavLink>
            <NavLink to="/seeker/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}

        {/* Owner Links */}
        {isOwner && (
          <>
            <div className="sidebar-nav-title">Owner Portal</div>
            <NavLink to="/owner/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/owner/rooms/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={18} />
              <span>Add New Listing</span>
            </NavLink>
            <NavLink to="/owner/rooms" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building size={18} />
              <span>My Room Listings</span>
            </NavLink>
            <NavLink to="/owner/enquiries" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} />
              <span>Tenant Enquiries</span>
            </NavLink>
            <NavLink to="/owner/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>Owner Profile</span>
            </NavLink>
          </>
        )}

        {/* Admin Links */}
        {isAdmin && (
          <>
            <div className="sidebar-nav-title">Admin Management</div>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/admin/verification" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={18} />
              <span>Listing Verification</span>
            </NavLink>
            <NavLink to="/admin/listings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building size={18} />
              <span>Manage Listings</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Flag size={18} />
              <span>Flagged Reports</span>
            </NavLink>
            <NavLink to="/admin/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>System Analytics</span>
            </NavLink>
            <NavLink to="/admin/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>Admin Profile</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button type="button" className="btn-sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
