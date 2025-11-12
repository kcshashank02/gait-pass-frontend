import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/Admin/AdminDashboard';
import MLServiceStatus from '../components/Admin/MLServiceStatus';  // ✅ NEW
import '../styles/admin.css';

const AdminDashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <div className="dashboard-main">
        <Dashboard />
        <MLServiceStatus />  {/* ✅ NEW */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
