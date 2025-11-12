import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MdPerson, MdEmail, MdPhone, MdAdminPanelSettings } from 'react-icons/md';
import Card from '../Common/Card';
import '../../styles/profile.css';

const UserProfile = () => {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (user?.fullName && user.fullName !== 'undefined undefined') {
      return user.fullName;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };

  return (
    <Card title="Profile Information" className="profile-info-card">
      <div className="profile-details">
        <div className="profile-item">
          <div className="profile-icon">
            <MdPerson />
          </div>
          <div className="profile-content">
            <label>Full Name</label>
            <p>{getDisplayName()}</p>
          </div>
        </div>

        <div className="profile-item">
          <div className="profile-icon">
            <MdEmail />
          </div>
          <div className="profile-content">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="profile-item">
          <div className="profile-icon">
            <MdPhone />
          </div>
          <div className="profile-content">
            <label>Phone</label>
            <p>{user?.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="profile-item">
          <div className="profile-icon">
            <MdAdminPanelSettings />
          </div>
          <div className="profile-content">
            <label>Account Type</label>
            <p className="role-badge">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
