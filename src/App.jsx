import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WalletPage from './pages/WalletPage';
import JourneyPage from './pages/JourneyPage';
import ProfilePage from './pages/ProfilePage';  // ✅ Import ProfilePage
import NotFoundPage from './pages/NotFoundPage';
import StationOperationsPage from './pages/StationOperationsPage';

// Admin Components
import UserManagement from './components/Admin/UserManagement';
import StationManagement from './components/Admin/StationManagement';
import FareManagement from './components/Admin/FareManagement';
import AdminManagement from './components/Admin/AdminManagement';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

const AdminLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar role="admin" />
    <div className="dashboard-main">{children}</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/admin/login" 
              element={
                <div className="auth-page">
                  <LoginForm isAdmin={true} />
                </div>
              } 
            />
            
            {/* User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journey" 
              element={
                <ProtectedRoute>
                  <JourneyPage />
                </ProtectedRoute>
              } 
            />
            {/* ✅ NEW: Profile Route */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/station-ops" 
              element={
                <ProtectedRoute adminOnly>
                  <StationOperationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stations" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <StationManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/fares" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <FareManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/admins" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;









// import { Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import Navbar from './components/Layout/Navbar';
// import Footer from './components/Layout/Footer';
// import ProtectedRoute from './components/Auth/ProtectedRoute';

// // Pages
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import UserDashboardPage from './pages/UserDashboardPage';
// import AdminDashboardPage from './pages/AdminDashboardPage';
// import WalletPage from './pages/WalletPage';
// import JourneyPage from './pages/JourneyPage';
// import NotFoundPage from './pages/NotFoundPage';

// // Admin Components
// import UserManagement from './components/Admin/UserManagement';
// import StationManagement from './components/Admin/StationManagement';
// import FareManagement from './components/Admin/FareManagement';
// import AdminManagement from './components/Admin/AdminManagement';
// import LoginForm from './components/Auth/LoginForm';
// import Sidebar from './components/Layout/Sidebar';
// import StationOperationsPage from './pages/StationOperationsPage';

// import 'react-toastify/dist/ReactToastify.css';
// import './styles/global.css';

// const AdminLayout = ({ children }) => (
//   <div className="dashboard-layout">
//     <Sidebar role="admin" />
//     <div className="dashboard-main">{children}</div>
//   </div>
// );

// function App() {
//   return (
//     <AuthProvider>
//       <div className="app">
//         <Navbar />
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route 
//               path="/admin/station-ops" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <StationOperationsPage />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/admin/login" 
//               element={
//                 <div className="auth-page">
//                   <LoginForm isAdmin={true} />
//                 </div>
//               } 
//             />
            
//             {/* User Routes */}
//             <Route 
//               path="/dashboard" 
//               element={
//                 <ProtectedRoute>
//                   <UserDashboardPage />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/wallet" 
//               element={
//                 <ProtectedRoute>
//                   <WalletPage />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/journey" 
//               element={
//                 <ProtectedRoute>
//                   <JourneyPage />
//                 </ProtectedRoute>
//               } 
//             />
            
//             {/* Admin Routes */}
//             <Route 
//               path="/admin" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminDashboardPage />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/admin/users" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminLayout>
//                     <UserManagement />
//                   </AdminLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/admin/stations" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminLayout>
//                     <StationManagement />
//                   </AdminLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/admin/fares" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminLayout>
//                     <FareManagement />
//                   </AdminLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/admin/admins" 
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminLayout>
//                     <AdminManagement />
//                   </AdminLayout>
//                 </ProtectedRoute>
//               } 
//             />
            
//             <Route path="*" element={<NotFoundPage />} />
//           </Routes>
//         </main>
//         <Footer />
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;
