import axiosInstance from './axiosConfig';

export const journeyApi = {
  getCurrentJourney: async (userId) => {
    const response = await axiosInstance.get(`/api/automated-journey/current-journey/${userId}`);
    return response.data;
  },

  getJourneyHistory: async (userId) => {
    const response = await axiosInstance.get(`/api/automated-journey/history/${userId}`);
    return response.data;
  },

  // ADMIN ONLY - Station Entry
  processEntry: async (stationCode, formData, recognizedUserId) => {
    // Backend expects: recognized_user_id as query param or form field
    const url = `/api/automated-journey/entry/${stationCode}?recognized_user_id=${recognizedUserId}`;
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ADMIN ONLY - Station Exit
  processExit: async (stationCode, formData, recognizedUserId) => {
    const url = `/api/automated-journey/exit/${stationCode}?recognized_user_id=${recognizedUserId}`;
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ADMIN ONLY - Emergency Exit
  emergencyExit: async (userId) => {
    const response = await axiosInstance.post(`/api/automated-journey/emergency-exit/${userId}`);
    return response.data;
  }
};
