import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MdPerson, MdLogout, MdWallet, MdDashboard } from 'react-icons/md';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user?.fullName && user.fullName !== 'undefined undefined') {
      return user.fullName;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Gait-Pass</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">
                <MdDashboard /> Dashboard
              </Link>

              {user?.role !== 'admin' && (
                <Link to="/wallet" className="nav-link">
                  <MdWallet /> Wallet
                </Link>
              )}

              {/* ✅ New: Profile Link for non-admin users */}
              {user?.role !== 'admin' && (
                <Link to="/profile" className="nav-link">
                  <MdPerson /> Profile
                </Link>
              )}

              <div className="navbar-user">
                <MdPerson />
                <span>{getDisplayName()}</span>
              </div>

              <div>
                <button onClick={handleLogout} className="logout-btn">
                  <MdLogout /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

















// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { MdPerson, MdLogout, MdWallet, MdDashboard } from 'react-icons/md';
// import '../../styles/navbar.css';

// const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
//   // ✅ Get display name with proper fallbacks
//   const getDisplayName = () => {
//     if (user?.fullName && user.fullName !== 'undefined undefined') {
//       return user.fullName;
//     }
//     if (user?.firstName && user?.lastName) {
//       return `${user.firstName} ${user.lastName}`.trim();
//     }
//     if (user?.firstName) {
//       return user.firstName;
//     }
//     if (user?.email) {
//       return user.email.split('@')[0];
//     }
//     return 'User';
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-text">Gait-Pass</span>
//         </Link>

//         <div className="navbar-menu">
//           {isAuthenticated ? (
//             <>
//               <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">
//                 <MdDashboard /> Dashboard
//               </Link>
//               {user?.role !== 'admin' && (
//                 <Link to="/wallet" className="nav-link">
//                   <MdWallet /> Wallet
//                 </Link>
//               )}
//               <div className="navbar-user">
//                 <MdPerson />
//                 <span>{getDisplayName()}</span>
//               </div>
//               <div>
//                 <button onClick={handleLogout} className="logout-btn">
//                   <MdLogout /> Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="nav-link">Login</Link>
//               <Link to="/register" className="nav-link nav-link-primary">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
