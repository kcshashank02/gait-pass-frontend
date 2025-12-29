import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useJourney } from '../../hooks/useJourney';
import { MdAccountBalanceWallet, MdTrain, MdWarning, MdLocationOn, MdAccessTime } from 'react-icons/md';
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

  // ✅ Handle all possible field name variations
  const entryStationName = currentJourney?.entry_station_name || 
                           currentJourney?.entryStationName ||
                           currentJourney?.entrystationname;
  
  const entryStationCode = currentJourney?.entry_station_code || 
                           currentJourney?.entryStationCode ||
                           currentJourney?.entrystationcode;

  const entryTime = currentJourney?.entry_time || 
                    currentJourney?.entryTime ||
                    currentJourney?.entrytime;
    console.log("entryTime raw:", entryTime);
  const exitTime = currentJourney?.exit_time || 
                   currentJourney?.exitTime ||
                   currentJourney?.exittime;

  const hasActiveJourney = !!(currentJourney && entryTime && !exitTime);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
        <p>Manage your account and track your journeys</p>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <Card className="stat-card wallet-stat">
          <div className="stat-icon"><MdAccountBalanceWallet /></div>
          <div className="stat-info">
            <h3>Wallet Balance</h3>
            <p className="stat-value">{wallet ? formatCurrency(wallet.balance) : 'N/A'}</p>
            <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
          </div>
        </Card>

        <Card className="stat-card journey-stat">
          <div className="stat-icon"><MdTrain /></div>
          <div className="stat-info">
            <h3>Total Journeys</h3>
            <p className="stat-value">{journeyHistory?.length || 0}</p>
            <Link to="/journey" className="stat-link">View History →</Link>
          </div>
        </Card>
      </div>

      {/* ✅ Active Journey Details Card */}
      {hasActiveJourney && (
        <Card title="🚇 Active Journey" className="active-journey-card">
          <div style={{
            padding: '20px',
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <MdLocationOn size={24} color="#2563eb" />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Station</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>
                    {entryStationName || entryStationCode || 'Unknown Station'}
                  </p>
                  {entryStationCode && (
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#475569' }}>
                      Code: {entryStationCode}
                    </p>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px'
              }}>
                <MdAccessTime size={24} color="#2563eb" />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Time</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#1e40af' }}>
                    {formatDate(entryTime)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#fff',
              borderRadius: '6px',
              border: '1px solid #93c5fd',
              marginTop: '16px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#1e40af',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="pulse-indicator"></span>
                Status: <span style={{ color: '#059669' }}>In Transit</span>
              </p>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '6px',
              border: '1px solid #fbbf24'
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
                💡 <strong>Tip:</strong> To start a new journey, you must first complete your exit at a station gate.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Journeys */}
      <Card title="Recent Journeys" className="recent-journeys-card">
        {journeyHistory && journeyHistory.length > 0 ? (
          <div className="journey-list">
            {journeyHistory.slice(0, 5).map((journey, index) => {
              const entryStation = journey.entry_station_name || 
                                   journey.entryStationName || 
                                   journey.entrystationname || 
                                   journey.entry_station_code ||
                                   'Unknown';
              
              const exitStation = journey.exit_station_name || 
                                  journey.exitStationName || 
                                  journey.exitstationname || 
                                  journey.exit_station_code;
              
              const journeyEntryTime = journey.entry_time || 
                                       journey.entryTime || 
                                       journey.entrytime;
              
              const fareAmount = journey.fare_amount || 
                                 journey.fareAmount || 
                                 journey.fareamount;

              return (
                <div key={journey._id || index} className="journey-item">
                  <div className="journey-route">
                    <span className="station-name">{entryStation}</span>
                    <span className="route-arrow">→</span>
                    <span className="station-name">{exitStation || 'In Progress'}</span>
                  </div>
                  <div className="journey-meta">
                    <span className="journey-date">{formatDate(journeyEntryTime)}</span>
                    {fareAmount && (
                      <span className="journey-fare">{formatCurrency(fareAmount)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-data">No journeys yet. Start your first journey!</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;

























// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {useAuth }from '../../hooks/useAuth';
// import {useWallet} from '../../hooks/useWallet';
// import {useJourney} from '../../hooks/useJourney';
// import { MdAccountBalanceWallet, MdTrain, MdWarning, MdLocationOn, MdAccessTime } from 'react-icons/md';
// import { formatCurrency, formatDate } from '../../utils/helpers';
// import Card from '../Common/Card';
// import Loader from '../Common/Loader';
// import '../../styles/dashboard.css';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const { wallet, loading: walletLoading } = useWallet();
//   const { currentJourney, journeyHistory, loading: journeyLoading } = useJourney(user?.id);

//   // Debug log to see the actual journey structure
//   useEffect(() => {
//     if (currentJourney) {
//       console.log('🔍 Full Current Journey Object:', currentJourney);
//     }
//   }, [currentJourney]);

//   if (walletLoading || journeyLoading) {
//     return <Loader message="Loading dashboard..." />;
//   }

//   // ✅ FIXED: Check all possible field name variations
//   // Backend returns: entry_station_name, entry_time, exit_time (with underscores)
//   const entryStationName = currentJourney?.entry_station_name || 
//                            currentJourney?.entryStationName ||
//                            currentJourney?.entrystationname;
  
//   const entryStationCode = currentJourney?.entry_station_code || 
//                            currentJourney?.entryStationCode ||
//                            currentJourney?.entrystationcode;
  
//   const entryTime = currentJourney?.entry_time || 
//                     currentJourney?.entryTime ||
//                     currentJourney?.entrytime;
  
//   const exitTime = currentJourney?.exit_time || 
//                    currentJourney?.exitTime ||
//                    currentJourney?.exittime;

//   // ✅ FIXED: Journey is active if it exists and has entry_time but NO exit_time
//   const hasActiveJourney = !!(currentJourney && entryTime && !exitTime);

//   console.log('🔍 Dashboard Debug:', {
//     hasCurrentJourney: !!currentJourney,
//     entryStationName,
//     entryStationCode,
//     entryTime,
//     exitTime,
//     hasActiveJourney
//   });

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
//         <p>Manage your account and track your journeys</p>
//       </div>

//       {/* ✅ ACTIVE JOURNEY WARNING BANNER
//       {hasActiveJourney && (
//         <div style={{
//           padding: '16px 20px',
//           backgroundColor: '#fef3c7',
//           border: '2px solid #f59e0b',
//           borderRadius: '12px',
//           marginBottom: '24px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '12px'
//         }}>
//           <MdWarning size={32} color="#f59e0b" />
//           <div style={{ flex: 1 }}>
//             <h3 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '18px', fontWeight: '700' }}>
//               ⚠️ You Have an Active Journey
//             </h3>
//             <p style={{ margin: 0, color: '#78350f', fontSize: '15px' }}>
//               You entered at <strong>{entryStationName || entryStationCode || 'Station'}</strong> on {formatDate(entryTime)}. 
//               Please complete your exit at a destination station before starting a new journey.
//             </p>
//           </div>
//         </div>
//       )} */}

//       <div className="dashboard-stats">
//         <Card className="stat-card wallet-stat">
//           <div className="stat-icon"><MdAccountBalanceWallet /></div>
//           <div className="stat-info">
//             <h3>Wallet Balance</h3>
//             <p className="stat-value">{wallet ? formatCurrency(wallet.balance) : 'N/A'}</p>
//             <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
//           </div>
//         </Card>

//         <Card className="stat-card journey-stat">
//           <div className="stat-icon"><MdTrain /></div>
//           <div className="stat-info">
//             <h3>Total Journeys</h3>
//             <p className="stat-value">{journeyHistory?.length || 0}</p>
//             <Link to="/journey" className="stat-link">View History →</Link>
//           </div>
//         </Card>
//       </div>

//       {/* ✅ ACTIVE JOURNEY DETAILS CARD */}
//       {hasActiveJourney && (
//         <Card title="🚇 Active Journey" className="active-journey-card">
//           <div style={{
//             padding: '20px',
//             backgroundColor: '#dbeafe',
//             borderRadius: '8px',
//             border: '2px solid #3b82f6'
//           }}>
//             <div style={{ marginBottom: '16px' }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 marginBottom: '12px'
//               }}>
//                 <MdLocationOn size={24} color="#2563eb" />
//                 <div>
//                   <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Station</p>
//                   <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>
//                     {entryStationName || entryStationCode || 'Unknown Station'}
//                   </p>
//                   {entryStationCode && (
//                     <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#475569' }}>
//                       Code: {entryStationCode}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 marginTop: '12px'
//               }}>
//                 <MdAccessTime size={24} color="#2563eb" />
//                 <div>
//                   <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Time</p>
//                   <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#1e40af' }}>
//                     {formatDate(entryTime)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div style={{
//               padding: '12px',
//               backgroundColor: '#fff',
//               borderRadius: '6px',
//               border: '1px solid #93c5fd',
//               marginTop: '16px'
//             }}>
//               <p style={{
//                 margin: 0,
//                 fontSize: '14px',
//                 color: '#1e40af',
//                 fontWeight: '600',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 <span className="pulse-indicator"></span>
//                 Status: <span style={{ color: '#059669' }}>In Transit</span>
//               </p>
//             </div>

//             <div style={{
//               marginTop: '16px',
//               padding: '12px',
//               backgroundColor: '#fef3c7',
//               borderRadius: '6px',
//               border: '1px solid #fbbf24'
//             }}>
//               <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
//                 💡 <strong>Tip:</strong> To start a new journey, you must first complete your exit at a station gate.
//               </p>
//             </div>

            
//           </div>
//         </Card>
//       )}

//       {/* Recent Journeys */}
//       <Card title="Recent Journeys" className="recent-journeys-card">
//         {journeyHistory && journeyHistory.length > 0 ? (
//           <div className="journey-list">
//             {journeyHistory.slice(0, 5).map((journey, index) => {
//               // Handle multiple field name variations
//               const entryStation = journey.entry_station_name || 
//                                    journey.entryStationName || 
//                                    journey.entrystationname || 
//                                    journey.entry_station_code ||
//                                    'Unknown';
              
//               const exitStation = journey.exit_station_name || 
//                                   journey.exitStationName || 
//                                   journey.exitstationname || 
//                                   journey.exit_station_code;
              
//               const journeyEntryTime = journey.entry_time || 
//                                        journey.entryTime || 
//                                        journey.entrytime;
              
//               const fareAmount = journey.fare_amount || 
//                                  journey.fareAmount || 
//                                  journey.fareamount;

//               return (
//                 <div key={journey._id || index} className="journey-item">
//                   <div className="journey-route">
//                     <span className="station-name">{entryStation}</span>
//                     <span className="route-arrow">→</span>
//                     <span className="station-name">{exitStation || 'In Progress'}</span>
//                   </div>
//                   <div className="journey-meta">
//                     <span className="journey-date">{formatDate(journeyEntryTime)}</span>
//                     {fareAmount && (
//                       <span className="journey-fare">{formatCurrency(fareAmount)}</span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <p className="no-data">No journeys yet. Start your first journey!</p>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;























// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { useAuth } from '../../hooks/useAuth';
// // import { useWallet } from '../../hooks/useWallet';
// // import { useJourney } from '../../hooks/useJourney';
// // import { MdAccountBalanceWallet, MdTrain } from 'react-icons/md';
// // import { formatCurrency, formatDate } from '../../utils/helpers';
// // import Card from '../Common/Card';
// // import Loader from '../Common/Loader';
// // import '../../styles/dashboard.css';

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const { wallet, loading: walletLoading } = useWallet();
// //   const { currentJourney, journeyHistory, loading: journeyLoading } = useJourney(user?.id);

// //   if (walletLoading || journeyLoading) {
// //     return <Loader message="Loading dashboard..." />;
// //   }

// //   // ✅ Check if user has an active/ongoing journey
// //   const hasActiveJourney = currentJourney && currentJourney.entrystationname && !currentJourney.exittime;

// //   return (
// //     <div className="dashboard-container">
// //       <div className="dashboard-header">
// //         <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
// //         <p>Manage your account and track your journeys</p>
// //       </div>

// //       {/* ✅ ACTIVE JOURNEY WARNING BANNER */}
// //       {hasActiveJourney && (
// //         <div style={{
// //           padding: '16px 20px',
// //           backgroundColor: '#fef3c7',
// //           border: '2px solid #f59e0b',
// //           borderRadius: '12px',
// //           marginBottom: '24px',
// //           display: 'flex',
// //           alignItems: 'center',
// //           gap: '12px'
// //         }}>
// //           <MdWarning size={32} color="#f59e0b" />
// //           <div style={{ flex: 1 }}>
// //             <h3 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '18px', fontWeight: '700' }}>
// //               ⚠️ You Have an Active Journey
// //             </h3>
// //             <p style={{ margin: 0, color: '#78350f', fontSize: '15px' }}>
// //               You entered at <strong>{currentJourney.entrystationname}</strong> on {formatDate(currentJourney.entrytime)}. 
// //               Please complete your exit at a destination station before starting a new journey.
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       <div className="dashboard-stats">
// //         <Card className="stat-card wallet-stat">
// //           <div className="stat-icon"><MdAccountBalanceWallet /></div>
// //           <div className="stat-info">
// //             <h3>Wallet Balance</h3>
// //             <p className="stat-value">{wallet ? formatCurrency(wallet.balance) : 'N/A'}</p>
// //             <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
// //           </div>
// //         </Card>

// //         <Card className="stat-card journey-stat">
// //           <div className="stat-icon"><MdTrain /></div>
// //           <div className="stat-info">
// //             <h3>Total Journeys</h3>
// //             <p className="stat-value">{journeyHistory?.length || 0}</p>
// //             <Link to="/journey" className="stat-link">View History →</Link>
// //           </div>
// //         </Card>
// //       </div>

// //       {/* ✅ ACTIVE JOURNEY DETAILS CARD */}
// //       {hasActiveJourney && (
// //         <Card title="🚇 Active Journey" className="active-journey-card">
// //           <div style={{
// //             padding: '20px',
// //             backgroundColor: '#dbeafe',
// //             borderRadius: '8px',
// //             border: '2px solid #3b82f6'
// //           }}>
// //             <div style={{ marginBottom: '16px' }}>
// //               <div style={{
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 gap: '10px',
// //                 marginBottom: '12px'
// //               }}>
// //                 <MdLocationOn size={24} color="#2563eb" />
// //                 <div>
// //                   <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Station</p>
// //                   <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>
// //                     {currentJourney.entrystationname}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div style={{
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 gap: '10px',
// //                 marginTop: '12px'
// //               }}>
// //                 <MdAccessTime size={24} color="#2563eb" />
// //                 <div>
// //                   <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontWeight: '600' }}>Entry Time</p>
// //                   <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#1e40af' }}>
// //                     {formatDate(currentJourney.entrytime)}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div style={{
// //               padding: '12px',
// //               backgroundColor: '#fff',
// //               borderRadius: '6px',
// //               border: '1px solid #93c5fd',
// //               marginTop: '16px'
// //             }}>
// //               <p style={{
// //                 margin: 0,
// //                 fontSize: '14px',
// //                 color: '#1e40af',
// //                 fontWeight: '600',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 gap: '8px'
// //               }}>
// //                 <span style={{
// //                   display: 'inline-block',
// //                   width: '10px',
// //                   height: '10px',
// //                   borderRadius: '50%',
// //                   backgroundColor: '#10b981',
// //                   animation: 'pulse 2s infinite'
// //                 }}></span>
// //                 Status: <span style={{ color: '#059669' }}>In Transit</span>
// //               </p>
// //             </div>

// //             <div style={{
// //               marginTop: '16px',
// //               padding: '12px',
// //               backgroundColor: '#fef3c7',
// //               borderRadius: '6px',
// //               border: '1px solid #fbbf24'
// //             }}>
// //               <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
// //                 💡 <strong>Tip:</strong> To start a new journey, you must first complete your exit at a station gate.
// //               </p>
// //             </div>
// //           </div>
// //         </Card>
// //       )}

// //       {/* Recent Journeys */}
// //       <Card title="Recent Journeys" className="recent-journeys-card">
// //         {journeyHistory && journeyHistory.length > 0 ? (
// //           <div className="journey-list">
// //             {journeyHistory.slice(0, 5).map((journey, index) => (
// //               <div key={index} className="journey-item">
// //                 <div className="journey-route">
// //                   <span className="station-name">{journey.entrystationname}</span>
// //                   <span className="route-arrow">→</span>
// //                   <span className="station-name">{journey.exitstationname || 'In Progress'}</span>
// //                 </div>
// //                 <div className="journey-meta">
// //                   <span className="journey-date">{formatDate(journey.entrytime)}</span>
// //                   {journey.fareamount && (
// //                     <span className="journey-fare">{formatCurrency(journey.fareamount)}</span>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="no-data">No journeys yet. Start your first journey!</p>
// //         )}
// //       </Card>

// //       <style jsx>{`
// //         @keyframes pulse {
// //           0%, 100% {
// //             opacity: 1;
// //           }
// //           50% {
// //             opacity: 0.5;
// //           }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Dashboard;








// // // import React from 'react';
// // // import { Link } from 'react-router-dom';
// // // import { useAuth } from '../../hooks/useAuth';
// // // import { useWallet } from '../../hooks/useWallet';
// // // import { useJourney } from '../../hooks/useJourney';
// // // import { MdAccountBalanceWallet, MdTrain } from 'react-icons/md';
// // // import { formatCurrency, formatDate } from '../../utils/helpers';
// // // import Card from '../Common/Card';
// // // import Loader from '../Common/Loader';
// // // import '../../styles/dashboard.css';

// // // const Dashboard = () => {
// // //   const { user } = useAuth();
// // //   const { wallet, loading: walletLoading } = useWallet();
// // //   const { currentJourney, journeyHistory, loading: journeyLoading } = useJourney(user?.id);

// // //   if (walletLoading || journeyLoading) {
// // //     return <Loader message="Loading dashboard..." />;
// // //   }

// // //   const hasActiveJourney = currentJourney && 
// // //                           currentJourney.entry_station_name && 
// // //                           !currentJourney.exit_time;

// // //   return (
// // //     <div className="dashboard-container">
// // //       <div className="dashboard-header">
// // //         <h1>Welcome back, {user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
// // //         <p>Manage your account and track your journeys</p>
// // //       </div>

// // //       <div className="dashboard-stats">
// // //         <Card className="stat-card wallet-stat">
// // //           <div className="stat-icon">
// // //             <MdAccountBalanceWallet />
// // //           </div>
// // //           <div className="stat-info">
// // //             <h3>Wallet Balance</h3>
// // //             <p className="stat-value">
// // //               {wallet ? formatCurrency(wallet.balance) : 'N/A'}
// // //             </p>
// // //             <Link to="/wallet" className="stat-link">Manage Wallet →</Link>
// // //           </div>
// // //         </Card>

// // //         <Card className="stat-card journey-stat">
// // //           <div className="stat-icon">
// // //             <MdTrain />
// // //           </div>
// // //           <div className="stat-info">
// // //             <h3>Total Journeys</h3>
// // //             <p className="stat-value">{journeyHistory?.length || 0}</p>
// // //             <Link to="/journey" className="stat-link">View History →</Link>
// // //           </div>
// // //         </Card>
// // //       </div>

// // //       {hasActiveJourney && (
// // //         <Card title="Current Journey" className="current-journey-card">
// // //           <div className="journey-details">
// // //             <div className="journey-info">
// // //               <p><strong>Entry Station:</strong> {currentJourney.entry_station_name}</p>
// // //               <p><strong>Entry Time:</strong> {formatDate(currentJourney.entry_time)}</p>
// // //               <p><strong>Status:</strong> <span className="status-badge in-progress">In Progress</span></p>
// // //             </div>
// // //           </div>
// // //         </Card>
// // //       )}

// // //       <Card title="Recent Journeys" className="recent-journeys-card">
// // //         {journeyHistory && journeyHistory.length > 0 ? (
// // //           <div className="journey-list">
// // //             {journeyHistory.slice(0, 5).map((journey, index) => (
// // //               <div key={index} className="journey-item">
// // //                 <div className="journey-route">
// // //                   <span className="station-name">{journey.entry_station_name}</span>
// // //                   <span className="route-arrow">→</span>
// // //                   <span className="station-name">{journey.exit_station_name || 'In Progress'}</span>
// // //                 </div>
// // //                 <div className="journey-meta">
// // //                   <span className="journey-date">{formatDate(journey.entry_time)}</span>
// // //                   {journey.fare_amount && (
// // //                     <span className="journey-fare">{formatCurrency(journey.fare_amount)}</span>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="no-data">No journeys yet. Start your first journey!</p>
// // //         )}
// // //       </Card>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;