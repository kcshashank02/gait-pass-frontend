import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WalletPage from './pages/WalletPage';
import JourneyPage from './pages/JourneyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import UserManagement from './components/Admin/UserManagement';
import StationManagement from './components/Admin/StationManagement';
import FareManagement from './components/Admin/FareManagement';
import AdminManagement from './components/Admin/AdminManagement';
import Sidebar from './components/Layout/Sidebar';

const AdminLayout = ({ children, role = 'admin' }) => (
  <div className="dashboard-layout">
    <Sidebar role={role} />
    <div className="dashboard-main">{children}</div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'admin/login',
        element: (
          <div className="auth-page">
            <LoginForm isAdmin={true} />
          </div>
        )
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'wallet',
        element: (
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'journey',
        element: (
          <ProtectedRoute>
            <JourneyPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/stations',
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <StationManagement />
            </AdminLayout>
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/fares',
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <FareManagement />
            </AdminLayout>
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/admins',
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminManagement />
            </AdminLayout>
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
