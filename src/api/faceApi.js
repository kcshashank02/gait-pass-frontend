import axiosInstance from './axiosConfig';

export const faceApi = {
  registerFace: async (formData) => {
    const response = await axiosInstance.post('/api/face/register-embedding-only', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ FIXED: Correct endpoint path
  testFaceRecognition: async (imageFile) => {
    const formData = new FormData();
    formData.append('frame', imageFile);
    
    const response = await axiosInstance.post('/api/face/test-face-recognition', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user's face embedding (admin only)
  getUserEmbedding: async (userId) => {
    const response = await axiosInstance.get(`/api/face/user/${userId}/embedding`);
    return response.data;
  },

  // Delete user's face embedding (admin only)
  deleteUserEmbedding: async (userId) => {
    const response = await axiosInstance.delete(`/api/face/user/${userId}/embedding`);
    return response.data;
  }
};
