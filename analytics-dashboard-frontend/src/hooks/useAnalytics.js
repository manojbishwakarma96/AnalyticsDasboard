import { useMemo, useCallback } from 'react';

export const useAnalyticsData = (analyticsData) => {
  const formattedData = useMemo(() => {
    if (!analyticsData) return null;
    
    return {
      username: analyticsData.username || 'Guest',
      hits: analyticsData.hits || 0,
      lastVisit: analyticsData.lastVisit ? new Date(analyticsData.lastVisit) : null,
      visitsPerDay: analyticsData.visits?.reduce((acc, visit) => {
        const date = new Date(visit.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {}
    };
  }, [analyticsData]);

  return formattedData;
};

export const useButtonClickStats = (buttonClicks) => {
  const stats = useMemo(() => {
    if (!buttonClicks?.length) return {};

    return buttonClicks.reduce((acc, click) => {
      const buttonId = click.buttonId;
      acc[buttonId] = (acc[buttonId] || 0) + 1;
      return acc;
    }, {});
  }, [buttonClicks]);

  return stats;
};

export const useSortedVisits = (visits) => {
  return useMemo(() => {
    if (!visits?.length) return [];
    
    return [...visits].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [visits]);
};
