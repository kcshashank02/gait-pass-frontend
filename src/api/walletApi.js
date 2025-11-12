import axiosInstance from './axiosConfig';

export const walletApi = {
  getBalance: async () => {
    const response = await axiosInstance.get('/api/wallet/balance');
    return response.data;
  },

  getDetails: async () => {
    const response = await axiosInstance.get('/api/wallet/details');
    return response.data;
  },

  activateWallet: async () => {
    const response = await axiosInstance.post('/api/wallet/activate');
    return response.data;
  },

  rechargeWallet: async (amount) => {
    // ✅ Backend expects: amount, payment_method, reference (optional)
    const response = await axiosInstance.post('/api/wallet/recharge', {
      amount: amount,
      payment_method: 'upi',  // ✅ Required field (card, upi, netbanking)
      reference: `RECHARGE_${Date.now()}`  // ✅ Optional but good to include
    });
    return response.data;
  },

  getTransactionHistory: async () => {
    const response = await axiosInstance.get('/api/wallet/history');
    return response.data;
  }
};
