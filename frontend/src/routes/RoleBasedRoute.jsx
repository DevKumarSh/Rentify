import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying role permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to proper role dashboard
    if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'ROLE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/seeker/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
