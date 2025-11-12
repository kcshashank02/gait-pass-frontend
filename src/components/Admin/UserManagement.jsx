import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-toastify';
import { MdRefresh, MdDelete } from 'react-icons/md';
import { formatDate, formatCurrency } from '../../utils/helpers';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import Modal from '../Common/Modal';
import '../../styles/admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();
      
      if (data.success && data.users) {
        setUsers(data.users);
      } else if (data.users) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (user) => {
    if (user.fullname && user.fullname !== 'N/A') return user.fullname;
    const firstName = user.first_name || user.firstname || '';
    const lastName = user.last_name || user.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'N/A';
  };

  // ✅ NEW: Handle delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      await adminApi.deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.email} deleted successfully`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <Loader message="Loading users..." />;
  }

  return (
    <div className="user-management-container">
      <div className="page-header">
        <h1>User Management</h1>
        {/* <button onClick={fetchUsers} className="refresh-btn">
          <MdRefresh /> Refresh
        </button> */}
      </div>

      <Card>
        <div className="table-container">
          {users.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Wallet Balance</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Actions</th>  {/* ✅ NEW */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{getFullName(user)}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: (user.wallet_balance || 0) > 0 ? '#10b981' : '#ef4444' 
                      }}>
                        {formatCurrency(user.wallet_balance || 0)}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td className="action-buttons">
                      {/* ✅ NEW: Delete button */}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="delete-btn"
                        title="Delete User"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No users found</p>
          )}
        </div>
      </Card>

      {/* ✅ NEW: Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Confirm User Deletion"
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            Are you sure you want to delete this user? This action will:
          </p>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Delete the user account</li>
            <li>Delete their wallet and transaction history</li>
            <li>Delete their face registration data</li>
            <li>Delete all journey records</li>
          </ul>
          
          {userToDelete && (
            <div style={{ 
              background: '#fee2e2', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '20px',
              border: '1px solid #ef4444'
            }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#991b1b' }}>
                User: {userToDelete.email}
              </p>
            </div>
          )}

          <p style={{ fontSize: '14px', color: '#991b1b', fontWeight: 600 }}>
            ⚠️ This action cannot be undone!
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                opacity: deleting ? 0.6 : 1
              }}
            >
              {deleting ? 'Deleting...' : 'Yes, Delete User'}
            </button>
            <button
              onClick={handleDeleteCancel}
              disabled={deleting}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
        <p>Total Users: {users.length}</p>
      </div>
    </div>
  );
};

export default UserManagement;















// import React, { useState, useEffect } from 'react';
// import { adminApi } from '../../api/adminApi';
// import { toast } from 'react-toastify';
// import { MdRefresh } from 'react-icons/md';
// import { formatDate, formatCurrency } from '../../utils/helpers';
// import Card from '../Common/Card';
// import Loader from '../Common/Loader';
// import '../../styles/admin.css';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await adminApi.getAllUsers();
      
//       // Handle different response structures
//       if (data.success && data.users) {
//         setUsers(data.users);
//       } else if (data.users) {
//         setUsers(data.users);
//       } else if (Array.isArray(data)) {
//         setUsers(data);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//       toast.error('Failed to fetch users');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFullName = (user) => {
//     if (user.fullname && user.fullname !== 'N/A') {
//       return user.fullname;
//     }
    
//     const firstName = user.firstname || user.first_name || '';
//     const lastName = user.lastname || user.last_name || '';
//     const fullName = `${firstName} ${lastName}`.trim();
    
//     return fullName || 'N/A';
//   };

//   if (loading) {
//     return <Loader message="Loading users..." />;
//   }

//   return (
//     <div className="user-management-container">
//       <div className="page-header">
//         <h1>User Management</h1>
//         {/* <button onClick={fetchUsers} className="refresh-btn">
//           <MdRefresh /> Refresh
//         </button> */}
//       </div>
      
//       <Card>
//         <div className="table-container">
//           {users.length === 0 ? (
//             <p className="no-data">No users found</p>
//           ) : (
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Email</th>
//                   <th>Full Name</th>
//                   <th>Phone</th>
//                   <th>Wallet Balance</th>
//                   <th>Created At</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.email}</td>
//                     <td>{getFullName(user)}</td>
//                     <td>{user.phone || 'N/A'}</td>
//                     <td>
//                       <span style={{ 
//                         fontWeight: '700', 
//                         color: user.wallet_balance > 0 ? '#10b981' : '#ef4444' 
//                       }}>
//                         {formatCurrency(user.wallet_balance || 0)}
//                       </span>
//                     </td>
//                     <td>{formatDate(user.createdat)}</td>
//                     <td>
//                       <span className="status-badge active">Active</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>
      
//       <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
//         <p>Total Users: {users.length}</p>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;








// // import React, { useState, useEffect } from 'react';
// // import { adminApi } from '../../api/adminApi';
// // import { toast } from 'react-toastify'; 
// // import { formatDate } from '../../utils/helpers';
// // import Card from '../Common/Card';
// // import Loader from '../Common/Loader';
// // import '../../styles/admin.css';

// // const UserManagement = () => {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);

// //   const fetchUsers = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await adminApi.getAllUsers();
      
// //       // ✅ FIX: Extract the users array from the response
// //       if (data.users && Array.isArray(data.users)) {
// //         setUsers(data.users);
// //       } else if (Array.isArray(data)) {
// //         setUsers(data);
// //       } else {
// //         console.error('Unexpected response format:', data);
// //         setUsers([]);
// //         toast.error('Unexpected response format from server');
// //       }
// //     } catch (error) {
// //       console.error('Failed to fetch users:', error);
// //       toast.error('Failed to fetch users');
// //       setUsers([]); // ✅ Set empty array on error
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return <Loader message="Loading users..." />;
// //   }

// //   return (
// //     <div className="user-management-container">
// //       <h1>User Management</h1>

// //       <Card>
// //         <div className="table-container">
// //           {users.length > 0 ? (
// //             <table className="data-table">
// //               <thead>
// //                 <tr>
// //                   <th>Email</th>
// //                   <th>Full Name</th>
// //                   <th>Phone</th>
// //                   <th>Wallet Balance</th>
// //                   <th>Created At</th>
// //                   <th>Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {users.map((user) => (
// //                   <tr key={user.id || user._id}>
// //                     <td>{user.email}</td>
// //                     <td>
// //                       {user.fullname || 
// //                        (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname) || 
// //                        'N/A'}
// //                     </td>
// //                     <td>{user.phone || 'N/A'}</td>
// //                     <td>₹{user.walletbalance?.toFixed(2) || user.wallet_balance?.toFixed(2) || '0.00'}</td>
// //                     <td>{formatDate(user.createdat || user.created_at)}</td>
// //                     <td>
// //                       <span className="status-badge active">
// //                         {user.isactive !== false ? 'Active' : 'Inactive'}
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p className="no-data">No users found</p>
// //           )}
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default UserManagement;
