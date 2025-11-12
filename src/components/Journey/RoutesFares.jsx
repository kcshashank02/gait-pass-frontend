import React, { useState, useEffect } from 'react';
import { stationApi } from '../../api/stationApi';
import { toast } from 'react-toastify';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import '../../styles/journey.css';

const RoutesFares = () => {
  const [stations, setStations] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [stationsData, faresData] = await Promise.all([
        stationApi.getAllStations(),
        stationApi.getAllFares()
      ]);

      // Extract stations
      let stationsList = [];
      if (stationsData.success && stationsData.stations) {
        stationsList = stationsData.stations;
      } else if (Array.isArray(stationsData)) {
        stationsList = stationsData;
      }
      setStations(stationsList);

      // Extract fares
      let faresList = [];
      if (faresData.success && faresData.fares) {
        faresList = faresData.fares;
      } else if (Array.isArray(faresData)) {
        faresList = faresData;
      }
      
      setFares(faresList);

      // ✅ Removed toast notification

    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load routes and fares');
    } finally {
      setLoading(false);
    }
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => 
      (s._id && s._id === stationId) || 
      (s.id && s.id === stationId)
    );
    
    if (station) {
      const name = station.name || station.station_name || 'Unknown';
      const code = station.code || station.station_code || '';
      return code ? `${name} (${code})` : name;
    }
    
    return stationId || 'Unknown';
  };

  const getStationCode = (stationId) => {
    const station = stations.find(s => 
      (s._id && s._id === stationId) || 
      (s.id && s.id === stationId)
    );
    return station?.code || station?.station_code || 'N/A';
  };

  if (loading) {
    return (
      <div className="routes-fares-container">
        <Card title="Available Stations" className="stations-card">
          <Loader message="Loading stations..." />
        </Card>
        <Card title="Available Routes & Fares" className="fares-card">
          <Loader message="Loading fares..." />
        </Card>
      </div>
    );
  }

  return (
    <div className="routes-fares-container">
      {/* Stations List */}
      <Card title={`Available Stations (${stations.length})`} className="stations-card">
        {stations.length > 0 ? (
          <div className="stations-list">
            {stations.map((station, index) => (
              <div key={station._id || station.id || index} className="station-item">
                <div className="station-badge">
                  {station.code || station.station_code || 'N/A'}
                </div>
                <div className="station-details">
                  <h4>{station.name || station.station_name || 'Unknown'}</h4>
                  <p>{station.city || 'City not specified'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No stations available. Create stations in admin panel.</p>
        )}
      </Card>

      {/* Fares Table - Simplified without Route column */}
      <Card title={`Available Routes & Fares (${fares.length})`} className="fares-card">
        {fares.length > 0 ? (
          <div className="table-container">
            <table className="fares-table">
              <thead>
                <tr>
                  <th>From Station</th>
                  <th style={{ textAlign: 'center' }}>↔</th>
                  <th>To Station</th>
                  <th>Distance</th>
                  <th>Base Fare</th>
                </tr>
              </thead>
              <tbody>
                {fares.map((fare, index) => {
                  const fromStationId = fare.from_station_id;
                  const toStationId = fare.to_station_id;
                  const fromCode = fare.from_station_code || getStationCode(fromStationId);
                  const toCode = fare.to_station_code || getStationCode(toStationId);
                  const distance = fare.distance_km || 0;
                  const baseFare = fare.base_fare || 0;
                  const isActive = fare.is_active !== false;
                  
                  return (
                    <tr key={fare._id || index} className={!isActive ? 'inactive-route' : ''}>
                      <td className="station-cell-start">
                        <div className="station-info">
                          <span className="station-code-badge">{fromCode}</span>
                          <span className="station-name">{getStationName(fromStationId)}</span>
                        </div>
                      </td>
                      <td className="arrow-cell">
                        <span className="bidirectional-arrow">⇄</span>
                      </td>
                      <td className="station-cell-end">
                        <div className="station-info">
                          <span className="station-code-badge">{toCode}</span>
                          <span className="station-name">{getStationName(toStationId)}</span>
                        </div>
                      </td>
                      <td className="distance-cell">
                        {distance} km
                      </td>
                      <td className="fare-cell">
                        {formatCurrency(baseFare)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No fares configured. Create fares in admin panel.</p>
        )}
      </Card>

      {/* Refresh Button */}
      <button onClick={fetchData} className="refresh-btn">
        🔄 Refresh Data
      </button>
    </div>
  );
};

export default RoutesFares;
