// // // // import React, { useState, useRef, useEffect } from 'react';
// // // // import { journeyApi } from '../../api/journeyApi';
// // // // import { stationApi } from '../../api/stationApi';
// // // // import { faceApi } from '../../api/faceApi';
// // // // import { toast } from 'react-toastify';
// // // // import { MdLogin, MdLogout, MdVideocam, MdStopCircle, MdRefresh } from 'react-icons/md';
// // // // import { getErrorMessage } from '../../utils/helpers';
// // // // import Card from '../Common/Card';
// // // // import Loader from '../Common/Loader';
// // // // import '../../styles/admin.css';

// // // // const StationOperations = () => {
// // // //   const [stations, setStations] = useState([]);
// // // //   const [selectedStation, setSelectedStation] = useState('');
// // // //   const [operationType, setOperationType] = useState('entry');
// // // //   const [processing, setProcessing] = useState(false);
// // // //   const [lastResult, setLastResult] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
  
// // // //   // Camera states
// // // //   const [isCameraActive, setIsCameraActive] = useState(false);
// // // //   const [stream, setStream] = useState(null);
// // // //   const [countdown, setCountdown] = useState(null);
// // // //   const [recognizing, setRecognizing] = useState(false);
// // // //   const [lastRecognizedUser, setLastRecognizedUser] = useState(null);
// // // //   const [notRecognizedCount, setNotRecognizedCount] = useState(0);
// // // //   const [showNotRecognized, setShowNotRecognized] = useState(false);
  
// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null);
// // // //   const countdownTimerRef = useRef(null);
// // // //   const captureIntervalRef = useRef(null);
// // // //   const lastProcessedUserRef = useRef(null);

// // // //   useEffect(() => {
// // // //     fetchStations();
// // // //     return () => {
// // // //       stopCamera();
// // // //     };
// // // //   }, []);

// // // //   const fetchStations = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const data = await stationApi.getAllStations();
// // // //       if (data.success && data.stations && Array.isArray(data.stations)) {
// // // //         setStations(data.stations);
// // // //       } else if (data.stations && Array.isArray(data.stations)) {
// // // //         setStations(data.stations);
// // // //       } else if (Array.isArray(data)) {
// // // //         setStations(data);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Failed to load stations:', error);
// // // //       toast.error('Failed to load stations');
// // // //       setStations([]);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const startCamera = async () => {
// // // //     try {
// // // //       const mediaStream = await navigator.mediaDevices.getUserMedia({
// // // //         video: { width: 640, height: 480, facingMode: 'user' }
// // // //       });
      
// // // //       setStream(mediaStream);
// // // //       setIsCameraActive(true);
// // // //       setNotRecognizedCount(0);
// // // //       setShowNotRecognized(false);
// // // //       lastProcessedUserRef.current = null;
      
// // // //       setTimeout(() => {
// // // //         if (videoRef.current) {
// // // //           videoRef.current.srcObject = mediaStream;
// // // //           videoRef.current.play();
// // // //           startContinuousCapture();
// // // //         }
// // // //       }, 100);
      
// // // //       toast.success('Camera started! Auto-capturing every 5 seconds...');
// // // //     } catch (error) {
// // // //       console.error('Camera error:', error);
// // // //       toast.error('Failed to access camera');
// // // //       setIsCameraActive(false);
// // // //     }
// // // //   };

// // // //   const startContinuousCapture = () => {
// // // //     startCountdown();
// // // //     captureIntervalRef.current = setInterval(() => {
// // // //       startCountdown();
// // // //     }, 5000);
// // // //   };

// // // //   const startCountdown = () => {
// // // //     setCountdown(5);
// // // //     let count = 5;
    
// // // //     if (countdownTimerRef.current) {
// // // //       clearInterval(countdownTimerRef.current);
// // // //     }
    
// // // //     countdownTimerRef.current = setInterval(() => {
// // // //       count -= 1;
// // // //       setCountdown(count);
      
// // // //       if (count === 0) {
// // // //         clearInterval(countdownTimerRef.current);
// // // //         captureAndRecognize();
// // // //       }
// // // //     }, 1000);
// // // //   };

// // // //   const stopCamera = () => {
// // // //     if (stream) {
// // // //       stream.getTracks().forEach(track => track.stop());
// // // //     }
// // // //     if (videoRef.current) {
// // // //       videoRef.current.srcObject = null;
// // // //     }
// // // //     if (countdownTimerRef.current) {
// // // //       clearInterval(countdownTimerRef.current);
// // // //     }
// // // //     if (captureIntervalRef.current) {
// // // //       clearInterval(captureIntervalRef.current);
// // // //     }
// // // //     setStream(null);
// // // //     setIsCameraActive(false);
// // // //     setCountdown(null);
// // // //     setLastRecognizedUser(null);
// // // //     setShowNotRecognized(false);
// // // //     lastProcessedUserRef.current = null;
// // // //   };

// // // //   const captureAndRecognize = async () => {
// // // //     if (!videoRef.current || !canvasRef.current || recognizing) {
// // // //       return;
// // // //     }

// // // //     const video = videoRef.current;
// // // //     const canvas = canvasRef.current;
// // // //     const context = canvas.getContext('2d');

// // // //     canvas.width = video.videoWidth;
// // // //     canvas.height = video.videoHeight;
// // // //     context.drawImage(video, 0, 0);

// // // //     canvas.toBlob(async (blob) => {
// // // //       const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
// // // //       await handleFaceRecognition(file);
// // // //     }, 'image/jpeg', 0.95);
// // // //   };

// // // //   const handleFaceRecognition = async (imageFile) => {
// // // //     setRecognizing(true);
// // // //     setShowNotRecognized(false);

// // // //     try {
// // // //       console.log('Calling face recognition...');
// // // //       const response = await faceApi.testFaceRecognition(imageFile);
      
// // // //       console.log('Face recognition response:', response);
      
// // // //       const isRecognized = response.recognized || 
// // // //                           response.recognition_results?.recognized || 
// // // //                           response.success;
      
// // // //       if (isRecognized) {
// // // //         const userId = response.user_id || 
// // // //                       response.recognition_results?.user_id || 
// // // //                       response.userid ||
// // // //                       response.recognition_results?.userid;
        
// // // //         const userName = response.user_name || 
// // // //                         response.recognition_results?.user_name || 
// // // //                         response.username ||
// // // //                         response.recognition_results?.username ||
// // // //                         'User';
        
// // // //         if (userId) {
// // // //           setLastRecognizedUser({ userId, userName });
// // // //           setNotRecognizedCount(0);
// // // //           setShowNotRecognized(false);
// // // //           toast.success(`✅ Face Recognized: ${userName}`, { autoClose: 2000 });
          
// // // //           // Process journey even if same user (removed duplicate check)
// // // //           await processJourney(userId);
// // // //         } else {
// // // //           handleNotRecognized();
// // // //         }
// // // //       } else {
// // // //         handleNotRecognized();
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Recognition error:', error);
      
// // // //       if (error.response?.status === 500) {
// // // //         if (error.response?.data?.detail?.includes('ML service')) {
// // // //           toast.error('ML Service offline. Please wake it up.', { autoClose: 3000 });
// // // //         }
// // // //       }
      
// // // //       handleNotRecognized();
// // // //     } finally {
// // // //       setRecognizing(false);
// // // //     }
// // // //   };

// // // //   const handleNotRecognized = () => {
// // // //     setLastRecognizedUser(null);
// // // //     setNotRecognizedCount(prev => prev + 1);
// // // //     setShowNotRecognized(true);
    
// // // //     // Show message every time
// // // //     toast.warning('⚠️ User not recognized', { autoClose: 2000 });
// // // //   };

// // // //   const processJourney = async (userId) => {
// // // //     if (!selectedStation) {
// // // //       toast.error('Please select a station first');
// // // //       return;
// // // //     }

// // // //     if (processing) {
// // // //       return;
// // // //     }

// // // //     setProcessing(true);
// // // //     setLastResult(null);

// // // //     try {
// // // //       const formData = new FormData();
      
// // // //       let result;
// // // //       if (operationType === 'entry') {
// // // //         result = await journeyApi.processEntry(selectedStation, formData, userId);
        
// // // //         if (result.success && result.gate_open) {
// // // //           toast.success(`✅ ENTRY ALLOWED\n${result.message}`, {
// // // //             autoClose: 4000,
// // // //             position: 'top-center'
// // // //           });
// // // //         } else {
// // // //           const errorMsg = result.message || 'Entry denied';
          
// // // //           // Check for ongoing journey message
// // // //           if (errorMsg.toLowerCase().includes('ongoing')) {
// // // //             toast.warning(`⚠️ ${errorMsg}`, {
// // // //               autoClose: 4000,
// // // //               position: 'top-center'
// // // //             });
// // // //           } else if (errorMsg.toLowerCase().includes('balance') || errorMsg.toLowerCase().includes('insufficient')) {
// // // //             toast.error(`❌ LOW BALANCE\n${errorMsg}`, {
// // // //               autoClose: 5000,
// // // //               position: 'top-center'
// // // //             });
// // // //           } else {
// // // //             toast.error(`❌ ENTRY DENIED\n${errorMsg}`, {
// // // //               autoClose: 4000,
// // // //               position: 'top-center'
// // // //             });
// // // //           }
// // // //         }
// // // //       } else {
// // // //         result = await journeyApi.processExit(selectedStation, formData, userId);
        
// // // //         if (result.success && result.gate_open) {
// // // //           const fare = result.journey_details?.fare_details?.total_fare || 'N/A';
// // // //           toast.success(`✅ EXIT ALLOWED\nFare Deducted: ₹${fare}\n${result.message}`, {
// // // //             autoClose: 4000,
// // // //             position: 'top-center'
// // // //           });
// // // //         } else {
// // // //           const errorMsg = result.message || 'Exit denied';
          
// // // //           // Check for no journey message
// // // //           if (errorMsg.toLowerCase().includes('no journey') || errorMsg.toLowerCase().includes('no ongoing')) {
// // // //             toast.warning(`⚠️ NO ONGOING JOURNEY\n${errorMsg}`, {
// // // //               autoClose: 4000,
// // // //               position: 'top-center'
// // // //             });
// // // //           } else {
// // // //             toast.error(`❌ EXIT DENIED\n${errorMsg}`, {
// // // //               autoClose: 4000,
// // // //               position: 'top-center'
// // // //             });
// // // //           }
// // // //         }
// // // //       }

// // // //       setLastResult(result);
      
// // // //     } catch (error) {
// // // //       const errorMsg = getErrorMessage(error);
// // // //       console.error('Journey processing error:', errorMsg);
      
// // // //       // Don't show generic system error, be specific
// // // //       if (!errorMsg.includes('System error')) {
// // // //         toast.error(`❌ ${errorMsg}`, { autoClose: 3000 });
// // // //       }
      
// // // //       setLastResult({
// // // //         success: false,
// // // //         message: errorMsg,
// // // //         gate_open: false
// // // //       });
// // // //     } finally {
// // // //       setProcessing(false);
// // // //     }
// // // //   };

// // // //   const resetOperation = () => {
// // // //     setLastResult(null);
// // // //     setLastRecognizedUser(null);
// // // //     setNotRecognizedCount(0);
// // // //     setShowNotRecognized(false);
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="station-operations-container">
// // // //         <Loader message="Loading stations..." />
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="station-operations-container">
// // // //       <h1>Station Operations</h1>
// // // //       <p className="subtitle">Automated Entry/Exit with Continuous Facial Recognition</p>

