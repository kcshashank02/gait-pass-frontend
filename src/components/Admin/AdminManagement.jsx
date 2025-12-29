import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-toastify'; 
import { MdAdd } from 'react-icons/md';
import { validateEmail, validatePassword } from '../../utils/validators';
import { getErrorMessage, formatDate } from '../../utils/helpers';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import '../../styles/admin.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '', 
    last_name: ''    
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllAdmins();
      
      if (data.admins && Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else if (Array.isArray(data)) {
        setAdmins(data);
      } else {
        console.error('Unexpected response format:', data);
        setAdmins([]);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to fetch admins');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function to get full name
  const getFullName = (admin) => {
    const firstName = admin.first_name || admin.firstname || '';
    const lastName = admin.last_name || admin.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'N/A';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.first_name.trim()) {
      toast.error('First name is required');
      return;
    }

    if (!formData.last_name.trim()) {
      toast.error('Last name is required');
      return;
    }

    try {
      // ✅ Updated payload structure
      await adminApi.createAdmin({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: '0000000000',  // Default phone
        date_of_birth: '2000-01-01'  // Default DOB
      });
      
      toast.success('Admin created successfully');
      setIsModalOpen(false);
      setFormData({ email: '', password: '', first_name: '', last_name: '' });
      fetchAdmins();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <Loader message="Loading admins..." />;
  }

  return (
    <div className="admin-management-container">
      <div className="page-header">
        <h1>Admin Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          <MdAdd /> Add Admin
        </button>
      </div>

      <Card>
        <div className="table-container">
          {admins.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id || admin._id}>
                    <td>{admin.email}</td>
                    <td>{getFullName(admin)}</td>  {/* ✅ Fixed */}
                    <td>{formatDate(admin.created_at || admin.createdat)}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No admins found</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Admin"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>First Name</label>  {/* ✅ Changed */}
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>  {/* ✅ Added */}
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Create Admin
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
