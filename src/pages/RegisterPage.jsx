import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import '../styles/auth.css';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