// // // //       <div className="operations-grid">
// // // //         <Card title="Gate Control">
// // // //           <div className="operation-form">
// // // //             <div className="form-group">
// // // //               <label>Operation Type</label>
// // // //               <div className="operation-toggle">
// // // //                 <button
// // // //                   className={`toggle-btn ${operationType === 'entry' ? 'active' : ''}`}
// // // //                   onClick={() => setOperationType('entry')}
// // // //                   disabled={processing || isCameraActive}
// // // //                 >
// // // //                   <MdLogin size={18} /> ENTRY
// // // //                 </button>
// // // //                 <button
// // // //                   className={`toggle-btn ${operationType === 'exit' ? 'active' : ''}`}
// // // //                   onClick={() => setOperationType('exit')}
// // // //                   disabled={processing || isCameraActive}
// // // //                 >
// // // //                   <MdLogout size={18} /> EXIT
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             <div className="form-group">
// // // //               <label>Current Station</label>
// // // //               <select
// // // //                 value={selectedStation}
// // // //                 onChange={(e) => setSelectedStation(e.target.value)}
// // // //                 required
// // // //                 disabled={isCameraActive || processing}
// // // //               >
// // // //                 <option value="">Select Station</option>
// // // //                 {stations.map((station) => (
// // // //                   <option key={station._id} value={station.station_code}>
// // // //                     {station.station_name} ({station.station_code})
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="form-group">
// // // //               <label>Continuous Face Recognition</label>
              
// // // //               {!isCameraActive && (
// // // //                 <button
// // // //                   onClick={startCamera}
// // // //                   disabled={!selectedStation || processing}
// // // //                   className="camera-start-btn"
// // // //                 >
// // // //                   <MdVideocam /> Start Continuous Scanning
// // // //                 </button>
// // // //               )}

