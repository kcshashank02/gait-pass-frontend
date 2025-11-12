import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import '../styles/auth.css';

const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
