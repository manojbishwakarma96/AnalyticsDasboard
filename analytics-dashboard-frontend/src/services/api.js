// API base URL
const API_URL = "http://localhost:3000";

// Get all analytics data
export const getAnalyticsData = async () => {
  try {
    const response = await fetch(`${API_URL}/analytics`);
    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

// Track button click
export const trackButtonClick = async (buttonId, username = "guest") => {
  try {
    const clickData = {
      buttonId,
      username,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/analytics/button-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clickData),
    });

    if (!response.ok) {
      throw new Error("Failed to track button click");
    }

    return await response.json();
  } catch (error) {
    console.error("Error tracking button click:", error);
    throw error;
  }
};

// Get button click analytics
export const getButtonClickAnalytics = async () => {
  try {
    const response = await fetch(`${API_URL}/analytics/button-clicks`);
    if (!response.ok) {
      throw new Error("Failed to fetch button click analytics");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching button click analytics:", error);
    throw error;
  }
};
