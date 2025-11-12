import React, { useState, useEffect } from 'react';
import { stationApi } from '../../api/stationApi';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit } from 'react-icons/md';
import { getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import '../../styles/admin.css';

const FareManagement = () => {
  const [fares, setFares] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFare, setEditingFare] = useState(null);
  const [formData, setFormData] = useState({
    fromStationCode: '',
    toStationCode: '',
    distanceKm: '',
    baseFare: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faresData, stationsData] = await Promise.all([
        stationApi.getAllFares(),
        stationApi.getAllStations()
      ]);

      // Extract fares array from response
      if (faresData.success && faresData.fares && Array.isArray(faresData.fares)) {
        setFares(faresData.fares);
      } else if (faresData.fares && Array.isArray(faresData.fares)) {
        setFares(faresData.fares);
      } else if (Array.isArray(faresData)) {
        setFares(faresData);
      } else {
        console.error('Unexpected fares response format:', faresData);
        setFares([]);
      }

      // Extract stations array from response
      if (stationsData.success && stationsData.stations && Array.isArray(stationsData.stations)) {
        setStations(stationsData.stations);
      } else if (stationsData.stations && Array.isArray(stationsData.stations)) {
        setStations(stationsData.stations);
      } else if (Array.isArray(stationsData)) {
        setStations(stationsData);
      } else {
        console.error('Unexpected stations response format:', stationsData);
        setStations([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch fares and stations');
      setFares([]);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fromStationCode === formData.toStationCode) {
      toast.error('From and To stations must be different');
      return;
    }

    try {
      await stationApi.createFare({
        from_station_code: formData.fromStationCode,
        to_station_code: formData.toStationCode,
        distance_km: parseInt(formData.distanceKm),
        base_fare: parseFloat(formData.baseFare)
      });
      
      toast.success(editingFare ? 'Fare updated successfully' : 'Fare created successfully');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEdit = (fare) => {
    setEditingFare(fare);
    setFormData({
      fromStationCode: fare.from_station_code || fare.fromstationcode,
      toStationCode: fare.to_station_code || fare.tostationcode,
      distanceKm: (fare.distance_km || fare.distancekm).toString(),
      baseFare: (fare.base_fare || fare.basefare).toString()
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fromStationCode: '',
      toStationCode: '',
      distanceKm: '',
      baseFare: ''
    });
    setEditingFare(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const getStationDisplay = (stationCode) => {
    const station = stations.find((s) => s.station_code === stationCode);
    return station ? `${station.station_name} (${station.station_code})` : stationCode;
  };

  if (loading) {
    return <Loader message="Loading fares..." />;
  }

  return (
    <div className="fare-management-container">
      <div className="page-header">
        <h1>Fare Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          <MdAdd /> Add Fare
        </button>
      </div>

      <Card>
        <div className="info-banner" style={{ 
          background: '#eff6ff', 
          border: '1px solid #3b82f6', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          marginBottom: '20px',
          color: '#1e40af'
        }}>
          <strong>ℹ️ Note:</strong> Fares are bidirectional. A fare from Station A to Station B automatically applies for Station B to Station A.
        </div>

        <div className="table-container">
          {fares.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>From Station</th>
                  <th>To Station</th>
                  <th>Distance (km)</th>
                  <th>Base Fare</th>
                  <th>Service Charge</th>
                  <th>Total Fare</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fares.map((fare, index) => {
                  const baseFare = fare.base_fare || fare.basefare || 0;
                  const serviceCharge = 5.0;
                  const totalFare = baseFare + serviceCharge;

                  return (
                    <tr key={fare._id || index}>
                      <td>{getStationDisplay(fare.from_station_code || fare.fromstationcode)}</td>
                      <td>{getStationDisplay(fare.to_station_code || fare.tostationcode)}</td>
                      <td>{fare.distance_km || fare.distancekm} km</td>
                      <td>₹{baseFare.toFixed(2)}</td>
                      <td>₹{serviceCharge.toFixed(2)}</td>
                      <td className="total-fare">₹{totalFare.toFixed(2)}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleEdit(fare)}
                          className="edit-btn"
                          title="Edit Fare"
                        >
                          <MdEdit />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No fares configured. Add your first fare!</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingFare ? 'Edit Fare' : 'Add New Fare'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>From Station</label>
            <select
              value={formData.fromStationCode}
              onChange={(e) => setFormData({ ...formData, fromStationCode: e.target.value })}
              disabled={editingFare !== null}
              required
            >
              <option value="">Select station</option>
              {stations.map((station) => (
                <option key={station._id} value={station.station_code}>
                  {station.station_name} ({station.station_code})
                </option>
              ))}
            </select>
            {editingFare && (
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Station route cannot be changed when editing
              </small>
            )}
          </div>

          <div className="form-group">
            <label>To Station</label>
            <select
              value={formData.toStationCode}
              onChange={(e) => setFormData({ ...formData, toStationCode: e.target.value })}
              disabled={editingFare !== null}
              required
            >
              <option value="">Select station</option>
              {stations.map((station) => (
                <option key={station._id} value={station.station_code}>
                  {station.station_name} ({station.station_code})
                </option>
              ))}
            </select>
            {editingFare && (
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Station route cannot be changed when editing
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              value={formData.distanceKm}
              onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
              placeholder="Enter distance in kilometers"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Base Fare (₹)</label>
            <input
              type="number"
              value={formData.baseFare}
              onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
              placeholder="Enter base fare amount"
              min="0"
              step="0.01"
              required
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Service charge of ₹5.00 will be added automatically
            </small>
          </div>

          <button type="submit" className="submit-btn">
            {editingFare ? 'Update Fare' : 'Create Fare'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FareManagement;
