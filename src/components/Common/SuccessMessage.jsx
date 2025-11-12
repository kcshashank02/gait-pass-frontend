import React from 'react';
import { MdCheckCircle } from 'react-icons/md';
import '../../styles/global.css';

const SuccessMessage = ({ message }) => {
  return (
    <div className="success-message">
      <MdCheckCircle className="success-icon" />
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
