import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdAccountBalanceWallet, 
  MdTrain, 
  MdPerson,
  MdPeople, 
  MdLocationOn, 
  MdAttachMoney,
  MdAdminPanelSettings,
  MdExitToApp
} from 'react-icons/md';
import '../../styles/sidebar.css';

const Sidebar = ({ role }) => {
  const userLinks = [
    { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { path: '/wallet', icon: <MdAccountBalanceWallet />, label: 'Wallet' },
    { path: '/journey', icon: <MdTrain />, label: 'Journey' },
    { path: '/profile', icon: <MdPerson />, label: 'Profile' },  // ✅ NEW
  ];

  const adminLinks = [
    { path: '/admin', icon: <MdDashboard />, label: 'Dashboard' },
    { path: '/admin/station-ops', icon: <MdExitToApp />, label: 'Station Operations' },
    { path: '/admin/users', icon: <MdPeople />, label: 'Users' },
    { path: '/admin/stations', icon: <MdLocationOn />, label: 'Stations' },
    { path: '/admin/fares', icon: <MdAttachMoney />, label: 'Fares' },
    { path: '/admin/admins', icon: <MdAdminPanelSettings />, label: 'Admins' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { MdDashboard, MdPeople, MdTrain, MdAttachMoney, MdAdminPanelSettings, MdSensors } from 'react-icons/md';
// import '../../styles/sidebar.css';

// const Sidebar = ({ role }) => {
//   const userLinks = [
//     { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
//     { path: '/wallet', icon: <MdAttachMoney />, label: 'Wallet' },
//     { path: '/journey', icon: <MdTrain />, label: 'Journey History' }
//   ];

//   const adminLinks = [
//     { path: '/admin', icon: <MdDashboard />, label: 'Dashboard' },
//     { path: '/admin/station-ops', icon: <MdSensors />, label: 'Station Operations' },  // NEW
//     { path: '/admin/users', icon: <MdPeople />, label: 'Users' },
//     { path: '/admin/stations', icon: <MdTrain />, label: 'Stations' },
//     { path: '/admin/fares', icon: <MdAttachMoney />, label: 'Fares' },
//     { path: '/admin/admins', icon: <MdAdminPanelSettings />, label: 'Admins' }
//   ];

//   const links = role === 'admin' ? adminLinks : userLinks;

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-content">
//         {links.map((link) => (
//           <NavLink
//             key={link.path}
//             to={link.path}
//             className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
//           >
//             <span className="sidebar-icon">{link.icon}</span>
//             <span className="sidebar-label">{link.label}</span>
//           </NavLink>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
