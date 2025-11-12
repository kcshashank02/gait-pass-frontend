import React, { useState, useEffect } from 'react';
import { stationApi } from '../../api/stationApi';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import '../../styles/admin.css';

const StationManagement = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    city: ''
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await stationApi.getAllStations();
      
      if (data.success && data.stations && Array.isArray(data.stations)) {
        setStations(data.stations);
      } else if (data.stations && Array.isArray(data.stations)) {
        setStations(data.stations);
      } else if (Array.isArray(data)) {
        setStations(data);
      } else {
        console.error('Unexpected response format:', data);
        setStations([]);
        toast.error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      toast.error('Failed to fetch stations');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStation) {
        // Update existing station
        await stationApi.updateStation(editingStation._id, {
          station_name: formData.name,
          city: formData.city
        });
        toast.success('Station updated successfully');
      } else {
        // Create new station
        await stationApi.createStation({
          station_code: formData.code,
          station_name: formData.name,
          city: formData.city
        });
        toast.success('Station created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchStations();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      code: station.station_code || '',
      name: station.station_name || '',
      city: station.city || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (stationId) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return;

    try {
      await stationApi.deleteStation(stationId);
      toast.success('Station deleted successfully');
      fetchStations();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const resetForm = () => {
    setFormData({ code: '', name: '', city: '' });
    setEditingStation(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading) {
    return <Loader message="Loading stations..." />;
  }

  return (
    <div className="station-management-container">
      <div className="page-header">
        <h1>Station Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          <MdAdd /> Add Station
        </button>
      </div>

      <Card>
        <div className="table-container">
          {stations.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, index) => (
                  <tr key={station._id || index}>
                    <td>{station.station_code}</td>
                    <td>{station.station_name}</td>
                    <td>{station.city}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleEdit(station)}
                        className="edit-btn"
                        title="Edit Station"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(station._id)}
                        className="delete-btn"
                        title="Delete Station"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No stations found. Add your first station!</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingStation ? 'Edit Station' : 'Add New Station'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Station Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., MUM"
              disabled={editingStation !== null}
              required
              minLength={3}
              maxLength={10}
            />
            {editingStation && (
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Station code cannot be changed
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Station Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mumbai Central"
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Mumbai"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {editingStation ? 'Update Station' : 'Create Station'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StationManagement;
