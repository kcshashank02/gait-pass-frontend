import React, { useState, useEffect } from 'react';
import { walletApi } from '../../api/walletApi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { 
  MdAccountBalanceWallet, 
  MdAdd, 
  MdCreditCard,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import '../../styles/wallet.css';

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, transactionData] = await Promise.all([
        walletApi.getDetails(),
        walletApi.getTransactionHistory()
      ]);

      if (walletData.success) {
        setWallet(walletData.wallet);
      }

      if (transactionData.success) {
        // ✅ Backend returns transactions directly
        setTransactions(transactionData.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayRecharge = async () => {
    const amount = parseFloat(rechargeAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 10) {
      toast.error('Minimum recharge amount is ₹10');
      return;
    }

    if (amount > 10000) {
      toast.error('Maximum recharge amount is ₹10,000');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error('Payment gateway not configured. Please contact support.');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    setProcessing(true);

    try {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Gait-Pass',
        description: 'Wallet Recharge',
        
        handler: async function (response) {
          console.log('✅ Payment Success:', response);
          
          try {
            const result = await walletApi.rechargeWallet(amount);
            
            if (result.success) {
              toast.success(`✅ Wallet recharged! Added ${formatCurrency(amount)}`);
              setIsRechargeModalOpen(false);
              setRechargeAmount('');
              setProcessing(false);
              fetchWalletData();
            } else {
              toast.error(result.message || 'Recharge failed');
              setProcessing(false);
            }
          } catch (error) {
            console.error('Backend recharge confirmation failed:', error);
            toast.error(getErrorMessage(error));
            setProcessing(false);
          }
        },

        prefill: {
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User',
          email: user?.email || '',
          contact: user?.phone || ''
        },

        notes: {
          wallet_id: wallet?.wallet_number || '',
          user_email: user?.email || '',
          user_id: user?.id || '',
          recharge_type: 'wallet',
          payment_method: paymentMethod
        },

        theme: {
          color: '#6366f1'
        },

        modal: {
          ondismiss: function() {
            toast.warning('Payment cancelled');
            setProcessing(false);
          },
          escape: true,
          confirm_close: true
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment Failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      rzp.open();

    } catch (error) {
      console.error('❌ Razorpay initialization failed:', error);
      toast.error('Failed to open payment gateway');
      setProcessing(false);
    }
  };

  const handleActivateWallet = async () => {
    try {
      const result = await walletApi.activateWallet();
      if (result.success) {
        toast.success('Wallet activated successfully!');
        fetchWalletData();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <Loader message="Loading wallet..." />;
  }

  if (!wallet) {
    return (
      <div className="wallet-container">
        <Card title="Wallet" className="wallet-inactive-card">
          <p>Your wallet is not active yet.</p>
          <button onClick={handleActivateWallet} className="activate-wallet-btn">
            Activate Wallet
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="page-header">
        <h1>My Wallet</h1>
        <button 
          onClick={() => setIsRechargeModalOpen(true)} 
          className="recharge-btn"
        >
          <MdAdd /> Recharge Wallet
        </button>
      </div>

      <Card className="wallet-balance-card">
        <div className="wallet-balance-content">
          <div className="balance-icon">
            <MdAccountBalanceWallet size={48} />
          </div>
          <div className="balance-info">
            <p className="balance-label">Available Balance</p>
            <h2 className="balance-amount">{formatCurrency(wallet.balance || 0)}</h2>
            <p className="wallet-number">Wallet: {wallet.wallet_number || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* ✅ FIXED: Transaction History */}
      <Card title="Transaction History" className="transaction-history-card">
        <div className="transactions-container">
          {transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((txn, index) => {
                // ✅ Backend returns "type" field with "credit" or "debit"
                const transactionType = txn.type || 'unknown';
                const isCredit = transactionType.toLowerCase() === 'credit';
                const description = txn.description || `${transactionType} transaction`;
                const transactionDate = txn.timestamp || txn.created_at || new Date().toISOString();
                
                return (
                  <div key={txn.transaction_id || txn.transactionid || index} className="transaction-item">
                    <div className="transaction-icon">
                      {isCredit ? (
                        <MdTrendingUp size={24} style={{ color: '#10b981' }} />
                      ) : (
                        <MdTrendingDown size={24} style={{ color: '#ef4444' }} />
                      )}
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-type">
                        {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
                      </p>
                      <p className="transaction-description">{description}</p>
                      <p className="transaction-date">{formatDate(transactionDate)}</p>
                    </div>
                    <div className={`transaction-amount ${isCredit ? 'credit' : 'debit'}`}>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: 700,
                        color: isCredit ? '#10b981' : '#ef4444'
                      }}>
                        {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No transactions yet</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isRechargeModalOpen}
        onClose={() => !processing && setIsRechargeModalOpen(false)}
        title="Recharge Wallet"
      >
        <div className="recharge-modal-content">
          <div style={{ 
            background: '#eff6ff', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #3b82f6'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
              💳 <strong>Razorpay Test Mode</strong>
              <br />
              <strong>Card:</strong> 4111 1111 1111 1111 | <strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date
              <br />
              <strong>UPI:</strong> success@razorpay
            </p>
          </div>

          <div className="form-group">
            <label>Enter Amount (₹)</label>
            <input
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              placeholder="Enter amount"
              min="10"
              max="10000"
              step="10"
              disabled={processing}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px'
              }}
            />
            <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '8px' }}>
              Min: ₹10 | Max: ₹10,000
            </small>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Preferred Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={processing}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="upi">UPI (Google Pay, PhonePe, Paytm)</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet (Paytm, PhonePe)</option>
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Quick Select
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt.toString())}
                  disabled={processing}
                  style={{
                    padding: '10px',
                    border: rechargeAmount === amt.toString() ? '2px solid #6366f1' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    background: rechargeAmount === amt.toString() ? '#eef2ff' : 'white',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleRazorpayRecharge}
              disabled={processing || !rechargeAmount}
              style={{
                flex: 1,
                padding: '14px 24px',
                backgroundColor: processing || !rechargeAmount ? '#9ca3af' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '16px',
                cursor: processing || !rechargeAmount ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {processing ? (
                <>Processing...</>
              ) : (
                <>
                  <MdCreditCard size={20} />
                  Pay {rechargeAmount ? formatCurrency(parseFloat(rechargeAmount)) : '₹0'}
                </>
              )}
            </button>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              🔒 Secure payment powered by Razorpay
            </small>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;










































































// import React, { useState, useEffect } from 'react';
// import { walletApi } from '../../api/walletApi';
// import { useAuth } from '../../hooks/useAuth';
// import { toast } from 'react-toastify';
// import { 
//   MdAccountBalanceWallet, 
//   MdAdd, 
//   MdCreditCard 
// } from 'react-icons/md';
// import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';
// import Card from '../Common/Card';
// import Modal from '../Common/Modal';
// import Loader from '../Common/Loader';
// import '../../styles/wallet.css';

// const Wallet = () => {
//   const { user } = useAuth();
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
//   const [rechargeAmount, setRechargeAmount] = useState('');
//   const [processing, setProcessing] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('upi');

//   const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

//   useEffect(() => {
//     fetchWalletData();
    
//     if (!RAZORPAY_KEY_ID) {
//       console.error('❌ VITE_RAZORPAY_KEY_ID not found in environment variables');
//     } else {
//       console.log('✅ Razorpay Key loaded:', RAZORPAY_KEY_ID);
//     }
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       setLoading(true);
//       const [walletData, transactionData] = await Promise.all([
//         walletApi.getDetails(),
//         walletApi.getTransactionHistory()
//       ]);

//       if (walletData.success) {
//         setWallet(walletData.wallet);
//       }

//       if (transactionData.success) {
//         setTransactions(transactionData.transactions || []);
//       }
//     } catch (error) {
//       console.error('Failed to fetch wallet data:', error);
//       toast.error('Failed to load wallet data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRazorpayRecharge = async () => {
//     const amount = parseFloat(rechargeAmount);

//     if (!amount || amount <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }

//     if (amount < 10) {
//       toast.error('Minimum recharge amount is ₹10');
//       return;
//     }

//     if (amount > 10000) {
//       toast.error('Maximum recharge amount is ₹10,000');
//       return;
//     }

//     if (!RAZORPAY_KEY_ID) {
//       toast.error('Payment gateway not configured. Please contact support.');
//       console.error('Razorpay Key ID not found in environment variables');
//       return;
//     }

//     if (!window.Razorpay) {
//       toast.error('Payment gateway not loaded. Please refresh the page.');
//       console.error('Razorpay script not loaded');
//       return;
//     }

//     setProcessing(true);

//     try {
//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: amount * 100,
//         currency: 'INR',
//         name: 'Gait-Pass',
//         description: 'Wallet Recharge',
//         // ✅ REMOVED: image property to fix CORS error
//         // image: '/logo.png', 
        
//         handler: async function (response) {
//           console.log('✅ Payment Success:', response);
//           console.log('Payment ID:', response.razorpay_payment_id);
          
//           try {
//             const result = await walletApi.rechargeWallet(amount);
            
//             if (result.success) {
//               toast.success(`✅ Wallet recharged! Added ${formatCurrency(amount)}`, {
//                 autoClose: 4000
//               });
//               setIsRechargeModalOpen(false);
//               setRechargeAmount('');
//               setProcessing(false);
//               fetchWalletData();
//             } else {
//               toast.error(result.message || 'Recharge failed');
//               setProcessing(false);
//             }
//           } catch (error) {
//             console.error('Backend recharge confirmation failed:', error);
//             toast.error(getErrorMessage(error));
//             setProcessing(false);
//           }
//         },

//         prefill: {
//           name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User',
//           email: user?.email || '',
//           contact: user?.phone || ''
//         },

//         notes: {
//           wallet_id: wallet?.wallet_number || '',
//           user_email: user?.email || '',
//           user_id: user?.id || '',
//           recharge_type: 'wallet',
//           payment_method: paymentMethod
//         },

//         theme: {
//           color: '#6366f1',
//           backdrop_color: 'rgba(0, 0, 0, 0.5)'
//         },

//         modal: {
//           ondismiss: function() {
//             console.log('⚠️ Payment cancelled by user');
//             toast.warning('Payment cancelled');
//             setProcessing(false);
//           },
//           escape: true,
//           confirm_close: true,
//           animation: true,
//           backdropclose: false
//         }
//       };

//       console.log('🚀 Opening Razorpay with configuration');

//       const rzp = new window.Razorpay(options);
      
//       rzp.on('payment.failed', function (response) {
//         console.error('❌ Payment Failed:', response.error);
//         toast.error(`Payment failed: ${response.error.description}`, {
//           autoClose: 5000
//         });
//         setProcessing(false);
//       });

//       rzp.open();

//     } catch (error) {
//       console.error('❌ Razorpay initialization failed:', error);
//       toast.error('Failed to open payment gateway');
//       setProcessing(false);
//     }
//   };

//   const handleActivateWallet = async () => {
//     try {
//       const result = await walletApi.activateWallet();
//       if (result.success) {
//         toast.success('Wallet activated successfully!');
//         fetchWalletData();
//       }
//     } catch (error) {
//       toast.error(getErrorMessage(error));
//     }
//   };

//   if (loading) {
//     return <Loader message="Loading wallet..." />;
//   }

//   if (!wallet) {
//     return (
//       <div className="wallet-container">
//         <Card title="Wallet" className="wallet-inactive-card">
//           <p>Your wallet is not active yet.</p>
//           <button onClick={handleActivateWallet} className="activate-wallet-btn">
//             Activate Wallet
//           </button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="wallet-container">
//       <div className="page-header">
//         <h1>My Wallet</h1>
//         <button 
//           onClick={() => setIsRechargeModalOpen(true)} 
//           className="recharge-btn"
//         >
//           <MdAdd /> Recharge Wallet
//         </button>
//       </div>

//       <Card className="wallet-balance-card">
//         <div className="wallet-balance-content">
//           <div className="balance-icon">
//             <MdAccountBalanceWallet size={48} />
//           </div>
//           <div className="balance-info">
//             <p className="balance-label">Available Balance</p>
//             <h2 className="balance-amount">{formatCurrency(wallet.balance || 0)}</h2>
//             <p className="wallet-number">Wallet: {wallet.wallet_number || 'N/A'}</p>
//           </div>
//         </div>
//       </Card>

//       <Card title="Transaction History" className="transaction-history-card">
//         <div className="transactions-container">
//           {transactions.length > 0 ? (
//             <div className="transactions-list">
//               {transactions.map((txn, index) => (
//                 <div key={index} className="transaction-item">
//                   <div className="transaction-icon">
//                     {txn.type === 'credit' ? (
//                       <MdAdd style={{ color: '#10b981' }} />
//                     ) : (
//                       <MdCreditCard style={{ color: '#ef4444' }} />
//                     )}
//                   </div>
//                   <div className="transaction-details">
//                     <p className="transaction-description">{txn.description}</p>
//                     <p className="transaction-date">{formatDate(txn.timestamp)}</p>
//                   </div>
//                   <div className={`transaction-amount ${txn.type}`}>
//                     {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="no-data">No transactions yet</p>
//           )}
//         </div>
//       </Card>

//       <Modal
//         isOpen={isRechargeModalOpen}
//         onClose={() => !processing && setIsRechargeModalOpen(false)}
//         title="Recharge Wallet"
//       >
//         <div className="recharge-modal-content">
//           <div style={{ 
//             background: '#eff6ff', 
//             padding: '12px', 
//             borderRadius: '8px', 
//             marginBottom: '20px',
//             border: '1px solid #3b82f6'
//           }}>
//             <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
//               💳 <strong>Razorpay Test Mode</strong>
//               <br />
//               <strong>Card:</strong> 4111 1111 1111 1111 | <strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date
//               <br />
//               <strong>UPI:</strong> success@razorpay
//             </p>
//           </div>

//           <div className="form-group">
//             <label>Enter Amount (₹)</label>
//             <input
//               type="number"
//               value={rechargeAmount}
//               onChange={(e) => setRechargeAmount(e.target.value)}
//               placeholder="Enter amount"
//               min="10"
//               max="10000"
//               step="10"
//               disabled={processing}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 fontSize: '16px',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '8px',
//                 outline: 'none'
//               }}
//             />
//             <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '8px' }}>
//               Min: ₹10 | Max: ₹10,000
//             </small>
//           </div>

//           <div className="form-group" style={{ marginTop: '16px' }}>
//             <label>Preferred Payment Method</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               disabled={processing}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 fontSize: '16px',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '8px',
//                 outline: 'none',
//                 cursor: processing ? 'not-allowed' : 'pointer'
//               }}
//             >
//               <option value="upi">UPI (Google Pay, PhonePe, Paytm)</option>
//               <option value="card">Credit/Debit Card</option>
//               <option value="netbanking">Net Banking</option>
//               <option value="wallet">Wallet (Paytm, PhonePe)</option>
//             </select>
//           </div>

//           <div style={{ marginTop: '20px' }}>
//             <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
//               Quick Select
//             </label>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
//               {[50, 100, 200, 500].map((amt) => (
//                 <button
//                   key={amt}
//                   onClick={() => setRechargeAmount(amt.toString())}
//                   disabled={processing}
//                   style={{
//                     padding: '10px',
//                     border: rechargeAmount === amt.toString() ? '2px solid #6366f1' : '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     background: rechargeAmount === amt.toString() ? '#eef2ff' : 'white',
//                     cursor: processing ? 'not-allowed' : 'pointer',
//                     fontSize: '14px',
//                     fontWeight: 600,
//                     color: rechargeAmount === amt.toString() ? '#6366f1' : '#374151'
//                   }}
//                 >
//                   ₹{amt}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//             <button
//               onClick={handleRazorpayRecharge}
//               disabled={processing || !rechargeAmount}
//               style={{
//                 flex: 1,
//                 padding: '14px 24px',
//                 backgroundColor: processing || !rechargeAmount ? '#9ca3af' : '#6366f1',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '8px',
//                 fontWeight: 700,
//                 fontSize: '16px',
//                 cursor: processing || !rechargeAmount ? 'not-allowed' : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px',
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               {processing ? (
//                 <>
//                   <div style={{
//                     width: '16px',
//                     height: '16px',
//                     border: '2px solid white',
//                     borderTopColor: 'transparent',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite'
//                   }} />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <MdCreditCard size={20} />
//                   Pay {rechargeAmount ? formatCurrency(parseFloat(rechargeAmount)) : '₹0'}
//                 </>
//               )}
//             </button>
//           </div>

//           <div style={{ marginTop: '16px', textAlign: 'center' }}>
//             <small style={{ color: '#6b7280', fontSize: '12px' }}>
//               🔒 Secure payment powered by Razorpay
//             </small>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Wallet;
