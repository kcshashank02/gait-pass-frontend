import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import JourneyHistory from '../components/User/JourneyHistory';
import RoutesFares from '../components/Journey/RoutesFares';  // ✅ Changed
import '../styles/journey.css';

const JourneyPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />
      <div className="dashboard-main">
        <JourneyHistory />
        <RoutesFares />  {/* ✅ Changed from FareCalculator */}
      </div>
    </div>
  );
};

export default JourneyPage;
