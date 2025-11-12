import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { MdEmail, MdLock } from 'react-icons/md';
import { validateEmail } from '../../utils/validators';
import { getErrorMessage } from '../../utils/helpers';
import '../../styles/auth.css';

const LoginForm = ({ isAdmin = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);
    try {
      await login(formData, isAdmin);
      toast.success('Login successful!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
        
        <div className="form-group">
          <label htmlFor="email">
            <MdEmail /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <MdLock /> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {!isAdmin && (
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        )}
        
        {!isAdmin && (
          <p className="auth-footer">
            <Link to="/admin/login">Admin Login</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
