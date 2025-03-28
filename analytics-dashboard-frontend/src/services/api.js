// API base URL - backend is running on port 3000 while frontend is on port 3002
const API_URL = "http://localhost:3000";

// Get all analytics data
export const getAnalyticsData = async () => {
  try {
    const response = await fetch(`${API_URL}/analytics-data`);
    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

// Get available routes from backend
export const getAvailableRoutes = async () => {
  try {
    const response = await fetch(`${API_URL}/routes`);
    if (!response.ok) {
      throw new Error("Failed to fetch available routes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching available routes:", error);
    // Return default routes if unable to fetch from backend
    return {
      routes: [
        { path: "/hello", name: "Home", icon: "home" },
        { path: "/analytics", name: "Analytics", icon: "chart-line" },
      ],
    };
  }
};

// Track page visit to specified endpoint
export const trackVisit = async (pagePath = "/hello") => {
  try {
    const response = await fetch(`${API_URL}${pagePath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to track visit");
    }
    return await response.text();
  } catch (error) {
    console.error("Error tracking visit:", error);
    throw error;
  }
};

// Track button click with detailed information
export const trackButtonClick = async (buttonId, username = "Guest") => {
  try {
    const response = await fetch(`${API_URL}/button-clicks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonId,
        username,
        timestamp: new Date().toISOString(),
      }),
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
    const response = await fetch(`${API_URL}/button-clicks`);
    if (!response.ok) {
      throw new Error("Failed to fetch button click analytics");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching button click analytics:", error);
    throw error;
  }
};
