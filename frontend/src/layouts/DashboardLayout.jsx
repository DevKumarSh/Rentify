import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout-container">
        <DashboardSidebar />
        <main className="dashboard-main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
