import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/User/Dashboard';
import '../styles/dashboard.css';

const UserDashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />
      <div className="dashboard-main">
        <Dashboard />
      </div>
    </div>
  );
};

export default UserDashboardPage;
