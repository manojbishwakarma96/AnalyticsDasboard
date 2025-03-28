import { useMemo } from 'react';

export const useAnalyticsData = (analyticsData) => {
  return useMemo(() => {
    if (!analyticsData || !Array.isArray(analyticsData)) return null;
    
    // Process array of endpoint analytics
    const totalHits = analyticsData.reduce((sum, item) => sum + item.hits, 0);
    const allTimestamps = analyticsData.flatMap(item => item.timestamps);
    const lastVisit = allTimestamps.length > 0 
      ? new Date(Math.max(...allTimestamps.map(ts => new Date(ts))))
      : null;

    // Calculate visits per day across all endpoints
    const visitsPerDay = allTimestamps.reduce((acc, timestamp) => {
      const date = new Date(timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      endpoints: analyticsData.map(item => ({
        endpoint: item.endpoint,
        hits: item.hits,
        timestamps: item.timestamps.map(ts => new Date(ts))
      })),
      totalHits,
      lastVisit,
      visitsPerDay
    };
  }, [analyticsData]);
};

export const useButtonClickStats = (buttonClicks) => {
  return useMemo(() => {
    if (!buttonClicks?.data?.length) return {};

    return buttonClicks.data.reduce((acc, click) => {
      const buttonId = click.buttonId;
      acc[buttonId] = (acc[buttonId] || 0) + 1;
      return acc;
    }, {});
  }, [buttonClicks]);
};

export const useSortedVisits = (analyticsData) => {
  return useMemo(() => {
    if (!analyticsData || !Array.isArray(analyticsData)) return [];
    
    // Get all timestamps from all endpoints with their endpoint info
    const allVisits = analyticsData.flatMap(item => 
      item.timestamps.map(timestamp => ({
        endpoint: item.endpoint,
        timestamp: new Date(timestamp)
      }))
    );

    // Sort by timestamp, most recent first
    return allVisits.sort((a, b) => b.timestamp - a.timestamp);
  }, [analyticsData]);
};
