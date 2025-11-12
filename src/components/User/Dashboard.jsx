import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useJourney } from '../../hooks/useJourney';
import { MdAccountBalanceWallet, MdTrain } from 'react-icons/md';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const { currentJourney, journeyHistory, loading: journeyLoading } = useJourney(user?.id);

  if (walletLoading || journeyLoading) {
    return <Loader message="Loading dashboard..." />;
  }

  const hasActiveJourney = currentJourney && 
                          currentJourney.entry_station_name && 
                          !currentJourney.exit_time;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
        <p>Manage your account and track your journeys</p>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card wallet-stat">
          <div className="stat-icon">
            <MdAccountBalanceWallet />
          </div>
          <div className="stat-info">
            <h3>Wallet Balance</h3>
            <p className="stat-value">
              {wallet ? formatCurrency(wallet.balance) : 'N/A'}
            </p>
            <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
          </div>
        </Card>

        <Card className="stat-card journey-stat">
          <div className="stat-icon">
            <MdTrain />
          </div>
          <div className="stat-info">
            <h3>Total Journeys</h3>
            <p className="stat-value">{journeyHistory?.length || 0}</p>
            <Link to="/journey" className="stat-link">View History →</Link>
          </div>
        </Card>
      </div>

      {hasActiveJourney && (
        <Card title="Current Journey" className="current-journey-card">
          <div className="journey-details">
            <div className="journey-info">
              <p><strong>Entry Station:</strong> {currentJourney.entry_station_name}</p>
              <p><strong>Entry Time:</strong> {formatDate(currentJourney.entry_time)}</p>
              <p><strong>Status:</strong> <span className="status-badge in-progress">In Progress</span></p>
            </div>
          </div>
        </Card>
      )}

      <Card title="Recent Journeys" className="recent-journeys-card">
        {journeyHistory && journeyHistory.length > 0 ? (
          <div className="journey-list">
            {journeyHistory.slice(0, 5).map((journey, index) => (
              <div key={index} className="journey-item">
                <div className="journey-route">
                  <span className="station-name">{journey.entry_station_name}</span>
                  <span className="route-arrow">→</span>
                  <span className="station-name">{journey.exit_station_name || 'In Progress'}</span>
                </div>
                <div className="journey-meta">
                  <span className="journey-date">{formatDate(journey.entry_time)}</span>
                  {journey.fare_amount && (
                    <span className="journey-fare">{formatCurrency(journey.fare_amount)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No journeys yet. Start your first journey!</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;




// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { useWallet } from '../../hooks/useWallet';
// import { useJourney } from '../../hooks/useJourney';
// import { faceApi } from '../../api/faceApi';
// import { MdAccountBalanceWallet, MdTrain, MdFace, MdCheckCircle, MdWarning } from 'react-icons/md';
// import { formatCurrency, formatDate } from '../../utils/helpers';
// import Card from '../Common/Card';
// import Loader from '../Common/Loader';
// import '../../styles/dashboard.css';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const { wallet, loading: walletLoading } = useWallet();
//   const { currentJourney, journeyHistory, loading: journeyLoading } = useJourney(user?.id);
//   const [faceRegistered, setFaceRegistered] = useState(null);
//   const [checkingFace, setCheckingFace] = useState(true);

//   useEffect(() => {
//     checkFaceRegistration();
//   }, [user?.id]);

//   const checkFaceRegistration = async () => {
//     if (!user?.id) {
//       setCheckingFace(false);
//       return;
//     }

//     try {
//       setCheckingFace(true);
//       const response = await faceApi.getUserEmbedding(user.id);
      
//       // Check if user has face embedding registered
//       if (response && (response.embedding || response.has_embedding || response.success)) {
//         setFaceRegistered(true);
//       } else {
//         setFaceRegistered(false);
//       }
//     } catch (error) {
//       // If 404 or error, assume not registered
//       setFaceRegistered(false);
//     } finally {
//       setCheckingFace(false);
//     }
//   };

//   const scrollToFaceRegistration = () => {
//     const faceRegSection = document.getElementById('face-registration-section');
//     if (faceRegSection) {
//       faceRegSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   if (walletLoading || journeyLoading) {
//     return <Loader message="Loading dashboard..." />;
//   }

//   const hasActiveJourney = currentJourney && 
//                           currentJourney.entry_station_name && 
//                           !currentJourney.exit_time;

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
//         <p>Manage your account and track your journeys</p>
//       </div>

//       <div className="dashboard-stats">
//         <Card className="stat-card wallet-stat">
//           <div className="stat-icon">
//             <MdAccountBalanceWallet />
//           </div>
//           <div className="stat-info">
//             <h3>Wallet Balance</h3>
//             <p className="stat-value">
//               {wallet ? formatCurrency(wallet.balance) : 'N/A'}
//             </p>
//             <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
//           </div>
//         </Card>

//         <Card className="stat-card journey-stat">
//           <div className="stat-icon">
//             <MdTrain />
//           </div>
//           <div className="stat-info">
//             <h3>Total Journeys</h3>
//             <p className="stat-value">{journeyHistory?.length || 0}</p>
//             <Link to="/journey" className="stat-link">View History →</Link>
//           </div>
//         </Card>

//         <Card className="stat-card face-stat">
//           <div className="stat-icon">
//             <MdFace />
//           </div>
//           <div className="stat-info">
//             <h3>Face Registration</h3>
            
//             {checkingFace ? (
//               <p className="stat-value checking">Checking...</p>
//             ) : faceRegistered ? (
//               <>
//                 <p className="stat-value registered">
//                   <MdCheckCircle style={{ fontSize: '20px', verticalAlign: 'middle' }} /> Registered
//                 </p>
//                 <button 
//                   onClick={scrollToFaceRegistration} 
//                   className="stat-link-btn"
//                 >
//                   Update Face →
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p className="stat-value not-registered">
//                   <MdWarning style={{ fontSize: '20px', verticalAlign: 'middle' }} /> Not Registered
//                 </p>
//                 <button 
//                   onClick={scrollToFaceRegistration} 
//                   className="stat-link-btn"
//                 >
//                   Register Face →
//                 </button>
//               </>
//             )}
//           </div>
//         </Card>
//       </div>

//       {hasActiveJourney && (
//         <Card title="Current Journey" className="current-journey-card">
//           <div className="journey-details">
//             <div className="journey-info">
//               <p><strong>Entry Station:</strong> {currentJourney.entry_station_name}</p>
//               <p><strong>Entry Time:</strong> {formatDate(currentJourney.entry_time)}</p>
//               <p><strong>Status:</strong> <span className="status-badge in-progress">In Progress</span></p>
//             </div>
//           </div>
//         </Card>
//       )}

//       <Card title="Recent Journeys" className="recent-journeys-card">
//         {journeyHistory && journeyHistory.length > 0 ? (
//           <div className="journey-list">
//             {journeyHistory.slice(0, 5).map((journey, index) => (
//               <div key={index} className="journey-item">
//                 <div className="journey-route">
//                   <span className="station-name">{journey.entry_station_name}</span>
//                   <span className="route-arrow">→</span>
//                   <span className="station-name">{journey.exit_station_name || 'In Progress'}</span>
//                 </div>
//                 <div className="journey-meta">
//                   <span className="journey-date">{formatDate(journey.entry_time)}</span>
//                   {journey.fare_amount && (
//                     <span className="journey-fare">{formatCurrency(journey.fare_amount)}</span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="no-data">No journeys yet. Start your first journey!</p>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;