// // // //               {isCameraActive && (
// // // //                 <div className="camera-section">
// // // //                   <div className="camera-active-section">
// // // //                     <div className="camera-container">
// // // //                       <video
// // // //                         ref={videoRef}
// // // //                         autoPlay
// // // //                         playsInline
// // // //                         muted
// // // //                         className="camera-video"
// // // //                       />
// // // //                       {countdown !== null && countdown > 0 && (
// // // //                         <div style={{
// // // //                           position: 'absolute',
// // // //                           top: 0,
// // // //                           left: 0,
// // // //                           width: '100%',
// // // //                           height: '100%',
// // // //                           background: 'rgba(0, 0, 0, 0.6)',
// // // //                           display: 'flex',
// // // //                           flexDirection: 'column',
// // // //                           alignItems: 'center',
// // // //                           justifyContent: 'center',
// // // //                           color: 'white',
// // // //                           zIndex: 10
// // // //                         }}>
// // // //                           <div style={{
// // // //                             fontSize: '100px',
// // // //                             fontWeight: '800',
// // // //                             color: '#10b981',
// // // //                             textShadow: '0 0 30px rgba(16, 185, 129, 0.8)'
// // // //                           }}>
// // // //                             {countdown}
// // // //                           </div>
// // // //                           <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '600' }}>
// // // //                             Next scan in {countdown}s...
// // // //                           </p>
// // // //                         </div>
// // // //                       )}
// // // //                       {recognizing && (
// // // //                         <div style={{
// // // //                           position: 'absolute',
// // // //                           bottom: '20px',
// // // //                           left: '50%',
// // // //                           transform: 'translateX(-50%)',
// // // //                           background: 'rgba(99, 102, 241, 0.9)',
// // // //                           padding: '12px 24px',
// // // //                           borderRadius: '8px',
// // // //                           color: 'white',
// // // //                           fontWeight: '600',
// // // //                           zIndex: 11
// // // //                         }}>
// // // //                           🔍 Recognizing...
// // // //                         </div>
// // // //                       )}
// // // //                       {lastRecognizedUser && !recognizing && !showNotRecognized && (
// // // //                         <div style={{
// // // //                           position: 'absolute',
// // // //                           bottom: '20px',
// // // //                           left: '50%',
// // // //                           transform: 'translateX(-50%)',
// // // //                           background: 'rgba(16, 185, 129, 0.95)',
// // // //                           padding: '12px 24px',
// // // //                           borderRadius: '8px',
// // // //                           color: 'white',
// // // //                           fontWeight: '700',
// // // //                           zIndex: 11,
// // // //                           textAlign: 'center'
// // // //                         }}>
// // // //                           ✅ {lastRecognizedUser.userName}
// // // //                           <br/>
// // // //                           <small>ID: {lastRecognizedUser.userId}</small>
// // // //                         </div>
// // // //                       )}
// // // //                       {showNotRecognized && !recognizing && (
// // // //                         <div style={{
// // // //                           position: 'absolute',
// // // //                           bottom: '20px',
// // // //                           left: '50%',
// // // //                           transform: 'translateX(-50%)',
// // // //                           background: 'rgba(239, 68, 68, 0.95)',
// // // //                           padding: '12px 24px',
// // // //                           borderRadius: '8px',
// // // //                           color: 'white',
// // // //                           fontWeight: '700',
// // // //                           zIndex: 11,
// // // //                           textAlign: 'center'
// // // //                         }}>
// // // //                           ❌ User Not Recognized
// // // //                           <br/>
// // // //                           <small>Attempts: {notRecognizedCount}</small>
// // // //                         </div>
// // // //                       )}
// // // //                       <canvas ref={canvasRef} style={{ display: 'none' }} />
// // // //                     </div>
// // // //                     <div className="camera-controls">
// // // //                       <button onClick={stopCamera} className="stop-btn">
// // // //                         <MdStopCircle /> Stop Scanning
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             <div style={{
// // // //               marginTop: '24px',
// // // //               padding: '16px',
// // // //               backgroundColor: '#eff6ff',
// // // //               borderRadius: '8px',
// // // //               border: '1px solid #3b82f6'
// // // //             }}>
// // // //               <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📝 Instructions:</h4>
// // // //               <ol style={{ margin: '0', paddingLeft: '20px', color: '#1e3a8a' }}>
// // // //                 <li style={{ marginBottom: '8px' }}>Select operation type (Entry/Exit)</li>
// // // //                 <li style={{ marginBottom: '8px' }}>Select current station</li>
// // // //                 <li style={{ marginBottom: '8px' }}>Click "Start Continuous Scanning"</li>
// // // //                 <li style={{ marginBottom: '8px' }}>Camera scans every 5 seconds automatically</li>
// // // //                 <li style={{ marginBottom: '8px' }}>Journey processed when face recognized</li>
// // // //                 <li>Click "Stop Scanning" when done</li>
// // // //               </ol>
// // // //             </div>
// // // //           </div>
// // // //         </Card>

// // // //         <Card title="Operation Result">
// // // //           {lastResult ? (
// // // //             <div style={{
// // // //               padding: '20px',
// // // //               borderRadius: '12px',
// // // //               backgroundColor: lastResult.success ? '#d1fae5' : '#fee2e2',
// // // //               border: `2px solid ${lastResult.success ? '#10b981' : '#ef4444'}`
// // // //             }}>
// // // //               <div style={{
// // // //                 fontSize: '24px',
// // // //                 fontWeight: '800',
// // // //                 marginBottom: '16px',
// // // //                 textAlign: 'center',
// // // //                 color: lastResult.success ? '#065f46' : '#991b1b'
// // // //               }}>
// // // //                 {lastResult.success ? '✅ SUCCESS' : '❌ FAILED'}
// // // //               </div>
// // // //               <div>
// // // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                   <strong>Action:</strong> {operationType.toUpperCase()}
// // // //                 </p>
// // // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                   <strong>Station:</strong> {stations.find(s => s.station_code === selectedStation)?.station_name || selectedStation}
// // // //                 </p>
// // // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                   <strong>Gate:</strong> {lastResult.gate_open ? '🟢 OPEN' : '🔴 CLOSED'}
// // // //                 </p>
// // // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                   <strong>Message:</strong> {lastResult.message}
// // // //                 </p>
                
// // // //                 {lastRecognizedUser && (
// // // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                     <strong>User ID:</strong> {lastRecognizedUser.userId}
// // // //                   </p>
// // // //                 )}
                
// // // //                 {lastResult.journey_id && (
// // // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                     <strong>Journey ID:</strong> {lastResult.journey_id}
// // // //                   </p>
// // // //                 )}
                
// // // //                 {lastResult.current_balance !== undefined && (
// // // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // // //                     <strong>Wallet Balance:</strong> ₹{lastResult.current_balance?.toFixed(2)}
// // // //                   </p>
// // // //                 )}
                
// // // //                 {lastResult.journey_details?.fare_details && (
// // // //                   <div style={{
// // // //                     marginTop: '16px',
// // // //                     paddingTop: '16px',
// // // //                     borderTop: '2px dashed rgba(0,0,0,0.1)'
// // // //                   }}>
// // // //                     <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Fare Details</h4>
// // // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // // //                       <strong>Route:</strong> {lastResult.journey_details.fare_details.from_station} → {lastResult.journey_details.fare_details.to_station}
// // // //                     </p>
// // // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // // //                       <strong>Distance:</strong> {lastResult.journey_details.fare_details.distance_km} km
// // // //                     </p>
// // // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // // //                       <strong>Base Fare:</strong> ₹{lastResult.journey_details.fare_details.base_fare}
// // // //                     </p>
// // // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // // //                       <strong>Service Charge:</strong> ₹{lastResult.journey_details.fare_details.service_charge}
// // // //                     </p>
// // // //                     <p style={{
// // // //                       fontSize: '18px',
// // // //                       fontWeight: '800',
// // // //                       color: '#6366f1',
// // // //                       marginTop: '8px'
// // // //                     }}>
// // // //                       <strong>Total Fare:</strong> ₹{lastResult.journey_details.fare_details.total_fare}
// // // //                     </p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //               <button
// // // //                 onClick={resetOperation}
// // // //                 style={{
// // // //                   marginTop: '16px',
// // // //                   padding: '10px 20px',
// // // //                   backgroundColor: '#6b7280',
// // // //                   color: 'white',
// // // //                   border: 'none',
// // // //                   borderRadius: '6px',
// // // //                   cursor: 'pointer',
// // // //                   width: '100%'
// // // //                 }}
// // // //               >
// // // //                 <MdRefresh /> Clear Result
// // // //               </button>
// // // //             </div>
// // // //           ) : (
// // // //             <div style={{
// // // //               textAlign: 'center',
// // // //               padding: '40px 20px',
// // // //               color: '#6b7280'
// // // //             }}>
// // // //               <p style={{ fontSize: '16px', marginBottom: '8px' }}>👤 No operations performed yet</p>
// // // //               <p style={{ fontSize: '14px' }}>
// // // //                 Start camera to begin continuous scanning
// // // //               </p>
// // // //             </div>
// // // //           )}
// // // //         </Card>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StationOperations;


























































































































































// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { journeyApi } from '../../api/journeyApi';
// // // import { stationApi } from '../../api/stationApi';
// // // import { faceApi } from '../../api/faceApi';
// // // import { toast } from 'react-toastify';
// // // import { MdLogin, MdLogout, MdVideocam, MdStopCircle, MdRefresh } from 'react-icons/md';
// // // import { getErrorMessage } from '../../utils/helpers';
// // // import Card from '../Common/Card';
// // // import Loader from '../Common/Loader';
// // // import '../../styles/admin.css';

// // // const StationOperations = () => {
// // //   const [stations, setStations] = useState([]);
// // //   const [selectedStation, setSelectedStation] = useState('');
// // //   const [operationType, setOperationType] = useState('entry');
// // //   const [processing, setProcessing] = useState(false);
// // //   const [lastResult, setLastResult] = useState(null);
// // //   const [loading, setLoading] = useState(true);
  
// // //   // Camera states
// // //   const [isCameraActive, setIsCameraActive] = useState(false);
// // //   const [stream, setStream] = useState(null);
// // //   const [countdown, setCountdown] = useState(null);
// // //   const [recognizing, setRecognizing] = useState(false);
// // //   const [lastRecognizedUser, setLastRecognizedUser] = useState(null);
  
// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);
// // //   const countdownTimerRef = useRef(null);
// // //   const captureIntervalRef = useRef(null);

// // //   useEffect(() => {
// // //     fetchStations();
// // //     return () => {
// // //       stopCamera();
// // //     };
// // //   }, []);

// // //   const fetchStations = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await stationApi.getAllStations();
// // //       if (data.success && data.stations && Array.isArray(data.stations)) {
// // //         setStations(data.stations);
// // //       } else if (data.stations && Array.isArray(data.stations)) {
// // //         setStations(data.stations);
// // //       } else if (Array.isArray(data)) {
// // //         setStations(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load stations:', error);
// // //       toast.error('Failed to load stations');
// // //       setStations([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const startCamera = async () => {
// // //     try {
// // //       const mediaStream = await navigator.mediaDevices.getUserMedia({
// // //         video: { width: 640, height: 480, facingMode: 'user' }
// // //       });
      
// // //       setStream(mediaStream);
// // //       setIsCameraActive(true);
      
// // //       setTimeout(() => {
// // //         if (videoRef.current) {
// // //           videoRef.current.srcObject = mediaStream;
// // //           videoRef.current.play();
          
// // //           // Start continuous 5-second capture cycle
// // //           startContinuousCapture();
// // //         }
// // //       }, 100);
      
// // //       toast.success('Camera started! Auto-capturing every 5 seconds...');
// // //     } catch (error) {
// // //       console.error('Camera error:', error);
// // //       toast.error('Failed to access camera');
// // //       setIsCameraActive(false);
// // //     }
// // //   };

// // //   const startContinuousCapture = () => {
// // //     // Start first countdown immediately
// // //     startCountdown();
    
// // //     // Then repeat every 5 seconds
// // //     captureIntervalRef.current = setInterval(() => {
// // //       startCountdown();
// // //     }, 5000);
// // //   };

// // //   const startCountdown = () => {
// // //     setCountdown(5);
// // //     let count = 5;
    
// // //     if (countdownTimerRef.current) {
// // //       clearInterval(countdownTimerRef.current);
// // //     }
    
// // //     countdownTimerRef.current = setInterval(() => {
// // //       count -= 1;
// // //       setCountdown(count);
      
// // //       if (count === 0) {
// // //         clearInterval(countdownTimerRef.current);
// // //         captureAndRecognize();
// // //       }
// // //     }, 1000);
// // //   };

// // //   const stopCamera = () => {
// // //     if (stream) {
// // //       stream.getTracks().forEach(track => track.stop());
// // //     }
// // //     if (videoRef.current) {
// // //       videoRef.current.srcObject = null;
// // //     }
// // //     if (countdownTimerRef.current) {
// // //       clearInterval(countdownTimerRef.current);
// // //     }
// // //     if (captureIntervalRef.current) {
// // //       clearInterval(captureIntervalRef.current);
// // //     }
// // //     setStream(null);
// // //     setIsCameraActive(false);
// // //     setCountdown(null);
// // //     setLastRecognizedUser(null);
// // //   };

// // //   const captureAndRecognize = async () => {
// // //     if (!videoRef.current || !canvasRef.current || recognizing) {
// // //       return;
// // //     }

// // //     const video = videoRef.current;
// // //     const canvas = canvasRef.current;
// // //     const context = canvas.getContext('2d');

// // //     canvas.width = video.videoWidth;
// // //     canvas.height = video.videoHeight;
// // //     context.drawImage(video, 0, 0);

// // //     canvas.toBlob(async (blob) => {
// // //       const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
// // //       await handleFaceRecognition(file);
// // //     }, 'image/jpeg', 0.95);
// // //   };

// // //   const handleFaceRecognition = async (imageFile) => {
// // //     setRecognizing(true);

// // //     try {
// // //       console.log('Calling face recognition...');
// // //       const response = await faceApi.testFaceRecognition(imageFile);
      
// // //       console.log('Face recognition response:', response);
      
// // //       // Check multiple response structures
// // //       const isRecognized = response.recognized || 
// // //                           response.recognition_results?.recognized || 
// // //                           response.success;
      
// // //       if (isRecognized) {
// // //         const userId = response.user_id || 
// // //                       response.recognition_results?.user_id || 
// // //                       response.userid ||
// // //                       response.recognition_results?.userid;
        
// // //         const userName = response.user_name || 
// // //                         response.recognition_results?.user_name || 
// // //                         response.username ||
// // //                         response.recognition_results?.username ||
// // //                         'User';
        
// // //         if (userId) {
// // //           setLastRecognizedUser({ userId, userName });
// // //           toast.success(`✅ Face Recognized: ${userName}`, { autoClose: 2000 });
          
// // //           // Auto-process journey
// // //           await processJourney(userId);
// // //         } else {
// // //           toast.warning('⚠️ Face detected but user ID not found');
// // //         }
// // //       } else {
// // //         setLastRecognizedUser(null);
// // //         console.log('Face not recognized in this frame');
// // //       }
// // //     } catch (error) {
// // //       console.error('Recognition error:', error);
      
// // //       // Check if it's ML service error
// // //       if (error.response?.status === 500) {
// // //         if (error.response?.data?.detail?.includes('ML service')) {
// // //           toast.error('ML Service offline. Please wake it up.', { autoClose: 3000 });
// // //         } else {
// // //           console.error('Server error during recognition');
// // //         }
// // //       }
      
// // //       setLastRecognizedUser(null);
// // //     } finally {
// // //       setRecognizing(false);
// // //     }
// // //   };

// // //   const processJourney = async (userId) => {
// // //     if (!selectedStation) {
// // //       toast.error('Please select a station first');
// // //       return;
// // //     }

// // //     if (processing) {
// // //       return; // Prevent duplicate processing
// // //     }

// // //     setProcessing(true);
// // //     setLastResult(null);

// // //     try {
// // //       const formData = new FormData();
      
// // //       let result;
// // //       if (operationType === 'entry') {
// // //         result = await journeyApi.processEntry(selectedStation, formData, userId);
        
// // //         if (result.success && result.gate_open) {
// // //           toast.success(`✅ ENTRY ALLOWED\n${result.message}`, {
// // //             autoClose: 4000,
// // //             position: 'top-center'
// // //           });
// // //         } else {
// // //           const errorMsg = result.message || 'Entry denied';
// // //           if (errorMsg.toLowerCase().includes('balance') || errorMsg.toLowerCase().includes('insufficient')) {
// // //             toast.error(`❌ LOW BALANCE\n${errorMsg}`, {
// // //               autoClose: 5000,
// // //               position: 'top-center'
// // //             });
// // //           } else {
// // //             toast.error(`❌ ENTRY DENIED\n${errorMsg}`, {
// // //               autoClose: 4000,
// // //               position: 'top-center'
// // //             });
// // //           }
// // //         }
// // //       } else {
// // //         result = await journeyApi.processExit(selectedStation, formData, userId);
        
// // //         if (result.success && result.gate_open) {
// // //           const fare = result.journey_details?.fare_details?.total_fare || 'N/A';
// // //           toast.success(`✅ EXIT ALLOWED\nFare Deducted: ₹${fare}\n${result.message}`, {
// // //             autoClose: 4000,
// // //             position: 'top-center'
// // //           });
// // //         } else {
// // //           const errorMsg = result.message || 'Exit denied';
// // //           toast.error(`❌ EXIT DENIED\n${errorMsg}`, {
// // //             autoClose: 4000,
// // //             position: 'top-center'
// // //           });
// // //         }
// // //       }

// // //       setLastResult(result);
      
// // //     } catch (error) {
// // //       const errorMsg = getErrorMessage(error);
// // //       toast.error(`❌ Operation Failed\n${errorMsg}`, { autoClose: 3000 });
// // //       setLastResult({
// // //         success: false,
// // //         message: errorMsg,
// // //         gate_open: false
// // //       });
// // //     } finally {
// // //       setProcessing(false);
// // //     }
// // //   };

// // //   const resetOperation = () => {
// // //     setLastResult(null);
// // //     setLastRecognizedUser(null);
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="station-operations-container">
// // //         <Loader message="Loading stations..." />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="station-operations-container">
// // //       <h1>Station Operations</h1>
// // //       <p className="subtitle">Automated Entry/Exit with Continuous Facial Recognition</p>

// // //       <div className="operations-grid">
// // //         <Card title="Gate Control">
// // //           <div className="operation-form">
// // //             {/* Operation Type Toggle */}
// // //             <div className="form-group">
// // //               <label>Operation Type</label>
// // //               <div className="operation-toggle">
// // //                 <button
// // //                   className={`toggle-btn ${operationType === 'entry' ? 'active' : ''}`}
// // //                   onClick={() => setOperationType('entry')}
// // //                   disabled={processing || isCameraActive}
// // //                 >
// // //                   <MdLogin size={18} /> ENTRY
// // //                 </button>
// // //                 <button
// // //                   className={`toggle-btn ${operationType === 'exit' ? 'active' : ''}`}
// // //                   onClick={() => setOperationType('exit')}
// // //                   disabled={processing || isCameraActive}
// // //                 >
// // //                   <MdLogout size={18} /> EXIT
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {/* Station Selection */}
// // //             <div className="form-group">
// // //               <label>Current Station</label>
// // //               <select
// // //                 value={selectedStation}
// // //                 onChange={(e) => setSelectedStation(e.target.value)}
// // //                 required
// // //                 disabled={isCameraActive || processing}
// // //               >
// // //                 <option value="">Select Station</option>
// // //                 {stations.map((station) => (
// // //                   <option key={station._id} value={station.station_code}>
// // //                     {station.station_name} ({station.station_code})
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* Camera Section */}
// // //             <div className="form-group">
// // //               <label>Continuous Face Recognition</label>
              
// // //               {!isCameraActive && (
// // //                 <button
// // //                   onClick={startCamera}
// // //                   disabled={!selectedStation || processing}
// // //                   className="camera-start-btn"
// // //                 >
// // //                   <MdVideocam /> Start Continuous Scanning
// // //                 </button>
// // //               )}

// // //               {isCameraActive && (
// // //                 <div className="camera-section">
// // //                   <div className="camera-active-section">
// // //                     <div className="camera-container">
// // //                       <video
// // //                         ref={videoRef}
// // //                         autoPlay
// // //                         playsInline
// // //                         muted
// // //                         className="camera-video"
// // //                       />
// // //                       {countdown !== null && countdown > 0 && (
// // //                         <div style={{
// // //                           position: 'absolute',
// // //                           top: 0,
// // //                           left: 0,
// // //                           width: '100%',
// // //                           height: '100%',
// // //                           background: 'rgba(0, 0, 0, 0.6)',
// // //                           display: 'flex',
// // //                           flexDirection: 'column',
// // //                           alignItems: 'center',
// // //                           justifyContent: 'center',
// // //                           color: 'white',
// // //                           zIndex: 10
// // //                         }}>
// // //                           <div style={{
// // //                             fontSize: '100px',
// // //                             fontWeight: '800',
// // //                             color: '#10b981',
// // //                             textShadow: '0 0 30px rgba(16, 185, 129, 0.8)'
// // //                           }}>
// // //                             {countdown}
// // //                           </div>
// // //                           <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '600' }}>
// // //                             Next scan in {countdown}s...
// // //                           </p>
// // //                         </div>
// // //                       )}
// // //                       {recognizing && (
// // //                         <div style={{
// // //                           position: 'absolute',
// // //                           bottom: '20px',
// // //                           left: '50%',
// // //                           transform: 'translateX(-50%)',
// // //                           background: 'rgba(99, 102, 241, 0.9)',
// // //                           padding: '12px 24px',
// // //                           borderRadius: '8px',
// // //                           color: 'white',
// // //                           fontWeight: '600',
// // //                           zIndex: 11
// // //                         }}>
// // //                           🔍 Recognizing...
// // //                         </div>
// // //                       )}
// // //                       {lastRecognizedUser && !recognizing && (
// // //                         <div style={{
// // //                           position: 'absolute',
// // //                           bottom: '20px',
// // //                           left: '50%',
// // //                           transform: 'translateX(-50%)',
// // //                           background: 'rgba(16, 185, 129, 0.95)',
// // //                           padding: '12px 24px',
// // //                           borderRadius: '8px',
// // //                           color: 'white',
// // //                           fontWeight: '700',
// // //                           zIndex: 11,
// // //                           textAlign: 'center'
// // //                         }}>
// // //                           ✅ {lastRecognizedUser.userName}
// // //                           <br/>
// // //                           <small>ID: {lastRecognizedUser.userId}</small>
// // //                         </div>
// // //                       )}
// // //                       <canvas ref={canvasRef} style={{ display: 'none' }} />
// // //                     </div>
// // //                     <div className="camera-controls">
// // //                       <button onClick={stopCamera} className="stop-btn">
// // //                         <MdStopCircle /> Stop Scanning
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Instructions */}
// // //             <div style={{
// // //               marginTop: '24px',
// // //               padding: '16px',
// // //               backgroundColor: '#eff6ff',
// // //               borderRadius: '8px',
// // //               border: '1px solid #3b82f6'
// // //             }}>
// // //               <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📝 Instructions:</h4>
// // //               <ol style={{ margin: '0', paddingLeft: '20px', color: '#1e3a8a' }}>
// // //                 <li style={{ marginBottom: '8px' }}>Select operation type (Entry/Exit)</li>
// // //                 <li style={{ marginBottom: '8px' }}>Select current station</li>
// // //                 <li style={{ marginBottom: '8px' }}>Click "Start Continuous Scanning"</li>
// // //                 <li style={{ marginBottom: '8px' }}>Camera scans every 5 seconds automatically</li>
// // //                 <li style={{ marginBottom: '8px' }}>Journey processed when face recognized</li>
// // //                 <li>Click "Stop Scanning" when done</li>
// // //               </ol>
// // //             </div>
// // //           </div>
// // //         </Card>

