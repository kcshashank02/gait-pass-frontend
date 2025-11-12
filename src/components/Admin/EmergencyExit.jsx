import React, { useState } from 'react';
import { journeyApi } from '../../api/journeyApi';
import { toast } from 'react-toastify';
import { MdWarning } from 'react-icons/md';
import { getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';

const EmergencyExit = () => {
  const [userId, setUserId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleEmergencyExit = async () => {
    if (!userId) {
      toast.error('Please enter user ID');
      return;
    }

    if (!window.confirm('Are you sure you want to perform emergency exit for this user?')) {
      return;
    }

    setProcessing(true);
    try {
      const result = await journeyApi.emergencyExit(userId);
      
      if (result.success) {
        toast.success('Emergency exit completed successfully');
      } else {
        toast.warning(result.message);
      }
      
      setUserId('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card title="Emergency Exit" className="emergency-exit-card">
      <div className="emergency-content">
        <div className="warning-banner">
          <MdWarning /> Use only in emergency situations
        </div>
        
        <p>Cancel ongoing journey without fare deduction (emergency use only)</p>
        
        <div className="form-group">
          <label>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
        </div>

        <button 
          onClick={handleEmergencyExit}
          className="emergency-btn"
          disabled={processing || !userId}
        >
          {processing ? 'Processing...' : 'Execute Emergency Exit'}
        </button>
      </div>
    </Card>
  );
};

export default EmergencyExit;
