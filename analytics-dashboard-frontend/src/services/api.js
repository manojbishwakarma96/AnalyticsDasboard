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
        { path: "/about", name: "About", icon: "info-circle" },
        { path: "/analytics", name: "Analytics", icon: "chart-line" },
      ],
    };
  }
};

// Track page visit to specified endpoint
export const trackVisit = async (pagePath = "/hello") => {
  try {
    const response = await fetch(`${API_URL}${pagePath}`);
    if (!response.ok) {
      throw new Error(`Failed to track visit to ${pagePath}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error tracking visit to ${pagePath}:`, error);
    throw error;
  }
};

// Track button click with detailed information, storing in the backend
export const trackButtonClick = async (buttonId, username = "Guest") => {
  try {
    // Send button click data to backend API
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

    console.log(`Button click tracked on backend: ${buttonId} by ${username}`);
    return await response.json();
  } catch (error) {
    console.error("Error recording button click:", error);
    throw error;
  }
};

// Get button click analytics from backend
export const getButtonClickAnalytics = async () => {
  try {
    // Fetch button clicks from backend API
    const response = await fetch(`${API_URL}/button-clicks`);
    if (!response.ok) {
      throw new Error("Failed to fetch button click analytics");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching button click analytics:", error);
    return []; // Return empty array on error
  }
};
