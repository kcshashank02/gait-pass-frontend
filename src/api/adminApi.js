// gait-pass-frontend/src/api/adminApi.js
import axiosInstance from './axiosConfig';

export const adminApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/api/admin/dashboard');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosInstance.get('/api/admin/users');
    return response.data;
  },

  getAllAdmins: async () => {
    const response = await axiosInstance.get('/api/admin/admins');
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await axiosInstance.post('/api/admin/create-admin', adminData);
    return response.data;
  },

  // ✅ NEW: Delete user endpoint
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
    return response.data;
  }
};
