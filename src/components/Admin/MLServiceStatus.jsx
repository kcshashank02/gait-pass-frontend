import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { MdCheckCircle, MdCancel, MdRefresh } from 'react-icons/md';
import Card from '../Common/Card';

const MLServiceStatus = () => {
  const [status, setStatus] = useState('checking');
  const [responseTime, setResponseTime] = useState(null);
  const [checking, setChecking] = useState(false);
  const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL;
  
  const hasCheckedRef = useRef(false);
  const hasShownToastRef = useRef(false); // ✅ Track if toast was shown

  useEffect(() => {
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkMLService(true); // Pass true for initial check
    }
  }, []);

  const checkMLService = async (isInitialCheck = false) => {
    setChecking(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${ML_SERVICE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      if (response.ok) {
        setStatus('online');
        setResponseTime(timeTaken);
        
        // ✅ Show toast only once on initial check, or on manual refresh
        if (isInitialCheck && !hasShownToastRef.current) {
          toast.success('ML Service is up and ready!', {
            toastId: 'ml-service-status', // ✅ Prevent duplicates
            autoClose: 3000
          });
          hasShownToastRef.current = true;
        } else if (!isInitialCheck) {
          // Manual refresh
          toast.success('ML Service is online and ready!', {
            autoClose: 2000
          });
        }
      } else {
        setStatus('error');
        setResponseTime(null);
        if (!isInitialCheck) {
          toast.error('ML Service returned an error');
        }
      }
    } catch (error) {
      console.error('ML Service check failed:', error);
      setStatus('offline');
      setResponseTime(null);
      if (!isInitialCheck) {
        toast.warning('ML Service is offline. Click "Wake Up Service" to activate it.');
      }
    } finally {
      setChecking(false);
    }
  };

  const wakeUpService = () => {
    toast.info('Opening ML service in new tab to wake it up...');
    window.open(ML_SERVICE_URL, '_blank');
    
    setTimeout(() => {
      toast.info('Checking service status...');
      checkMLService(false);
    }, 5000);
  };

  return (
    <Card title="ML Service Status" className="ml-status-card">
      <div className="ml-status-content">
        <div className={`status-indicator ${status}`}>
          {status === 'online' && <MdCheckCircle size={32} />}
          {status === 'offline' && <MdCancel size={32} />}
          {status === 'checking' && <div className="spinner"></div>}
          
          <div className="status-text">
            <h3>
              {status === 'online' && 'Service Online'}
              {status === 'offline' && 'Service Offline'}
              {status === 'checking' && 'Checking...'}
              {status === 'error' && 'Service Error'}
            </h3>
            {responseTime && <p>Response time: {responseTime}ms</p>}
          </div>
        </div>

        <div className="service-info">
          <p><strong>Service URL:</strong></p>
          <a href={ML_SERVICE_URL} target="_blank" rel="noopener noreferrer">
            {ML_SERVICE_URL}
          </a>
        </div>

        <div className="status-actions">
          <button 
            onClick={() => checkMLService(false)} 
            disabled={checking}
            className="check-btn"
          >
            <MdRefresh />
            {checking ? 'Checking...' : 'Check Status'}
          </button>

          {status === 'offline' && (
            <button 
              onClick={wakeUpService}
              className="wake-btn"
            >
              Wake Up Service
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MLServiceStatus;
