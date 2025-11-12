import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import '../../styles/journey.css';

const JourneyHistory = () => {
  const { user } = useAuth();
  const { journeyHistory, loading } = useJourney(user?.id);

  if (loading) {
    return <Loader message="Loading journey history..." />;
  }

  return (
    <div className="journey-history-container">
      <h1>Journey History</h1>

      {journeyHistory && journeyHistory.length > 0 ? (
        <div className="journey-cards">
          {journeyHistory.map((journey, index) => {
            // ✅ Handle multiple field name variations
            const entryStation = journey.entry_station_name || journey.entrystationname || journey.entryStationName || 'Unknown';
            const exitStation = journey.exit_station_name || journey.exitstationname || journey.exitStationName;
            const entryTime = journey.entry_time || journey.entrytime || journey.entryTime;
            const exitTime = journey.exit_time || journey.exittime || journey.exitTime;
            const fareAmount = journey.fare_amount || journey.fareamount || journey.fareAmount;
            
            // ✅ Determine journey status
            const isCompleted = exitStation && exitTime;
            
            return (
              <Card key={index} className="journey-card">
                <div className="journey-header">
                  <span className="journey-number">Journey #{journeyHistory.length - index}</span>
                  <span className={`journey-status ${isCompleted ? 'completed' : 'in-progress'}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="journey-route-display">
                  {/* From Station */}
                  <div className="station-info">
                    <p className="station-label">From</p>
                    <p className="station-value">{entryStation}</p>
                    <p className="time-value">{formatDate(entryTime)}</p>
                  </div>

                  {/* Route Connector */}
                  <div className="route-connector"></div>

                  {/* To Station */}
                  <div className="station-info">
                    <p className="station-label">To</p>
                    <p className="station-value">{exitStation || 'In Transit'}</p>
                    {exitTime && (
                      <p className="time-value">{formatDate(exitTime)}</p>
                    )}
                  </div>
                </div>

                {/* Fare Display (only for completed journeys) */}
                {fareAmount && isCompleted && (
                  <div className="journey-footer">
                    <span className="fare-label">Fare</span>
                    <span className="fare-value">{formatCurrency(fareAmount)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="no-data">No journey history available</p>
        </Card>
      )}
    </div>
  );
};

export default JourneyHistory;
