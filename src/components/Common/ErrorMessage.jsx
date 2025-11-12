import React from 'react';
import { MdError } from 'react-icons/md';
import '../../styles/global.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <MdError className="error-icon" />
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
