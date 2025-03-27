// API base URL - backend is running on port 3000 while frontend is on port 3002
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

// Track button click by recording a visit to /hello endpoint
export const trackButtonClick = async (buttonId) => {
  try {
    // Using the /hello endpoint to record a visit
    const response = await fetch(`${API_URL}/hello`);
    if (!response.ok) {
      throw new Error("Failed to track button click");
    }
    console.log(`Button click tracked: ${buttonId}`);
    return await response.text();
  } catch (error) {
    console.error("Error recording button click:", error);
    throw error;
  }
};

// Simulate button click analytics retrieval
export const getButtonClickAnalytics = async () => {
  try {
    // For demonstration, generate some simulated button click data
    // This would normally come from a backend endpoint once implemented
    const now = new Date();

    const simulatedClicks = [
      {
        buttonId: "test-button-1",
        username: "Guest",
        timestamp: new Date(now - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        buttonId: "test-button-2",
        username: "Guest",
        timestamp: new Date(now - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      },
      {
        buttonId: "test-button-3",
        username: "Guest",
        timestamp: new Date(now - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      },
    ];

    // Add any clicks from this session (stored in localStorage)
    const sessionClicks = JSON.parse(
      localStorage.getItem("buttonClicks") || "[]"
    );

    return [...sessionClicks, ...simulatedClicks];
  } catch (error) {
    console.error("Error fetching button click analytics:", error);
    return []; // Return empty array on error
  }
};

// Store button click in local storage for session persistence
export const storeButtonClick = (clickData) => {
  try {
    const existingClicks = JSON.parse(
      localStorage.getItem("buttonClicks") || "[]"
    );
    existingClicks.unshift(clickData); // Add to beginning of array
    localStorage.setItem("buttonClicks", JSON.stringify(existingClicks));
  } catch (error) {
    console.error("Error storing button click:", error);
  }
};