// // //         <Card title="Operation Result">
// // //           {lastResult ? (
// // //             <div style={{
// // //               padding: '20px',
// // //               borderRadius: '12px',
// // //               backgroundColor: lastResult.success ? '#d1fae5' : '#fee2e2',
// // //               border: `2px solid ${lastResult.success ? '#10b981' : '#ef4444'}`
// // //             }}>
// // //               <div style={{
// // //                 fontSize: '24px',
// // //                 fontWeight: '800',
// // //                 marginBottom: '16px',
// // //                 textAlign: 'center',
// // //                 color: lastResult.success ? '#065f46' : '#991b1b'
// // //               }}>
// // //                 {lastResult.success ? '✅ SUCCESS' : '❌ FAILED'}
// // //               </div>
// // //               <div>
// // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                   <strong>Action:</strong> {operationType.toUpperCase()}
// // //                 </p>
// // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                   <strong>Station:</strong> {stations.find(s => s.station_code === selectedStation)?.station_name || selectedStation}
// // //                 </p>
// // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                   <strong>Gate:</strong> {lastResult.gate_open ? '🟢 OPEN' : '🔴 CLOSED'}
// // //                 </p>
// // //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                   <strong>Message:</strong> {lastResult.message}
// // //                 </p>
                
// // //                 {lastRecognizedUser && (
// // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                     <strong>User ID:</strong> {lastRecognizedUser.userId}
// // //                   </p>
// // //                 )}
                
// // //                 {lastResult.journey_id && (
// // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                     <strong>Journey ID:</strong> {lastResult.journey_id}
// // //                   </p>
// // //                 )}
                
// // //                 {lastResult.current_balance !== undefined && (
// // //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// // //                     <strong>Wallet Balance:</strong> ₹{lastResult.current_balance?.toFixed(2)}
// // //                   </p>
// // //                 )}
                
// // //                 {lastResult.journey_details?.fare_details && (
// // //                   <div style={{
// // //                     marginTop: '16px',
// // //                     paddingTop: '16px',
// // //                     borderTop: '2px dashed rgba(0,0,0,0.1)'
// // //                   }}>
// // //                     <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Fare Details</h4>
// // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // //                       <strong>Route:</strong> {lastResult.journey_details.fare_details.from_station} → {lastResult.journey_details.fare_details.to_station}
// // //                     </p>
// // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // //                       <strong>Distance:</strong> {lastResult.journey_details.fare_details.distance_km} km
// // //                     </p>
// // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // //                       <strong>Base Fare:</strong> ₹{lastResult.journey_details.fare_details.base_fare}
// // //                     </p>
// // //                     <p style={{ margin: '8px 0', fontSize: '14px' }}>
// // //                       <strong>Service Charge:</strong> ₹{lastResult.journey_details.fare_details.service_charge}
// // //                     </p>
// // //                     <p style={{
// // //                       fontSize: '18px',
// // //                       fontWeight: '800',
// // //                       color: '#6366f1',
// // //                       marginTop: '8px'
// // //                     }}>
// // //                       <strong>Total Fare:</strong> ₹{lastResult.journey_details.fare_details.total_fare}
// // //                     </p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <button
// // //                 onClick={resetOperation}
// // //                 style={{
// // //                   marginTop: '16px',
// // //                   padding: '10px 20px',
// // //                   backgroundColor: '#6b7280',
// // //                   color: 'white',
// // //                   border: 'none',
// // //                   borderRadius: '6px',
// // //                   cursor: 'pointer',
// // //                   width: '100%'
// // //                 }}
// // //               >
// // //                 <MdRefresh /> Clear Result
// // //               </button>
// // //             </div>
// // //           ) : (
// // //             <div style={{
// // //               textAlign: 'center',
// // //               padding: '40px 20px',
// // //               color: '#6b7280'
// // //             }}>
// // //               <p style={{ fontSize: '16px', marginBottom: '8px' }}>👤 No operations performed yet</p>
// // //               <p style={{ fontSize: '14px' }}>
// // //                 Start camera to begin continuous scanning
// // //               </p>
// // //             </div>
// // //           )}
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default StationOperations;

















































// // import React, { useState, useRef, useEffect } from 'react';
// // import { stationApi } from '../../api/stationApi';
// // import { faceApi } from '../../api/faceApi';
// // import axiosInstance from '../../api/axiosConfig';
// // import { toast } from 'react-toastify';
// // import { MdLogin, MdLogout, MdVideocam, MdStopCircle, MdRefresh, MdWarning } from 'react-icons/md';
// // import Card from '../Common/Card';
// // import Loader from '../Common/Loader';
// // import '../../styles/admin.css';

// // const StationOperations = () => {
// //   const [stations, setStations] = useState([]);
// //   const [selectedStation, setSelectedStation] = useState('');
// //   const [operationType, setOperationType] = useState('entry');
// //   const [processing, setProcessing] = useState(false);
// //   const [lastResult, setLastResult] = useState(null);
// //   const [loading, setLoading] = useState(true);
  
// //   // Camera states
// //   const [isCameraActive, setIsCameraActive] = useState(false);
// //   const [stream, setStream] = useState(null);
// //   const [countdown, setCountdown] = useState(null);
// //   const [recognizing, setRecognizing] = useState(false);
// //   const [lastRecognizedUser, setLastRecognizedUser] = useState(null);
  
// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const countdownTimerRef = useRef(null);
// //   const captureIntervalRef = useRef(null);

// //   useEffect(() => {
// //     fetchStations();
// //     return () => {
// //       stopCamera();
// //     };
// //   }, []);

// //   const fetchStations = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await stationApi.getAllStations();
// //       if (data.success && data.stations && Array.isArray(data.stations)) {
// //         setStations(data.stations);
// //       } else if (data.stations && Array.isArray(data.stations)) {
// //         setStations(data.stations);
// //       } else if (Array.isArray(data)) {
// //         setStations(data);
// //       }
// //     } catch (error) {
// //       console.error('Failed to load stations:', error);
// //       toast.error('Failed to load stations');
// //       setStations([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const startCamera = async () => {
// //     try {
// //       const mediaStream = await navigator.mediaDevices.getUserMedia({
// //         video: { width: 640, height: 480, facingMode: 'user' }
// //       });
      
// //       setStream(mediaStream);
// //       setIsCameraActive(true);
      
// //       setTimeout(() => {
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = mediaStream;
// //           videoRef.current.play();
// //           startContinuousCapture();
// //         }
// //       }, 100);
      
// //       toast.success('Camera started! Auto-capturing every 5 seconds...');
// //     } catch (error) {
// //       console.error('Camera error:', error);
// //       toast.error('Failed to access camera');
// //       setIsCameraActive(false);
// //     }
// //   };

// //   const startContinuousCapture = () => {
// //     startCountdown();
// //     captureIntervalRef.current = setInterval(() => {
// //       startCountdown();
// //     }, 5000);
// //   };

// //   const startCountdown = () => {
// //     setCountdown(5);
// //     let count = 5;
    
// //     if (countdownTimerRef.current) {
// //       clearInterval(countdownTimerRef.current);
// //     }
    
// //     countdownTimerRef.current = setInterval(() => {
// //       count -= 1;
// //       setCountdown(count);
      
// //       if (count === 0) {
// //         clearInterval(countdownTimerRef.current);
// //         captureAndRecognize();
// //       }
// //     }, 1000);
// //   };

// //   const stopCamera = () => {
// //     if (stream) {
// //       stream.getTracks().forEach(track => track.stop());
// //     }
// //     if (videoRef.current) {
// //       videoRef.current.srcObject = null;
// //     }
// //     if (countdownTimerRef.current) {
// //       clearInterval(countdownTimerRef.current);
// //     }
// //     if (captureIntervalRef.current) {
// //       clearInterval(captureIntervalRef.current);
// //     }
// //     setStream(null);
// //     setIsCameraActive(false);
// //     setCountdown(null);
// //     setLastRecognizedUser(null);
// //   };

// //   const captureAndRecognize = async () => {
// //     if (!videoRef.current || !canvasRef.current || recognizing) {
// //       return;
// //     }

// //     const video = videoRef.current;
// //     const canvas = canvasRef.current;
// //     const context = canvas.getContext('2d');

// //     canvas.width = video.videoWidth;
// //     canvas.height = video.videoHeight;
// //     context.drawImage(video, 0, 0);

// //     canvas.toBlob(async (blob) => {
// //       const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
// //       await handleFaceRecognition(file);
// //     }, 'image/jpeg', 0.95);
// //   };

// //   const handleFaceRecognition = async (imageFile) => {
// //     setRecognizing(true);

// //     try {
// //       const response = await faceApi.testFaceRecognition(imageFile);
// //       console.log('Face recognition response:', response);
      
// //       if (response.recognized) {
// //         const userId = response.user_id || response.userid;
// //         const userName = response.username || response.user_name || 'User';
        
// //         if (userId) {
// //           setLastRecognizedUser({ userId, userName });
// //           toast.success(`✅ Face Recognized: ${userName}`, { autoClose: 2000 });
          
// //           // Auto-process journey
// //           await processJourney(userId);
// //         } else {
// //           toast.warning('⚠️ Face detected but user ID not found');
// //         }
// //       } else {
// //         setLastRecognizedUser(null);
// //       }
// //     } catch (error) {
// //       console.error('Recognition error:', error);
// //       setLastRecognizedUser(null);
// //     } finally {
// //       setRecognizing(false);
// //     }
// //   };

