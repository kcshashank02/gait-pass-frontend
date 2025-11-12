import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import UserProfile from '../components/User/UserProfile';
import ChangePassword from '../components/User/ChangePassword';
import FaceRegistration from '../components/User/FaceRegistration';
import FaceVerification from '../components/User/FaceVerification';
import '../styles/profile.css';

const ProfilePage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />
      <div className="dashboard-main profile-page">
        <h1 className="page-title">My Profile</h1>
        <UserProfile />
        <ChangePassword />
        <div id="face-registration-section">
          <FaceRegistration />
        </div>
        <FaceVerification />
      </div>
    </div>
  );
};

export default ProfilePage;
