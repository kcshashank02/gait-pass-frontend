import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdPeople, MdLocationOn, MdAdminPanelSettings, MdTrain } from 'react-icons/md';
import { adminApi } from '../../api/adminApi';
import { stationApi } from '../../api/stationApi';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStations: 0,
    totalAdmins: 0,
    totalJourneys: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Use the correct API calls from adminApi and stationApi
      const [usersRes, stationsRes, adminsRes] = await Promise.all([
        adminApi.getAllUsers().catch(() => ({ users: [] })),
        stationApi.getAllStations().catch(() => ({ stations: [] })),
        adminApi.getAllAdmins().catch(() => ({ admins: [] }))
      ]);

      setStats({
        totalUsers: usersRes.users?.length || 0,
        totalStations: stationsRes.stations?.length || 0,
        totalAdmins: adminsRes.admins?.length || 0,
        totalJourneys: 0 // Remove journeys count since endpoint doesn't exist
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard statistics..." />;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and monitor the Gait-Pass system</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card users-stat">
          <Link to="/admin/users" className="stat-link-wrapper">
            <div className="stat-icon"><MdPeople /></div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <span className="stat-link">Manage Users →</span>
            </div>
          </Link>
        </Card>

        <Card className="stat-card stations-stat">
          <Link to="/admin/stations" className="stat-link-wrapper">
            <div className="stat-icon"><MdLocationOn /></div>
            <div className="stat-info">
              <h3>Total Stations</h3>
              <p className="stat-value">{stats.totalStations}</p>
              <span className="stat-link">Manage Stations →</span>
            </div>
          </Link>
        </Card>

        <Card className="stat-card admins-stat">
          <Link to="/admin/admins" className="stat-link-wrapper">
            <div className="stat-icon"><MdAdminPanelSettings /></div>
            <div className="stat-info">
              <h3>Total Admins</h3>
              <p className="stat-value">{stats.totalAdmins}</p>
              <span className="stat-link">Manage Admins →</span>
            </div>
          </Link>
        </Card>

        {/* Removed Total Fares card - not needed on dashboard */}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/station-ops" className="action-card">
            <div className="action-icon">🚉</div>
            <h3>Station Operations</h3>
            <p>Process entry/exit and emergency operations</p>
          </Link>

          <Link to="/admin/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>User Management</h3>
            <p>View and manage all registered users</p>
          </Link>

          <Link to="/admin/stations" className="action-card">
            <div className="action-icon">📍</div>
            <h3>Station Management</h3>
            <p>Add, edit, or remove stations</p>
          </Link>

          <Link to="/admin/fares" className="action-card">
            <div className="action-icon">💰</div>
            <h3>Fare Management</h3>
            <p>Configure fares between stations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