// //   const processJourney = async (userId) => {
// //     if (!selectedStation) {
// //       toast.error('Please select a station first');
// //       return;
// //     }

// //     if (processing) {
// //       return;
// //     }

// //     setProcessing(true);
// //     setLastResult(null);

// //     try {
// //       let result;
// //       const endpoint = operationType === 'entry' 
// //         ? `/api/automated-journey/entry/${selectedStation}`
// //         : `/api/automated-journey/exit/${selectedStation}`;

// //       const response = await axiosInstance.post(endpoint, {}, {
// //         params: {
// //           recognized_user_id: userId
// //         }
// //       });

// //       result = response.data;
// //       console.log('Journey response:', result);
      
// //       // ✅ Handle all response scenarios properly
// //       if (result.success && result.gate_open) {
// //         // SUCCESS - Gate opens
// //         if (operationType === 'entry') {
// //           toast.success(`✅ ENTRY ALLOWED\n${result.message}`, {
// //             autoClose: 4000,
// //             position: 'top-center'
// //           });
// //         } else {
// //           const fare = result.journey_details?.total_fare || 'N/A';
// //           toast.success(`✅ EXIT ALLOWED\nFare: ₹${fare}\n${result.message}`, {
// //             autoClose: 4000,
// //             position: 'top-center'
// //           });
// //         }
// //       } else {
// //         // DENIED - Show specific error messages
// //         const errorMsg = result.message || 'Operation denied';
        
// //         // ✅ Check for specific error types
// //         if (errorMsg.toLowerCase().includes('ongoing journey') || 
// //             errorMsg.toLowerCase().includes('active journey')) {
// //           toast.error(`⚠️ ${operationType.toUpperCase()} DENIED\nYou have an active journey.\nPlease exit first.`, {
// //             autoClose: 5000,
// //             position: 'top-center'
// //           });
// //         } else if (errorMsg.toLowerCase().includes('insufficient balance')) {
// //           toast.error(`💰 ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
// //             autoClose: 5000,
// //             position: 'top-center'
// //           });
// //         } else if (errorMsg.toLowerCase().includes('no fare found') ||
// //                    errorMsg.toLowerCase().includes('same station')) {
// //           toast.error(`🚫 ${operationType.toUpperCase()} DENIED\nCannot exit at entry station.\nPlease travel to another station.`, {
// //             autoClose: 5000,
// //             position: 'top-center'
// //           });
// //         } else {
// //           toast.error(`❌ ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
// //             autoClose: 4000,
// //             position: 'top-center'
// //           });
// //         }
// //       }

// //       setLastResult(result);
      
// //     } catch (error) {
// //       console.error('Process journey error:', error);
      
// //       // ✅ Better error message extraction
// //       let errorMsg = 'Operation failed';
      
// //       if (error.response?.data) {
// //         const data = error.response.data;
        
// //         if (typeof data === 'string') {
// //           errorMsg = data;
// //         } else if (data.message) {
// //           errorMsg = data.message;
// //         } else if (data.detail) {
// //           if (typeof data.detail === 'string') {
// //             errorMsg = data.detail;
// //           } else if (Array.isArray(data.detail)) {
// //             errorMsg = data.detail.map(err => err.msg || err).join(', ');
// //           }
// //         }
// //       } else if (error.message) {
// //         errorMsg = error.message;
// //       }
      
// //       toast.error(`❌ Operation Failed\n${errorMsg}`, { autoClose: 3000 });
      
// //       setLastResult({
// //         success: false,
// //         message: errorMsg,
// //         gate_open: false
// //       });
// //     } finally {
// //       setProcessing(false);
// //     }
// //   };

// //   const resetOperation = () => {
// //     setLastResult(null);
// //     setLastRecognizedUser(null);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="station-operations-container">
// //         <Loader message="Loading stations..." />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="station-operations-container">
// //       <h1>Station Operations</h1>
// //       <p className="subtitle">Automated Entry/Exit with Continuous Facial Recognition</p>

// //       <div className="operations-grid">
// //         <Card title="Gate Control">
// //           <div className="operation-form">
// //             {/* Operation Type Toggle */}
// //             <div className="form-group">
// //               <label>Operation Type</label>
// //               <div className="operation-toggle">
// //                 <button
// //                   className={`toggle-btn ${operationType === 'entry' ? 'active' : ''}`}
// //                   onClick={() => setOperationType('entry')}
// //                   disabled={processing || isCameraActive}
// //                 >
// //                   <MdLogin size={18} /> ENTRY
// //                 </button>
// //                 <button
// //                   className={`toggle-btn ${operationType === 'exit' ? 'active' : ''}`}
// //                   onClick={() => setOperationType('exit')}
// //                   disabled={processing || isCameraActive}
// //                 >
// //                   <MdLogout size={18} /> EXIT
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Station Selection */}
// //             <div className="form-group">
// //               <label>Current Station</label>
// //               <select
// //                 value={selectedStation}
// //                 onChange={(e) => setSelectedStation(e.target.value)}
// //                 required
// //                 disabled={isCameraActive || processing}
// //               >
// //                 <option value="">Select Station</option>
// //                 {stations.map((station) => (
// //                   <option key={station._id} value={station.station_code}>
// //                     {station.station_name} ({station.station_code})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Camera Section */}
// //             <div className="form-group">
// //               <label>Continuous Face Recognition</label>
              
// //               {!isCameraActive && (
// //                 <button
// //                   onClick={startCamera}
// //                   disabled={!selectedStation || processing}
// //                   className="camera-start-btn"
// //                 >
// //                   <MdVideocam /> Start Continuous Scanning
// //                 </button>
// //               )}

// //               {isCameraActive && (
// //                 <div className="camera-section">
// //                   <div className="camera-active-section">
// //                     <div className="camera-container">
// //                       <video
// //                         ref={videoRef}
// //                         autoPlay
// //                         playsInline
// //                         muted
// //                         className="camera-video"
// //                       />
// //                       {countdown !== null && countdown > 0 && (
// //                         <div style={{
// //                           position: 'absolute',
// //                           top: 0,
// //                           left: 0,
// //                           width: '100%',
// //                           height: '100%',
// //                           background: 'rgba(0, 0, 0, 0.6)',
// //                           display: 'flex',
// //                           flexDirection: 'column',
// //                           alignItems: 'center',
// //                           justifyContent: 'center',
// //                           color: 'white',
// //                           zIndex: 10
// //                         }}>
// //                           <div style={{
// //                             fontSize: '100px',
// //                             fontWeight: '800',
// //                             color: '#10b981',
// //                             textShadow: '0 0 30px rgba(16, 185, 129, 0.8)'
// //                           }}>
// //                             {countdown}
// //                           </div>
// //                           <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '600' }}>
// //                             Next scan in {countdown}s...
// //                           </p>
// //                         </div>
// //                       )}
// //                       {recognizing && (
// //                         <div style={{
// //                           position: 'absolute',
// //                           bottom: '20px',
// //                           left: '50%',
// //                           transform: 'translateX(-50%)',
// //                           background: 'rgba(99, 102, 241, 0.9)',
// //                           padding: '12px 24px',
// //                           borderRadius: '8px',
// //                           color: 'white',
// //                           fontWeight: '600',
// //                           zIndex: 11
// //                         }}>
// //                           🔍 Recognizing...
// //                         </div>
// //                       )}
// //                       {lastRecognizedUser && !recognizing && (
// //                         <div style={{
// //                           position: 'absolute',
// //                           bottom: '20px',
// //                           left: '50%',
// //                           transform: 'translateX(-50%)',
// //                           background: 'rgba(16, 185, 129, 0.95)',
// //                           padding: '12px 24px',
// //                           borderRadius: '8px',
// //                           color: 'white',
// //                           fontWeight: '700',
// //                           zIndex: 11,
// //                           textAlign: 'center'
// //                         }}>
// //                           ✅ {lastRecognizedUser.userName}
// //                           <br/>
// //                           <small>ID: {lastRecognizedUser.userId}</small>
// //                         </div>
// //                       )}
// //                       <canvas ref={canvasRef} style={{ display: 'none' }} />
// //                     </div>
// //                     <div className="camera-controls">
// //                       <button onClick={stopCamera} className="stop-btn">
// //                         <MdStopCircle /> Stop Scanning
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Instructions */}
// //             <div style={{
// //               marginTop: '24px',
// //               padding: '16px',
// //               backgroundColor: '#eff6ff',
// //               borderRadius: '8px',
// //               border: '1px solid #3b82f6'
// //             }}>
// //               <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📝 Instructions:</h4>
// //               <ol style={{ margin: '0', paddingLeft: '20px', color: '#1e3a8a' }}>
// //                 <li style={{ marginBottom: '8px' }}>Select operation type (Entry/Exit)</li>
// //                 <li style={{ marginBottom: '8px' }}>Select current station</li>
// //                 <li style={{ marginBottom: '8px' }}>Click "Start Continuous Scanning"</li>
// //                 <li style={{ marginBottom: '8px' }}>Camera scans every 5 seconds automatically</li>
// //                 <li style={{ marginBottom: '8px' }}>Journey processed when face recognized</li>
// //                 <li>Click "Stop Scanning" when done</li>
// //               </ol>
// //             </div>
// //           </div>
// //         </Card>

// //         <Card title="Operation Result">
// //           {lastResult ? (
// //             <div style={{
// //               padding: '20px',
// //               borderRadius: '12px',
// //               backgroundColor: lastResult.success ? '#d1fae5' : '#fee2e2',
// //               border: `2px solid ${lastResult.success ? '#10b981' : '#ef4444'}`
// //             }}>
// //               <div style={{
// //                 fontSize: '24px',
// //                 fontWeight: '800',
// //                 marginBottom: '16px',
// //                 textAlign: 'center',
// //                 color: lastResult.success ? '#065f46' : '#991b1b'
// //               }}>
// //                 {lastResult.success ? '✅ SUCCESS' : '❌ DENIED'}
// //               </div>
              
// //               {!lastResult.success && lastResult.message && (
// //                 <div style={{
// //                   padding: '12px',
// //                   backgroundColor: 'rgba(239, 68, 68, 0.1)',
// //                   borderRadius: '8px',
// //                   marginBottom: '16px',
// //                   display: 'flex',
// //                   alignItems: 'flex-start',
// //                   gap: '10px'
// //                 }}>
// //                   <MdWarning size={24} color="#991b1b" />
// //                   <div>
// //                     <p style={{ margin: '0', fontWeight: '600', color: '#991b1b' }}>
// //                       {lastResult.message}
// //                     </p>
// //                     {lastResult.message.includes('active journey') && (
// //                       <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#7f1d1d' }}>
// //                         💡 Tip: Complete your ongoing journey at an exit gate before starting a new one.
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
              
// //               <div>
// //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                   <strong>Action:</strong> {operationType.toUpperCase()}
// //                 </p>
// //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                   <strong>Station:</strong> {stations.find(s => s.station_code === selectedStation)?.station_name || selectedStation}
// //                 </p>
// //                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                   <strong>Gate:</strong> {lastResult.gate_open ? '🟢 OPEN' : '🔴 CLOSED'}
// //                 </p>
                
// //                 {lastRecognizedUser && (
// //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                     <strong>User:</strong> {lastRecognizedUser.userName}
// //                   </p>
// //                 )}
                
// //                 {lastResult.journey_id && (
// //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                     <strong>Journey ID:</strong> {lastResult.journey_id}
// //                   </p>
// //                 )}
                
// //                 {lastResult.current_balance !== undefined && (
// //                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
// //                     <strong>Wallet Balance:</strong> ₹{lastResult.current_balance?.toFixed(2)}
// //                   </p>
// //                 )}
                
