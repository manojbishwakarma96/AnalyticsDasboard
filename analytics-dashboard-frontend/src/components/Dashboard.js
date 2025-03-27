import React, { useState, useEffect } from "react";
import {
  getAnalyticsData,
  trackButtonClick,
  getButtonClickAnalytics,
} from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    username: "Guest",
    totalHits: 0,
    timestamps: [],
  });

  const [buttonClicks, setButtonClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalytics({
          username: data.username || "Guest",
          totalHits: data.totalHits || 0,
          timestamps: data.timestamps || [],
        });

        // Fetch button click data
        const clickData = await getButtonClickAnalytics();
        setButtonClicks(clickData || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle button click
  const handleButtonClick = async (buttonId) => {
    try {
      await trackButtonClick(buttonId, analytics.username);

      // Update local state to show the click immediately
      const newClick = {
        buttonId,
        username: analytics.username,
        timestamp: new Date().toISOString(),
      };

      setButtonClicks((prevClicks) => [newClick, ...prevClicks]);
    } catch (err) {
      console.error("Error tracking button click:", err);
      setError("Failed to track button click. Please try again.");
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>User Information</h2>
          <div className="user-info">
            <p>
              Username: <span id="username">{analytics.username}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Visit Analytics</h2>
          <div className="analytics-info">
            <p>
              Total Hits: <span id="total-hits">{analytics.totalHits}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Visits</h2>
          <div className="timestamps">
            {analytics.timestamps.length > 0 ? (
              <ul id="timestamp-list">
                {analytics.timestamps.map((timestamp, index) => (
                  <li key={index}>{formatTimestamp(timestamp)}</li>
                ))}
              </ul>
            ) : (
              <p>No visit data available</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Button Click Analytics</h2>
          <div className="button-analytics">
            {buttonClicks.length > 0 ? (
              <ul id="button-click-list">
                {buttonClicks.map((click, index) => (
                  <li key={index}>
                    Button ID: {click.buttonId} | User: {click.username} | Time:{" "}
                    {formatTimestamp(click.timestamp)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No button click data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="test-section">
        <h2>Test Button Click Tracking</h2>
        <button
          id="test-button-1"
          className="test-button"
          onClick={() => handleButtonClick("test-button-1")}
        >
          Button 1
        </button>
        <button
          id="test-button-2"
          className="test-button"
          onClick={() => handleButtonClick("test-button-2")}
        >
          Button 2
        </button>
        <button
          id="test-button-3"
          className="test-button"
          onClick={() => handleButtonClick("test-button-3")}
        >
          Button 3
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
