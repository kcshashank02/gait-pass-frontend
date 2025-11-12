import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import StationOperations from '../components/Admin/StationOperations';
import EmergencyExit from '../components/Admin/EmergencyExit';
import '../styles/admin.css';

const StationOperationsPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <div className="dashboard-main">
        <StationOperations />
        <EmergencyExit />
      </div>
    </div>
  );
};

export default StationOperationsPage;