// //                 {lastResult.journey_details && (
// //                   <div style={{
// //                     marginTop: '16px',
// //                     paddingTop: '16px',
// //                     borderTop: '2px dashed rgba(0,0,0,0.1)'
// //                   }}>
// //                     <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Journey Details</h4>
// //                     {lastResult.journey_details.total_fare && (
// //                       <p style={{
// //                         fontSize: '18px',
// //                         fontWeight: '800',
// //                         color: '#6366f1',
// //                         margin: '8px 0'
// //                       }}>
// //                         <strong>Total Fare:</strong> ₹{lastResult.journey_details.total_fare}
// //                       </p>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //               <button
// //                 onClick={resetOperation}
// //                 style={{
// //                   marginTop: '16px',
// //                   padding: '10px 20px',
// //                   backgroundColor: '#6b7280',
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '6px',
// //                   cursor: 'pointer',
// //                   width: '100%',
// //                   fontSize: '15px',
// //                   fontWeight: '600'
// //                 }}
// //               >
// //                 <MdRefresh style={{ verticalAlign: 'middle', marginRight: '6px' }} /> 
// //                 Clear Result
// //               </button>
// //             </div>
// //           ) : (
// //             <div style={{
// //               textAlign: 'center',
// //               padding: '40px 20px',
// //               color: '#6b7280'
// //             }}>
// //               <p style={{ fontSize: '16px', marginBottom: '8px' }}>👤 No operations performed yet</p>
// //               <p style={{ fontSize: '14px' }}>
// //                 Start camera to begin continuous scanning
// //               </p>
// //             </div>
// //           )}
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StationOperations;









// import React, { useState, useRef, useEffect } from 'react';
// import { stationApi } from '../../api/stationApi';
// import { faceApi } from '../../api/faceApi';
// import axiosInstance from '../../api/axiosConfig';
// import { toast } from 'react-toastify';
// import { MdLogin, MdLogout, MdVideocam, MdStopCircle, MdRefresh, MdWarning } from 'react-icons/md';
// import Card from '../Common/Card';
// import Loader from '../Common/Loader';
// import '../../styles/admin.css';

// const StationOperations = () => {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState('');
//   const [operationType, setOperationType] = useState('entry');
//   const [processing, setProcessing] = useState(false);
//   const [lastResult, setLastResult] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Camera states
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [countdown, setCountdown] = useState(null);
//   const [recognizing, setRecognizing] = useState(false);
//   const [lastRecognizedUser, setLastRecognizedUser] = useState(null);
  
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const countdownTimerRef = useRef(null);
//   const captureIntervalRef = useRef(null);

//   useEffect(() => {
//     fetchStations();
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const fetchStations = async () => {
//     try {
//       setLoading(true);
//       const data = await stationApi.getAllStations();
//       if (data.success && data.stations && Array.isArray(data.stations)) {
//         setStations(data.stations);
//       } else if (data.stations && Array.isArray(data.stations)) {
//         setStations(data.stations);
//       } else if (Array.isArray(data)) {
//         setStations(data);
//       }
//     } catch (error) {
//       console.error('Failed to load stations:', error);
//       toast.error('Failed to load stations');
//       setStations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480, facingMode: 'user' }
//       });
      
//       setStream(mediaStream);
//       setIsCameraActive(true);
      
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play();
//           startContinuousCapture();
//         }
//       }, 100);
      
//       toast.success('Camera started! Auto-capturing every 5 seconds...');
//     } catch (error) {
//       console.error('Camera error:', error);
//       toast.error('Failed to access camera');
//       setIsCameraActive(false);
//     }
//   };

//   // ✅ FIX: Ensure continuous capture runs properly
//   const startContinuousCapture = () => {
//     console.log('🔄 Starting continuous capture cycle');
    
//     // Start the first countdown immediately
//     startCountdown();
    
//     // ✅ Set up interval that fires EVERY 5 seconds
//     captureIntervalRef.current = setInterval(() => {
//       console.log('⏰ 5-second interval fired - starting new countdown');
//       startCountdown();
//     }, 5000);
    
//     console.log('✅ Continuous capture interval set up');
//   };

//   const startCountdown = () => {
//     console.log('⏳ Starting countdown from 5');
//     setCountdown(5);
//     let count = 5;
    
//     // Clear any existing countdown timer
//     if (countdownTimerRef.current) {
//       clearInterval(countdownTimerRef.current);
//     }
    
//     // ✅ Countdown that updates every second
//     countdownTimerRef.current = setInterval(() => {
//       count -= 1;
//       console.log(`⏱️ Countdown: ${count}`);
//       setCountdown(count);
      
//       if (count === 0) {
//         clearInterval(countdownTimerRef.current);
//         countdownTimerRef.current = null;
//         console.log('📸 Countdown complete - triggering capture');
//         captureAndRecognize();
//       }
//     }, 1000);
//   };

//   const stopCamera = () => {
//     console.log('🛑 Stopping camera and all intervals');
    
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     if (countdownTimerRef.current) {
//       clearInterval(countdownTimerRef.current);
//       countdownTimerRef.current = null;
//     }
//     if (captureIntervalRef.current) {
//       clearInterval(captureIntervalRef.current);
//       captureIntervalRef.current = null;
//     }
//     setStream(null);
//     setIsCameraActive(false);
//     setCountdown(null);
//     setLastRecognizedUser(null);
//   };

//   const captureAndRecognize = async () => {
//     if (!videoRef.current || !canvasRef.current) {
//       console.log('⚠️ Video or canvas ref not available');
//       return;
//     }

//     // ✅ Allow multiple captures to happen even if one is processing
//     if (recognizing) {
//       console.log('⚠️ Already recognizing, skipping this capture');
//       return;
//     }

//     console.log('📸 Capturing frame from video');

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0);

//     canvas.toBlob(async (blob) => {
//       const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
//       console.log('🖼️ Image blob created, starting face recognition');
//       await handleFaceRecognition(file);
//     }, 'image/jpeg', 0.95);
//   };

//   const handleFaceRecognition = async (imageFile) => {
//     setRecognizing(true);
//     console.log('🔍 Starting face recognition API call');

//     try {
//       const response = await faceApi.testFaceRecognition(imageFile);
//       console.log('✅ Face recognition response:', response);
      
//       if (response.recognized) {
//         const userId = response.user_id || response.userid;
//         const userName = response.username || response.user_name || 'User';
        
//         if (userId) {
//           setLastRecognizedUser({ userId, userName });
//           toast.success(`✅ Face Recognized: ${userName}`, { autoClose: 2000 });
//           console.log(`👤 Recognized user: ${userName} (${userId})`);
          
//           // Auto-process journey
//           await processJourney(userId);
//         } else {
//           console.log('⚠️ Face detected but no user ID found');
//           toast.warning('⚠️ Face detected but user ID not found');
//         }
//       } else {
//         console.log('❌ Face not recognized');
//         setLastRecognizedUser(null);
//       }
//     } catch (error) {
//       console.error('❌ Recognition error:', error);
//       setLastRecognizedUser(null);
//     } finally {
//       setRecognizing(false);
//       console.log('🏁 Face recognition complete');
//     }
//   };

//   const processJourney = async (userId) => {
//     if (!selectedStation) {
//       toast.error('Please select a station first');
//       console.log('⚠️ No station selected');
//       return;
//     }

//     if (processing) {
//       console.log('⚠️ Already processing a journey, skipping');
//       return;
//     }

//     setProcessing(true);
//     setLastResult(null);
//     console.log(`🚀 Processing ${operationType} journey for user ${userId} at station ${selectedStation}`);

//     try {
//       let result;
//       const endpoint = operationType === 'entry' 
//         ? `/api/automated-journey/entry/${selectedStation}`
//         : `/api/automated-journey/exit/${selectedStation}`;

//       console.log(`📡 API Call: POST ${endpoint} with user ${userId}`);

//       const response = await axiosInstance.post(endpoint, {}, {
//         params: {
//           recognized_user_id: userId
//         }
//       });

//       result = response.data;
//       console.log('✅ Journey API response:', result);
      
//       // ✅ Handle all response scenarios properly
//       if (result.success && result.gate_open) {
//         // SUCCESS - Gate opens
//         console.log('✅ Gate opened successfully');
//         if (operationType === 'entry') {
//           toast.success(`✅ ENTRY ALLOWED\n${result.message}`, {
//             autoClose: 4000,
//             position: 'top-center'
//           });
//         } else {
//           const fare = result.journey_details?.total_fare || 'N/A';
//           toast.success(`✅ EXIT ALLOWED\nFare: ₹${fare}\n${result.message}`, {
//             autoClose: 4000,
//             position: 'top-center'
//           });
//         }
//       } else {
//         // DENIED - Show specific error messages
//         console.log('❌ Operation denied:', result.message);
//         const errorMsg = result.message || 'Operation denied';
        
//         // ✅ Check for specific error types
//         if (errorMsg.toLowerCase().includes('ongoing journey') || 
//             errorMsg.toLowerCase().includes('active journey')) {
//           toast.error(`⚠️ ${operationType.toUpperCase()} DENIED\nYou have an active journey.\nPlease exit first.`, {
//             autoClose: 5000,
//             position: 'top-center'
//           });
//         } else if (errorMsg.toLowerCase().includes('insufficient balance')) {
//           toast.error(`💰 ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
//             autoClose: 5000,
//             position: 'top-center'
//           });
//         } else if (errorMsg.toLowerCase().includes('no fare found') ||
//                    errorMsg.toLowerCase().includes('same station')) {
//           toast.error(`🚫 ${operationType.toUpperCase()} DENIED\nCannot exit at entry station.\nPlease travel to another station.`, {
//             autoClose: 5000,
//             position: 'top-center'
//           });
//         } else {
//           toast.error(`❌ ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
//             autoClose: 4000,
//             position: 'top-center'
//           });
//         }
//       }

//       setLastResult(result);
      
//     } catch (error) {
//       console.error('❌ Process journey error:', error);
      
//       // ✅ Better error message extraction
//       let errorMsg = 'Operation failed';
      
//       if (error.response?.data) {
//         const data = error.response.data;
        
//         if (typeof data === 'string') {
//           errorMsg = data;
//         } else if (data.message) {
//           errorMsg = data.message;
//         } else if (data.detail) {
//           if (typeof data.detail === 'string') {
//             errorMsg = data.detail;
//           } else if (Array.isArray(data.detail)) {
//             errorMsg = data.detail.map(err => err.msg || err).join(', ');
//           }
//         }
//       } else if (error.message) {
//         errorMsg = error.message;
//       }
      
//       console.log('❌ Journey error:', errorMsg);
//       toast.error(`❌ Operation Failed\n${errorMsg}`, { autoClose: 3000 });
      
//       setLastResult({
//         success: false,
//         message: errorMsg,
//         gate_open: false
//       });
//     } finally {
//       setProcessing(false);
//       console.log('🏁 Journey processing complete');
//     }
//   };

//   const resetOperation = () => {
//     setLastResult(null);
//     setLastRecognizedUser(null);
//   };

//   if (loading) {
//     return (
//       <div className="station-operations-container">
//         <Loader message="Loading stations..." />
//       </div>
//     );
//   }

//   return (
//     <div className="station-operations-container">
//       <h1>Station Operations</h1>
//       <p className="subtitle">Automated Entry/Exit with Continuous Facial Recognition</p>

//       <div className="operations-grid">
//         <Card title="Gate Control">
//           <div className="operation-form">
//             {/* Operation Type Toggle */}
//             <div className="form-group">
//               <label>Operation Type</label>
//               <div className="operation-toggle">
//                 <button
//                   className={`toggle-btn ${operationType === 'entry' ? 'active' : ''}`}
//                   onClick={() => setOperationType('entry')}
//                   disabled={processing || isCameraActive}
//                 >
//                   <MdLogin size={18} /> ENTRY
//                 </button>
//                 <button
//                   className={`toggle-btn ${operationType === 'exit' ? 'active' : ''}`}
//                   onClick={() => setOperationType('exit')}
//                   disabled={processing || isCameraActive}
//                 >
//                   <MdLogout size={18} /> EXIT
//                 </button>
//               </div>
//             </div>

//             {/* Station Selection */}
//             <div className="form-group">
//               <label>Current Station</label>
//               <select
//                 value={selectedStation}
//                 onChange={(e) => setSelectedStation(e.target.value)}
//                 required
//                 disabled={isCameraActive || processing}
//               >
//                 <option value="">Select Station</option>
//                 {stations.map((station) => (
//                   <option key={station._id} value={station.station_code}>
//                     {station.station_name} ({station.station_code})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Camera Section */}
//             <div className="form-group">
//               <label>Continuous Face Recognition</label>
              
//               {!isCameraActive && (
//                 <button
//                   onClick={startCamera}
//                   disabled={!selectedStation || processing}
//                   className="camera-start-btn"
//                 >
//                   <MdVideocam /> Start Continuous Scanning
//                 </button>
//               )}

//               {isCameraActive && (
//                 <div className="camera-section">
//                   <div className="camera-active-section">
//                     <div className="camera-container">
//                       <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="camera-video"
//                       />
//                       {countdown !== null && countdown > 0 && (
//                         <div style={{
//                           position: 'absolute',
//                           top: 0,
//                           left: 0,
//                           width: '100%',
//                           height: '100%',
//                           background: 'rgba(0, 0, 0, 0.6)',
//                           display: 'flex',
//                           flexDirection: 'column',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           color: 'white',
//                           zIndex: 10
//                         }}>
//                           <div style={{
//                             fontSize: '100px',
//                             fontWeight: '800',
//                             color: '#10b981',
//                             textShadow: '0 0 30px rgba(16, 185, 129, 0.8)'
//                           }}>
//                             {countdown}
//                           </div>
//                           <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '600' }}>
//                             Next scan in {countdown}s...
//                           </p>
//                         </div>
//                       )}
//                       {recognizing && (
//                         <div style={{
//                           position: 'absolute',
//                           bottom: '20px',
//                           left: '50%',
//                           transform: 'translateX(-50%)',
//                           background: 'rgba(99, 102, 241, 0.9)',
//                           padding: '12px 24px',
//                           borderRadius: '8px',
//                           color: 'white',
//                           fontWeight: '600',
//                           zIndex: 11
//                         }}>
//                           🔍 Recognizing...
//                         </div>
//                       )}
//                       {lastRecognizedUser && !recognizing && (
//                         <div style={{
//                           position: 'absolute',
//                           bottom: '20px',
//                           left: '50%',
//                           transform: 'translateX(-50%)',
//                           background: 'rgba(16, 185, 129, 0.95)',
//                           padding: '12px 24px',
//                           borderRadius: '8px',
//                           color: 'white',
//                           fontWeight: '700',
//                           zIndex: 11,
//                           textAlign: 'center'
//                         }}>
//                           ✅ {lastRecognizedUser.userName}
//                           <br/>
//                           <small>ID: {lastRecognizedUser.userId}</small>
//                         </div>
//                       )}
//                       <canvas ref={canvasRef} style={{ display: 'none' }} />
//                     </div>
//                     <div className="camera-controls">
//                       <button onClick={stopCamera} className="stop-btn">
//                         <MdStopCircle /> Stop Scanning
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Instructions */}
//             <div style={{
//               marginTop: '24px',
//               padding: '16px',
//               backgroundColor: '#eff6ff',
//               borderRadius: '8px',
//               border: '1px solid #3b82f6'
//             }}>
//               <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📝 Instructions:</h4>
//               <ol style={{ margin: '0', paddingLeft: '20px', color: '#1e3a8a' }}>
//                 <li style={{ marginBottom: '8px' }}>Select operation type (Entry/Exit)</li>
//                 <li style={{ marginBottom: '8px' }}>Select current station</li>
//                 <li style={{ marginBottom: '8px' }}>Click "Start Continuous Scanning"</li>
//                 <li style={{ marginBottom: '8px' }}>Camera scans every 5 seconds automatically</li>
//                 <li style={{ marginBottom: '8px' }}>Journey processed when face recognized</li>
//                 <li>Click "Stop Scanning" when done</li>
//               </ol>
//             </div>
//           </div>
//         </Card>

