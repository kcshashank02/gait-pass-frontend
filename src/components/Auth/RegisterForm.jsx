import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';
import { getErrorMessage } from '../../utils/helpers';
import '../../styles/auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      toast.error('First name must be at least 2 characters');
      return;
    }

    // ✅ REMOVED: Strict last name validation
    // Last name is now optional or can be 1+ characters
    if (formData.lastName && formData.lastName.trim().length < 1) {
      toast.error('Last name must be at least 1 character if provided');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // ✅ Use first name as last name if last name is empty
      const registrationData = {
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim() || formData.firstName.trim(), // ✅ Fallback to first name
        phone: formData.phone.trim(),
        date_of_birth: '2000-01-01'
      };

      console.log('Registering user:', registrationData);
      
      await register(registrationData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach(err => {
            toast.error(`${err.loc?.join('.')}: ${err.msg}`);
          });
        } else {
          toast.error(error.response.data.detail);
        }
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>
        
        <div className="form-group">
          <label htmlFor="firstName">
            <MdPerson /> First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
            minLength={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <MdPerson /> Last Name (Optional)
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name (optional)"
            minLength={1}
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            You can leave this blank or enter a single character
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <MdEmail /> Email *
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
          <label htmlFor="phone">
            <MdPhone /> Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            required
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            Example: 9876543210 (no spaces or dashes)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <MdLock /> Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min 6 characters)"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <MdLock /> Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;

















































































// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { toast } from 'react-toastify';
// import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
// import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';
// import { getErrorMessage } from '../../utils/helpers';
// import '../../styles/auth.css';

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     full_name: '',
//     phone: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(formData.email)) {
//       toast.error('Please enter a valid email');
//       return;
//     }

//     if (!validatePassword(formData.password)) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     if (!validatePhone(formData.phone)) {
//       toast.error('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setLoading(true);
//     try {
//       const { confirmPassword, ...registrationData } = formData;
//       await register(registrationData);
//       toast.success('Registration successful! Please login.');
//       navigate('/login');
//     } catch (error) {
//       toast.error(getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-form-container">
//       <form onSubmit={handleSubmit} className="auth-form">
//         <h2>Create Account</h2>
        
//         <div className="form-group">
//           <label htmlFor="full_name">
//             <MdPerson /> Full Name
//           </label>
//           <input
//             type="text"
//             id="full_name"
//             name="full_name"
//             value={formData.full_name}
//             onChange={handleChange}
//             placeholder="Enter your full name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">
//             <MdEmail /> Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="phone">
//             <MdPhone /> Phone
//           </label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="10-digit phone number"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">
//             <MdLock /> Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Create a password"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="confirmPassword">
//             <MdLock /> Confirm Password
//           </label>
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             placeholder="Confirm your password"
//             required
//           />
//         </div>

//         <button type="submit" className="submit-btn" disabled={loading}>
//           {loading ? 'Creating Account...' : 'Register'}
//         </button>

//         <p className="auth-footer">
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;
