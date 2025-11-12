// import { useState, useEffect, useCallback } from 'react';
// import { journeyApi } from '../api/journeyApi';

// export const useJourney = (userId) => {
//   const [currentJourney, setCurrentJourney] = useState(null);
//   const [journeyHistory, setJourneyHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Use useCallback with userId as dependency
//   const fetchJourneyData = useCallback(async () => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const [currentData, historyData] = await Promise.all([
//         journeyApi.getCurrentJourney(userId).catch(() => null),
//         journeyApi.getJourneyHistory(userId).catch(() => [])
//       ]);

//       // Handle current journey
//       if (currentData && currentData.journey && currentData.journey.entry_station_name) {
//         setCurrentJourney(currentData.journey);
//       } else if (currentData && currentData.entry_station_name) {
//         setCurrentJourney(currentData);
//       } else {
//         setCurrentJourney(null);
//       }

//       // Handle journey history
//       if (Array.isArray(historyData)) {
//         setJourneyHistory(historyData);
//       } else if (historyData && historyData.journeys && Array.isArray(historyData.journeys)) {
//         setJourneyHistory(historyData.journeys);
//       } else {
//         setJourneyHistory([]);
//       }

//       setError(null);
//     } catch (err) {
//       console.error('Journey fetch error:', err);
//       setError(err.response?.data?.detail || 'Failed to fetch journey data');
//       setCurrentJourney(null);
//       setJourneyHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]); // ✅ Only re-create when userId changes

//   // ✅ Only run when userId or fetchJourneyData changes
//   useEffect(() => {
//     let isMounted = true;
    
//     const loadJourneys = async () => {
//       if (isMounted) {
//         await fetchJourneyData();
//       }
//     };
    
//     loadJourneys();
    
//     // ✅ Cleanup
//     return () => {
//       isMounted = false;
//     };
//   }, [fetchJourneyData]);

//   return {
//     currentJourney,
//     journeyHistory,
//     loading,
//     error,
//     refresh: fetchJourneyData
//   };
// };




















import { useState, useEffect, useCallback } from 'react';
import { journeyApi } from '../api/journeyApi';

export const useJourney = (userId) => {
  const [currentJourney, setCurrentJourney] = useState(null);
  const [journeyHistory, setJourneyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJourneyData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch both current journey and history in parallel
      const [currentData, historyData] = await Promise.all([
        journeyApi.getCurrentJourney(userId).catch(() => null),
        journeyApi.getJourneyHistory(userId).catch(() => [])
      ]);

      console.log('📊 Current Journey Data:', currentData);
      console.log('📜 Journey History Data:', historyData);

      // ✅ Handle current journey - check multiple response structures
      if (currentData) {
        if (currentData.success && currentData.journey) {
          // Response: { success: true, journey: {...} }
          setCurrentJourney(currentData.journey);
        } else if (currentData.journey) {
          // Response: { journey: {...} }
          setCurrentJourney(currentData.journey);
        } else if (currentData.entry_station_name || currentData.entrystationname) {
          // Response: Direct journey object
          setCurrentJourney(currentData);
        } else {
          // No ongoing journey
          setCurrentJourney(null);
        }
      } else {
        setCurrentJourney(null);
      }

      // ✅ Handle journey history
      if (Array.isArray(historyData)) {
        setJourneyHistory(historyData);
      } else if (historyData?.success && Array.isArray(historyData.journeys)) {
        setJourneyHistory(historyData.journeys);
      } else if (historyData?.journeys && Array.isArray(historyData.journeys)) {
        setJourneyHistory(historyData.journeys);
      } else {
        setJourneyHistory([]);
      }

      setError(null);
    } catch (err) {
      console.error('❌ Journey fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to fetch journey data');
      setCurrentJourney(null);
      setJourneyHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const loadJourneys = async () => {
      if (isMounted) {
        await fetchJourneyData();
      }
    };

    loadJourneys();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [fetchJourneyData]);

  return {
    currentJourney,
    journeyHistory,
    loading,
    error,
    refresh: fetchJourneyData
  };
};

export default useJourney;
