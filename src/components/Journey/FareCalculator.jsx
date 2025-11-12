// import React, { useState, useEffect } from 'react';
// import { stationApi } from '../../api/stationApi';
// import { toast } from 'react-toastify';
// import { formatCurrency, getErrorMessage } from '../../utils/helpers';
// import Card from '../Common/Card';
// import Loader from '../Common/Loader';
// import '../../styles/journey.css';

// const FareCalculator = () => {
//   const [stations, setStations] = useState([]);
//   const [fromStation, setFromStation] = useState('');
//   const [toStation, setToStation] = useState('');
//   const [fare, setFare] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingStations, setLoadingStations] = useState(true);

//   useEffect(() => {
//     fetchStations();
//   }, []);

//   const fetchStations = async () => {
//     try {
//       setLoadingStations(true);
//       console.log('Fetching stations...');
      
//       const data = await stationApi.getAllStations();
//       console.log('Raw stations response:', data);
//       console.log('Full response JSON:', JSON.stringify(data, null, 2));
      
//       let stationsList = [];
      
//       if (data.success && data.stations && Array.isArray(data.stations)) {
//         stationsList = data.stations;
//       } else if (Array.isArray(data)) {
//         stationsList = data;
//       } else if (data.data && Array.isArray(data.data)) {
//         stationsList = data.data;
//       }
      
//       console.log('Extracted stations list:', stationsList);
      
//       // Log first station to see its structure
//       if (stationsList.length > 0) {
//         console.log('First station object:', stationsList[0]);
//         console.log('First station keys:', Object.keys(stationsList[0]));
//       }
      
//       setStations(stationsList);
      
//       if (stationsList.length === 0) {
//         toast.warning('No stations found. Please create stations in admin panel.');
//       } else {
//         toast.success(`Loaded ${stationsList.length} stations`);
//       }
      
//     } catch (error) {
//       console.error('Failed to fetch stations:', error);
//       console.error('Error details:', error.response?.data);
//       toast.error('Failed to load stations');
//       setStations([]);
//     } finally {
//       setLoadingStations(false);
//     }
//   };

//   const getStationDisplay = (station) => {
//     // Try different possible field names
//     const name = station.name || station.station_name || station.stationName || 'Unknown';
//     const code = station.code || station.station_code || station.stationCode || 
//                  station.shortCode || station.short_code || '';
    
//     return code ? `${name} (${code})` : name;
//   };

//   const getStationCode = (station) => {
//     // Return the station code or fallback to ID
//     return station.code || station.station_code || station.stationCode || 
//            station.shortCode || station.short_code || station._id || station.id;
//   };

//   const calculateFare = async () => {
//     if (!fromStation || !toStation) {
//       toast.error('Please select both stations');
//       return;
//     }

//     if (fromStation === toStation) {
//       toast.error('Please select different stations');
//       return;
//     }

//     setLoading(true);
//     setFare(null);
    
//     try {
//       console.log('Calculating fare:', { from: fromStation, to: toStation });
      
//       const data = await stationApi.calculateFare(fromStation, toStation);
//       console.log('Fare response:', data);
      
//       let fareAmount = null;
      
//       if (data.success && data.fare) {
//         fareAmount = data.fare.totalfare || data.fare.total_fare || data.fare.amount || data.fare;
//       } else if (data.totalfare !== undefined) {
//         fareAmount = data.totalfare;
//       } else if (data.total_fare !== undefined) {
//         fareAmount = data.total_fare;
//       } else if (typeof data.fare === 'number') {
//         fareAmount = data.fare;
//       }
      
//       if (fareAmount !== null) {
//         setFare(fareAmount);
//         toast.success(`Fare: ${formatCurrency(fareAmount)}`);
//       } else {
//         toast.error('No fare configured for this route');
//       }
//     } catch (error) {
//       console.error('Fare calculation error:', error);
//       console.error('Error response:', error.response?.data);
//       toast.error(getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingStations) {
//     return (
//       <Card title="Fare Calculator" className="fare-calculator-card">
//         <Loader message="Loading stations..." />
//       </Card>
//     );
//   }

//   return (
//     <Card title="Fare Calculator" className="fare-calculator-card">
//       <div className="fare-calculator-content">
//         {stations.length === 0 ? (
//           <div className="no-stations-message">
//             <p>⚠️ No stations available</p>
//             <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
//               Please create stations using the admin panel first.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="form-group">
//               <label>From Station ({stations.length} available)</label>
//               <select 
//                 value={fromStation} 
//                 onChange={(e) => {
//                   console.log('Selected from station:', e.target.value);
//                   setFromStation(e.target.value);
//                 }}
//               >
//                 <option value="">Select departure station</option>
//                 {stations.map((station, index) => {
//                   const code = getStationCode(station);
//                   const display = getStationDisplay(station);
//                   console.log(`Station ${index}:`, { code, display, raw: station });
                  
//                   return (
//                     <option 
//                       key={station._id || station.id || index} 
//                       value={code}
//                     >
//                       {display}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <div className="form-group">
//               <label>To Station ({stations.length} available)</label>
//               <select 
//                 value={toStation} 
//                 onChange={(e) => {
//                   console.log('Selected to station:', e.target.value);
//                   setToStation(e.target.value);
//                 }}
//               >
//                 <option value="">Select destination station</option>
//                 {stations.map((station, index) => (
//                   <option 
//                     key={station._id || station.id || index} 
//                     value={getStationCode(station)}
//                   >
//                     {getStationDisplay(station)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button 
//               onClick={calculateFare} 
//               className="calculate-btn" 
//               disabled={loading || !fromStation || !toStation}
//             >
//               {loading ? 'Calculating...' : 'Calculate Fare'}
//             </button>

//             {fare !== null && (
//               <div className="fare-result">
//                 <p className="fare-label">Estimated Fare:</p>
//                 <p className="fare-amount">{formatCurrency(fare)}</p>
//               </div>
//             )}
//           </>
//         )}
        
//         <button 
//           onClick={fetchStations} 
//           style={{ 
//             marginTop: '16px', 
//             padding: '8px 16px', 
//             fontSize: '14px',
//             backgroundColor: '#6b7280',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer'
//           }}
//         >
//           🔄 Reload Stations
//         </button>
//       </div>
//     </Card>
//   );
// };

// export default FareCalculator;
