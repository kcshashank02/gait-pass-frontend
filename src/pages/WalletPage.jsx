import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Wallet from '../components/User/Wallet';
import '../styles/wallet.css';

const WalletPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="user" />
      <div className="dashboard-main">
        <Wallet />
      </div>
    </div>
  );
};

export default WalletPage;
