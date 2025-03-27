const express = require("express");
const axios = require("axios");
const router = express.Router();
const {
  trackAnalytics,
  getAnalytics,
} = require("../controllers/analyticsController");
const {
  trackButtonClick,
  getButtonClicks,
} = require("../controllers/buttonClickController");

// Google Analytics 4 Measurement ID & API Secret
const measurement_id = "G-3N37LZHLB8"; // Replace with your GA4 Measurement ID
const api_secret = "b8pgN9-cQ1SP5XjARSD98Q"; // Replace with your API Secret

// Google Analytics Measurement Protocol Endpoint
const GA_MEASUREMENT_URL = `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`;

// Send event to Google Analytics via GA4 Measurement Protocol
const sendToGoogleAnalytics = async (eventName, params = {}) => {
  try {
    const payload = {
      client_id: "555.1234567890",
      events: [
        {
          name: eventName,
          params: {
            session_id: "123", // Replace with actual session tracking if needed
            engagement_time_msec: 100,
            ...params,
          },
        },
      ],
    };

    // Send event data to GA4
    await axios.post(GA_MEASUREMENT_URL, payload);
    console.log(`Event '${eventName}' sent to Google Analytics`);
  } catch (error) {
    console.error(
      "Error sending event to Google Analytics:",
      error.response ? error.response.data : error.message
    );
  }
};

// Get available routes for the frontend navigation
router.get("/routes", async (req, res) => {
  try {
    // Send a list of available routes with metadata
    const availableRoutes = [
      {
        path: "/hello",
        name: "Home",
        icon: "home",
        description: "Dashboard home page",
      },
      {
        path: "/about",
        name: "About",
        icon: "info-circle",
        description: "About this application",
      },
      {
        path: "/analytics-dashboard",
        name: "Analytics",
        icon: "chart-line",
        description: "View analytics data",
      },
      {
        path: "/reports",
        name: "Reports",
        icon: "list",
        description: "View detailed reports",
      },
      {
        path: "/settings",
        name: "Settings",
        icon: "cog",
        description: "Application settings",
      },
    ];

    // Log the request to analytics
    await sendToGoogleAnalytics("route_list_view", {
      route_count: availableRoutes.length,
    });

    res.json({
      routes: availableRoutes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting routes:", error);
    res.status(500).json({
      error: "Failed to retrieve routes",
      message: error.message,
    });
  }
});

// Track analytics for page visits and log Google Analytics events
router.get("/hello", trackAnalytics, async (req, res) => {
  await sendToGoogleAnalytics("page_view", { page_location: "/hello" });
  res.send("This is Analytics App");
});

router.get("/about", trackAnalytics, async (req, res) => {
  await sendToGoogleAnalytics("page_view", { page_location: "/about" });
  res.send("About Us");
});

// Add routes for the additional pages in the navigation
router.get("/analytics-dashboard", trackAnalytics, async (req, res) => {
  await sendToGoogleAnalytics("page_view", {
    page_location: "/analytics-dashboard",
  });
  res.send("Analytics Dashboard");
});

router.get("/reports", trackAnalytics, async (req, res) => {
  await sendToGoogleAnalytics("page_view", { page_location: "/reports" });
  res.send("Reports Page");
});

router.get("/settings", trackAnalytics, async (req, res) => {
  await sendToGoogleAnalytics("page_view", { page_location: "/settings" });
  res.send("Settings Page");
});

// Route to view analytics data from MongoDB (renamed to avoid conflict)
router.get("/analytics-data", getAnalytics);

// Button click tracking routes
router.post("/button-clicks", async (req, res) => {
  try {
    // Track the button click in MongoDB
    await trackButtonClick(req, res);

    // Also send to Google Analytics if desired
    await sendToGoogleAnalytics("button_click", {
      button_id: req.body.buttonId,
      username: req.body.username || "Guest",
    });
  } catch (error) {
    console.error("Error in button click tracking:", error);
  }
});

// Get all button clicks
router.get("/button-clicks", getButtonClicks);

module.exports = router;
