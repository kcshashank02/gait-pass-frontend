import axiosInstance from './axiosConfig';

export const authApi = {
  register: async (userData) => {
    console.log('authApi - Registration payload:', JSON.stringify(userData, null, 2));
    
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      console.log('authApi - Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('authApi - Registration failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  },

  adminLogin: async (credentials) => {
    const response = await axiosInstance.post('/api/auth/admin/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/api/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/api/auth/refresh', {
      refresh_token: refreshToken
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/api/auth/change-password', passwordData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await axiosInstance.delete('/api/auth/delete-account');
    return response.data;
  }
};
