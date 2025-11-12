import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '../api/walletApi';

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Use useCallback to prevent recreation on every render
  const fetchWalletDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await walletApi.getDetails();
      
      // Extract nested wallet object
      if (data.wallet) {
        setWallet(data.wallet);
      } else if (data.success && data.data) {
        setWallet(data.data);
      } else {
        setWallet(data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Wallet fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to fetch wallet details');
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty dependency array - function never changes

  // ✅ Only run once on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadWallet = async () => {
      if (isMounted) {
        await fetchWalletDetails();
      }
    };
    
    loadWallet();
    
    // ✅ Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchWalletDetails]); // ✅ Stable dependency

  const recharge = async (amount) => {
    try {
      const data = await walletApi.rechargeWallet(amount);
      await fetchWalletDetails(); // Refresh after recharge
      return data;
    } catch (err) {
      throw err;
    }
  };

  const activate = async () => {
    try {
      const data = await walletApi.activateWallet();
      await fetchWalletDetails(); // Refresh after activation
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    wallet,
    loading,
    error,
    recharge,
    activate,
    refresh: fetchWalletDetails
  };
};
