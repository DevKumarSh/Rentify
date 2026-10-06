import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Public Pages
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import SearchRooms from '../pages/public/SearchRooms';
import RoomDetailsPage from '../pages/public/RoomDetailsPage';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Seeker Pages
import SeekerDashboard from '../pages/seeker/SeekerDashboard';
import Profile from '../pages/seeker/Profile';
import Favorites from '../pages/seeker/Favorites';
import MyEnquiries from '../pages/seeker/MyEnquiries';
import MyReviews from '../pages/seeker/MyReviews';

// Owner Pages
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import AddRoom from '../pages/owner/AddRoom';
import MyListings from '../pages/owner/MyListings';
import EditListing from '../pages/owner/EditListing';
import OwnerEnquiries from '../pages/owner/OwnerEnquiries';
import OwnerProfile from '../pages/owner/OwnerProfile';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageListings from '../pages/admin/ManageListings';
import ListingVerification from '../pages/admin/ListingVerification';
import Reports from '../pages/admin/Reports';
import Analytics from '../pages/admin/Analytics';
import AdminProfile from '../pages/admin/AdminProfile';

// 404
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<SearchRooms />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Room Seeker Dashboard Routes */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['ROLE_SEEKER']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
        <Route path="/seeker/favorites" element={<Favorites />} />
        <Route path="/seeker/enquiries" element={<MyEnquiries />} />
        <Route path="/seeker/reviews" element={<MyReviews />} />
        <Route path="/seeker/profile" element={<Profile />} />
      </Route>

      {/* Room Owner Dashboard Routes */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['ROLE_OWNER']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/rooms/new" element={<AddRoom />} />
        <Route path="/owner/rooms" element={<MyListings />} />
        <Route path="/owner/rooms/:id/edit" element={<EditListing />} />
        <Route path="/owner/enquiries" element={<OwnerEnquiries />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        element={
          <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/verification" element={<ListingVerification />} />
        <Route path="/admin/listings" element={<ManageListings />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