//         <Card title="Operation Result">
//           {lastResult ? (
//             <div style={{
//               padding: '20px',
//               borderRadius: '12px',
//               backgroundColor: lastResult.success ? '#d1fae5' : '#fee2e2',
//               border: `2px solid ${lastResult.success ? '#10b981' : '#ef4444'}`
//             }}>
//               <div style={{
//                 fontSize: '24px',
//                 fontWeight: '800',
//                 marginBottom: '16px',
//                 textAlign: 'center',
//                 color: lastResult.success ? '#065f46' : '#991b1b'
//               }}>
//                 {lastResult.success ? '✅ SUCCESS' : '❌ DENIED'}
//               </div>
              
//               {!lastResult.success && lastResult.message && (
//                 <div style={{
//                   padding: '12px',
//                   backgroundColor: 'rgba(239, 68, 68, 0.1)',
//                   borderRadius: '8px',
//                   marginBottom: '16px',
//                   display: 'flex',
//                   alignItems: 'flex-start',
//                   gap: '10px'
//                 }}>
//                   <MdWarning size={24} color="#991b1b" />
//                   <div>
//                     <p style={{ margin: '0', fontWeight: '600', color: '#991b1b' }}>
//                       {lastResult.message}
//                     </p>
//                     {lastResult.message.includes('active journey') && (
//                       <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#7f1d1d' }}>
//                         💡 Tip: Complete your ongoing journey at an exit gate before starting a new one.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
              
//               <div>
//                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                   <strong>Action:</strong> {operationType.toUpperCase()}
//                 </p>
//                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                   <strong>Station:</strong> {stations.find(s => s.station_code === selectedStation)?.station_name || selectedStation}
//                 </p>
//                 <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                   <strong>Gate:</strong> {lastResult.gate_open ? '🟢 OPEN' : '🔴 CLOSED'}
//                 </p>
                
//                 {lastRecognizedUser && (
//                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                     <strong>User:</strong> {lastRecognizedUser.userName}
//                   </p>
//                 )}
                
//                 {lastResult.journey_id && (
//                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                     <strong>Journey ID:</strong> {lastResult.journey_id}
//                   </p>
//                 )}
                
//                 {lastResult.current_balance !== undefined && (
//                   <p style={{ margin: '8px 0', fontSize: '15px' }}>
//                     <strong>Wallet Balance:</strong> ₹{lastResult.current_balance?.toFixed(2)}
//                   </p>
//                 )}
                
//                 {lastResult.journey_details && (
//                   <div style={{
//                     marginTop: '16px',
//                     paddingTop: '16px',
//                     borderTop: '2px dashed rgba(0,0,0,0.1)'
//                   }}>
//                     <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Journey Details</h4>
//                     {lastResult.journey_details.total_fare && (
//                       <p style={{
//                         fontSize: '18px',
//                         fontWeight: '800',
//                         color: '#6366f1',
//                         margin: '8px 0'
//                       }}>
//                         <strong>Total Fare:</strong> ₹{lastResult.journey_details.total_fare}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={resetOperation}
//                 style={{
//                   marginTop: '16px',
//                   padding: '10px 20px',
//                   backgroundColor: '#6b7280',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   width: '100%',
//                   fontSize: '15px',
//                   fontWeight: '600'
//                 }}
//               >
//                 <MdRefresh style={{ verticalAlign: 'middle', marginRight: '6px' }} /> 
//                 Clear Result
//               </button>
//             </div>
//           ) : (
//             <div style={{
//               textAlign: 'center',
//               padding: '40px 20px',
//               color: '#6b7280'
//             }}>
//               <p style={{ fontSize: '16px', marginBottom: '8px' }}>👤 No operations performed yet</p>
//               <p style={{ fontSize: '14px' }}>
//                 Start camera to begin continuous scanning
//               </p>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default StationOperations;





























































import React, { useState, useRef, useEffect } from 'react';
import { stationApi } from '../../api/stationApi';
import { faceApi } from '../../api/faceApi';
import axiosInstance from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { MdLogin, MdLogout, MdVideocam, MdStopCircle, MdRefresh, MdWarning } from 'react-icons/md';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import '../../styles/admin.css';

