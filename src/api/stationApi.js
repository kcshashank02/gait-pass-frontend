import axiosInstance from './axiosConfig';

export const stationApi = {
  getAllStations: async () => {
    const response = await axiosInstance.get('/api/stations/');
    return response.data;
  },

  createStation: async (stationData) => {
    const response = await axiosInstance.post('/api/stations/', stationData);
    return response.data;
  },

  updateStation: async (stationId, stationData) => {
    const response = await axiosInstance.put(`/api/stations/${stationId}`, stationData);
    return response.data;
  },

  deleteStation: async (stationId) => {
    const response = await axiosInstance.delete(`/api/stations/${stationId}`);
    return response.data;
  },

  // ✅ FIXED: Use station codes, not IDs
  calculateFare: async (fromStationCode, toStationCode) => {
    const response = await axiosInstance.get('/api/stations/fares/calculate', {
      params: { 
        fromstation: fromStationCode,  // ✅ Use code, not ID
        tostation: toStationCode        // ✅ Use code, not ID
      }
    });
    return response.data;
  },

  getAllFares: async () => {
    const response = await axiosInstance.get('/api/stations/get-fares');
    return response.data;
  },

  createFare: async (fareData) => {
    const response = await axiosInstance.post('/api/stations/fares', fareData);
    return response.data;
  },

  updateFare: async (fareId, fareData) => {
    const response = await axiosInstance.put(`/api/stations/fares/${fareId}`, fareData);
    return response.data;
  },

  deleteFare: async (fareId) => {
    const response = await axiosInstance.delete(`/api/stations/fares/${fareId}`);
    return response.data;
  }
};
