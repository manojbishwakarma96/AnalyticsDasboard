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

// Track button click with detailed information
export const trackButtonClick = async (buttonId, username = "Guest") => {
  try {
    // Track the click in our storage
    storeButtonClick({
      buttonId,
      username,
      timestamp: new Date().toISOString(),
    });

    // Also record a visit to the /hello endpoint to keep the hit count accurate
    const response = await fetch(`${API_URL}/hello`);
    if (!response.ok) {
      throw new Error("Failed to track button click");
    }

    console.log(`Button click tracked: ${buttonId} by ${username}`);
    return {
      success: true,
      message: "Button click tracked",
    };
  } catch (error) {
    console.error("Error recording button click:", error);
    throw error;
  }
};

// Get button click analytics from localStorage
export const getButtonClickAnalytics = async () => {
  try {
    // Get button clicks from localStorage
    const storedClicks = JSON.parse(
      localStorage.getItem("buttonClicks") || "[]"
    );

    // Sort by timestamp, most recent first
    return storedClicks.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
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