const StationOperations = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [operationType, setOperationType] = useState('entry');
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [recognizing, setRecognizing] = useState(false);
  const [lastRecognizedUser, setLastRecognizedUser] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const captureIntervalRef = useRef(null);

  useEffect(() => {
    fetchStations();
    return () => {
      stopCamera();
    };
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await stationApi.getAllStations();
      if (data.success && data.stations && Array.isArray(data.stations)) {
        setStations(data.stations);
      } else if (data.stations && Array.isArray(data.stations)) {
        setStations(data.stations);
      } else if (Array.isArray(data)) {
        setStations(data);
      }
    } catch (error) {
      console.error('Failed to load stations:', error);
      toast.error('Failed to load stations');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          startContinuousCapture();
        }
      }, 100);
      
      toast.success('Camera started! Auto-capturing every 5 seconds...');
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Failed to access camera');
      setIsCameraActive(false);
    }
  };

  const startContinuousCapture = () => {
    console.log('🔄 Starting continuous capture cycle');
    startCountdown();
    captureIntervalRef.current = setInterval(() => {
      console.log('⏰ 5-second interval fired - starting new countdown');
      startCountdown();
    }, 5000);
    console.log('✅ Continuous capture interval set up');
  };

  const startCountdown = () => {
    console.log('⏳ Starting countdown from 5');
    setCountdown(5);
    let count = 5;
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      console.log(`⏱️ Countdown: ${count}`);
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        console.log('📸 Countdown complete - triggering capture');
        captureAndRecognize();
      }
    }, 1000);
  };

  const stopCamera = () => {
    console.log('🛑 Stopping camera and all intervals');
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setStream(null);
    setIsCameraActive(false);
    setCountdown(null);
    setLastRecognizedUser(null);
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.log('⚠️ Video or canvas ref not available');
      return;
    }

    if (recognizing) {
      console.log('⚠️ Already recognizing, skipping this capture');
      return;
    }

    console.log('📸 Capturing frame from video');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      console.log('🖼️ Image blob created, starting face recognition');
      await handleFaceRecognition(file);
    }, 'image/jpeg', 0.95);
  };

  const handleFaceRecognition = async (imageFile) => {
    setRecognizing(true);
    console.log('🔍 Starting face recognition API call');

    try {
      const response = await faceApi.testFaceRecognition(imageFile);
      console.log('✅ Face recognition response:', response);
      
      if (response.recognized) {
        const userId = response.user_id || response.userid;
        const userName = response.username || response.user_name || 'User';
        
        if (userId) {
          setLastRecognizedUser({ userId, userName });
          toast.success(`✅ Face Recognized: ${userName}`, { autoClose: 2000 });
          console.log(`👤 Recognized user: ${userName} (${userId})`);
          
          await processJourney(userId);
        } else {
          console.log('⚠️ Face detected but no user ID found');
          toast.warning('⚠️ Face detected but user ID not found');
        }
      } else {
        console.log('❌ Face not recognized');
        setLastRecognizedUser(null);
      }
    } catch (error) {
      console.error('❌ Recognition error:', error);
      setLastRecognizedUser(null);
    } finally {
      setRecognizing(false);
      console.log('🏁 Face recognition complete');
    }
  };

  const processJourney = async (userId) => {
    if (!selectedStation) {
      toast.error('Please select a station first');
      console.log('⚠️ No station selected');
      return;
    }

    if (processing) {
      console.log('⚠️ Already processing a journey, skipping');
      return;
    }

    setProcessing(true);
    setLastResult(null);
    console.log(`🚀 Processing ${operationType} journey for user ${userId} at station ${selectedStation}`);

    try {
      let result;
      const endpoint = operationType === 'entry' 
        ? `/api/automated-journey/entry/${selectedStation}`
        : `/api/automated-journey/exit/${selectedStation}`;

      console.log(`📡 API Call: POST ${endpoint} with user ${userId}`);

      const response = await axiosInstance.post(endpoint, {}, {
        params: {
          recognized_user_id: userId
        }
      });

      result = response.data;
      console.log('✅ Journey API response:', result);
      
      // ✅ FIXED: Extract fare from correct nested path
      // Backend returns: journey_details.fare_details.total_fare
      let fareAmount = null;
      if (result.journey_details?.fare_details) {
        fareAmount = result.journey_details.fare_details.total_fare ||
                     result.journey_details.fare_details.totalfare;
      }

      console.log('💰 Extracted fare amount:', fareAmount);
      
      if (result.success && result.gate_open) {
        // SUCCESS - Gate opens
        console.log('✅ Gate opened successfully');
        if (operationType === 'entry') {
          toast.success(`✅ ENTRY ALLOWED\n${result.message}`, {
            autoClose: 4000,
            position: 'top-center'
          });
        } else {
          // ✅ FIXED: Display fare correctly
          const displayFare = fareAmount !== null && fareAmount !== undefined 
            ? `₹${Number(fareAmount).toFixed(2)}` 
            : 'Calculated';
          
          toast.success(`✅ EXIT ALLOWED\nFare: ${displayFare}\n${result.message}`, {
            autoClose: 4000,
            position: 'top-center'
          });
        }
      } else {
        // DENIED - Show specific error messages
        console.log('❌ Operation denied:', result.message);
        const errorMsg = result.message || 'Operation denied';
        
        if (errorMsg.toLowerCase().includes('ongoing journey') || 
            errorMsg.toLowerCase().includes('active journey')) {
          toast.error(`⚠️ ${operationType.toUpperCase()} DENIED\nYou have an active journey.\nPlease exit first.`, {
            autoClose: 5000,
            position: 'top-center'
          });
        } else if (errorMsg.toLowerCase().includes('insufficient balance') ||
                   errorMsg.toLowerCase().includes('low balance')) {
          toast.error(`💰 ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
            autoClose: 5000,
            position: 'top-center'
          });
        } else if (errorMsg.toLowerCase().includes('no fare found') ||
                   errorMsg.toLowerCase().includes('same station') ||
                   errorMsg.toLowerCase().includes('no journey ongoing')) {
          toast.error(`🚫 ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
            autoClose: 5000,
            position: 'top-center'
          });
        } else {
          toast.error(`❌ ${operationType.toUpperCase()} DENIED\n${errorMsg}`, {
            autoClose: 4000,
            position: 'top-center'
          });
        }
      }

      setLastResult(result);
      
    } catch (error) {
      console.error('❌ Process journey error:', error);
      
      let errorMsg = 'Operation failed';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(err => err.msg || err).join(', ');
          }
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.log('❌ Journey error:', errorMsg);
      toast.error(`❌ Operation Failed\n${errorMsg}`, { autoClose: 3000 });
      
      setLastResult({
        success: false,
        message: errorMsg,
        gate_open: false
      });
    } finally {
      setProcessing(false);
      console.log('🏁 Journey processing complete');
    }
  };

  const resetOperation = () => {
    setLastResult(null);
    setLastRecognizedUser(null);
  };

  if (loading) {
    return (
      <div className="station-operations-container">
        <Loader message="Loading stations..." />
      </div>
    );
  }

  // ✅ FIXED: Extract fare from correct nested location
  const getFareDisplay = () => {
    // Backend structure: journey_details.fare_details.total_fare
    const fareDetails = lastResult?.journey_details?.fare_details;
    if (!fareDetails) return null;
    
    const fare = fareDetails.total_fare || fareDetails.totalfare;
    return fare !== null && fare !== undefined ? Number(fare).toFixed(2) : null;
  };

  return (
    <div className="station-operations-container">
      <h1>Station Operations</h1>
      <p className="subtitle">Automated Entry/Exit with Continuous Facial Recognition</p>

      <div className="operations-grid">
        <Card title="Gate Control">
          <div className="operation-form">
            {/* Operation Type Toggle */}
            <div className="form-group">
              <label>Operation Type</label>
              <div className="operation-toggle">
                <button
                  className={`toggle-btn ${operationType === 'entry' ? 'active' : ''}`}
                  onClick={() => setOperationType('entry')}
                  disabled={processing || isCameraActive}
                >
                  <MdLogin size={18} /> ENTRY
                </button>
                <button
                  className={`toggle-btn ${operationType === 'exit' ? 'active' : ''}`}
                  onClick={() => setOperationType('exit')}
                  disabled={processing || isCameraActive}
                >
                  <MdLogout size={18} /> EXIT
                </button>
              </div>
            </div>

            {/* Station Selection */}
            <div className="form-group">
              <label>Current Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                required
                disabled={isCameraActive || processing}
              >
                <option value="">Select Station</option>
                {stations.map((station) => (
                  <option key={station._id} value={station.station_code}>
                    {station.station_name} ({station.station_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Camera Section */}
            <div className="form-group">
              <label>Continuous Face Recognition</label>
              
              {!isCameraActive && (
                <button
                  onClick={startCamera}
                  disabled={!selectedStation || processing}
                  className="camera-start-btn"
                >
                  <MdVideocam /> Start Continuous Scanning
                </button>
              )}

              {isCameraActive && (
                <div className="camera-section">
                  <div className="camera-active-section">
                    <div className="camera-container">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video"
                      />
                      {countdown !== null && countdown > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0, 0, 0, 0.6)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          zIndex: 10
                        }}>
                          <div style={{
                            fontSize: '100px',
                            fontWeight: '800',
                            color: '#10b981',
                            textShadow: '0 0 30px rgba(16, 185, 129, 0.8)'
                          }}>
                            {countdown}
                          </div>
                          <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '600' }}>
                            Next scan in {countdown}s...
                          </p>
                        </div>
                      )}
                      {recognizing && (
                        <div style={{
                          position: 'absolute',
                          bottom: '20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(99, 102, 241, 0.9)',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '600',
                          zIndex: 11
                        }}>
                          🔍 Recognizing...
                        </div>
                      )}
                      {lastRecognizedUser && !recognizing && (
                        <div style={{
                          position: 'absolute',
                          bottom: '20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(16, 185, 129, 0.95)',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '700',
                          zIndex: 11,
                          textAlign: 'center'
                        }}>
                          ✅ {lastRecognizedUser.userName}
                          <br/>
                          <small>ID: {lastRecognizedUser.userId}</small>
                        </div>
                      )}
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                    <div className="camera-controls">
                      <button onClick={stopCamera} className="stop-btn">
                        <MdStopCircle /> Stop Scanning
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #3b82f6'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📝 Instructions:</h4>
              <ol style={{ margin: '0', paddingLeft: '20px', color: '#1e3a8a' }}>
                <li style={{ marginBottom: '8px' }}>Select operation type (Entry/Exit)</li>
                <li style={{ marginBottom: '8px' }}>Select current station</li>
                <li style={{ marginBottom: '8px' }}>Click "Start Continuous Scanning"</li>
                <li style={{ marginBottom: '8px' }}>Camera scans every 5 seconds automatically</li>
                <li style={{ marginBottom: '8px' }}>Journey processed when face recognized</li>
                <li>Click "Stop Scanning" when done</li>
              </ol>
            </div>
          </div>
        </Card>

        <Card title="Operation Result">
          {lastResult ? (
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: lastResult.success ? '#d1fae5' : '#fee2e2',
              border: `2px solid ${lastResult.success ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '16px',
                textAlign: 'center',
                color: lastResult.success ? '#065f46' : '#991b1b'
              }}>
                {lastResult.success ? '✅ SUCCESS' : '❌ DENIED'}
              </div>
              
              {!lastResult.success && lastResult.message && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <MdWarning size={24} color="#991b1b" />
                  <div>
                    <p style={{ margin: '0', fontWeight: '600', color: '#991b1b' }}>
                      {lastResult.message}
                    </p>
                    {lastResult.message.includes('active journey') && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#7f1d1d' }}>
                        💡 Tip: Complete your ongoing journey at an exit gate before starting a new one.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <strong>Action:</strong> {operationType.toUpperCase()}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <strong>Station:</strong> {stations.find(s => s.station_code === selectedStation)?.station_name || selectedStation}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <strong>Gate:</strong> {lastResult.gate_open ? '🟢 OPEN' : '🔴 CLOSED'}
                </p>
                
                {lastRecognizedUser && (
                  <p style={{ margin: '8px 0', fontSize: '15px' }}>
                    <strong>User:</strong> {lastRecognizedUser.userName}
                  </p>
                )}
                
                {lastResult.journey_id && (
                  <p style={{ margin: '8px 0', fontSize: '15px' }}>
                    <strong>Journey ID:</strong> {lastResult.journey_id}
                  </p>
                )}
                
                {lastResult.current_balance !== undefined && (
                  <p style={{ margin: '8px 0', fontSize: '15px' }}>
                    <strong>Wallet Balance:</strong> ₹{lastResult.current_balance?.toFixed(2)}
                  </p>
                )}
                
                {/* ✅ FIXED: Display fare details correctly */}
                {lastResult.journey_details?.fare_details && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '2px dashed rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Journey Details</h4>
                    
                    {/* Route Information */}
                    {lastResult.journey_details.fare_details.from_station && (
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>
                        <strong>Route:</strong> {lastResult.journey_details.fare_details.from_station} → {lastResult.journey_details.fare_details.to_station}
                      </p>
                    )}
                    
                    {/* Distance */}
                    {lastResult.journey_details.fare_details.distance_km && (
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>
                        <strong>Distance:</strong> {lastResult.journey_details.fare_details.distance_km} km
                      </p>
                    )}
                    
                    {/* Base Fare */}
                    {lastResult.journey_details.fare_details.base_fare !== undefined && (
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>
                        <strong>Base Fare:</strong> ₹{Number(lastResult.journey_details.fare_details.base_fare).toFixed(2)}
                      </p>
                    )}
                    
                    {/* Service Charge */}
                    {lastResult.journey_details.fare_details.service_charge !== undefined && (
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>
                        <strong>Service Charge:</strong> ₹{Number(lastResult.journey_details.fare_details.service_charge).toFixed(2)}
                      </p>
                    )}
                    
                    {/* Penalty (if any) */}
                    {lastResult.journey_details.fare_details.penalty_fare > 0 && (
                      <p style={{ margin: '8px 0', fontSize: '14px', color: '#dc2626' }}>
                        <strong>Penalty:</strong> ₹{Number(lastResult.journey_details.fare_details.penalty_fare).toFixed(2)}
                      </p>
                    )}
                    
                    {/* Total Fare */}
                    {(() => {
                      const fare = getFareDisplay();
                      if (fare !== null) {
                        return (
                          <p style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#6366f1',
                            margin: '12px 0 0 0',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(0,0,0,0.1)'
                          }}>
                            <strong>Total Fare:</strong> ₹{fare}
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
              <button
                onClick={resetOperation}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                <MdRefresh style={{ verticalAlign: 'middle', marginRight: '6px' }} /> 
                Clear Result
              </button>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>👤 No operations performed yet</p>
              <p style={{ fontSize: '14px' }}>
                Start camera to begin continuous scanning
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StationOperations;
