const express = require('express');
const axios = require('axios');
const router = express.Router();
const { trackAnalytics, getAnalytics } = require('../controllers/analyticsController');

// Google Analytics 4 Measurement ID & API Secret
const measurement_id = 'G-3N37LZHLB8'; // Replace with your GA4 Measurement ID
const api_secret = 'b8pgN9-cQ1SP5XjARSD98Q'; // Replace with your API Secret

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
                    }
                }
            ]
        };

        // Send event data to GA4
        await axios.post(GA_MEASUREMENT_URL, payload);
        console.log(`Event '${eventName}' sent to Google Analytics`);
    } catch (error) {
        console.error('Error sending event to Google Analytics:', error.response ? error.response.data : error.message);
    }
};

// Track analytics for page visits and log Google Analytics events
router.get('/hello', trackAnalytics, async (req, res) => {
    await sendToGoogleAnalytics('page_view', { page_location: '/hello' });
    res.send('This is Analytics App');
});

router.get('/about', trackAnalytics, async (req, res) => {
    await sendToGoogleAnalytics('page_view', { page_location: '/about' });
    res.send('About Us');
});

// Route to view analytics data from MongoDB
router.get('/analytics', getAnalytics);

module.exports = router;
