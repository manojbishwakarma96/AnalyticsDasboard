import React, { useState, useEffect } from "react";
import {
  getAnalyticsData,
  trackVisit,
  trackButtonClick,
  getButtonClickAnalytics,
  storeButtonClick,
} from "../services/api";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChartLine,
  faClock,
  faMousePointer,
  faSpinner,
  faExclamationTriangle,
  faServer,
  faCheckCircle,
  faHome,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    username: "Guest",
    totalHits: 0,
    timestamps: [],
  });

  const [buttonClicks, setButtonClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    lastChecked: null,
  });
  const [activeNavItem, setActiveNavItem] = useState("/hello");
  const [navResponse, setNavResponse] = useState("");

  // Fetch analytics data
  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Track a page visit to analytics dashboard
      await trackVisit("/hello");

      // Fetch analytics data
      const data = await getAnalyticsData();
      setAnalytics({
        username: data.username || "Guest",
        totalHits: data.totalHits || 0,
        timestamps: data.timestamps || [],
      });

      // Fetch button click data (simulated)
      const clickData = await getButtonClickAnalytics();
      setButtonClicks(clickData || []);

      // Backend connected successfully
      setBackendStatus({
        connected: true,
        lastChecked: new Date().toLocaleTimeString(),
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to load analytics data. Please make sure your backend is running on port 3000."
      );
      setBackendStatus({
        connected: false,
        lastChecked: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
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

      // Store click in localStorage for session persistence
      const newClick = {
        buttonId,
        username: analytics.username,
        timestamp: new Date().toISOString(),
      };

      storeButtonClick(newClick);

      // Update local state to show the click immediately
      setButtonClicks((prevClicks) => [newClick, ...prevClicks]);
    } catch (err) {
      console.error("Error tracking button click:", err);
      setError(
        "Failed to track button click. Please make sure your backend is running."
      );
    }
  };

  // Handle navigation to backend endpoints
  const handleNavClick = async (endpoint) => {
    try {
      setActiveNavItem(endpoint);
      setNavResponse("Loading...");
      const response = await trackVisit(endpoint);
      setNavResponse(response);
      // Refresh analytics data after navigation
      fetchData();
    } catch (err) {
      console.error(`Error navigating to ${endpoint}:`, err);
      setNavResponse(`Error: Could not connect to ${endpoint}`);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          <FontAwesomeIcon icon={faChartLine} /> Analytics Dashboard
        </h1>
        <div className="dashboard-controls">
          <div
            className={`backend-status ${
              backendStatus.connected ? "connected" : "disconnected"
            }`}
          >
            <FontAwesomeIcon
              icon={
                backendStatus.connected ? faCheckCircle : faExclamationTriangle
              }
            />
            <span>
              Backend: {backendStatus.connected ? "Connected" : "Disconnected"}
            </span>
            {backendStatus.lastChecked && (
              <span className="status-time">
                Last checked: {backendStatus.lastChecked}
              </span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
        </div>
      )}

      <nav className="backend-nav">
        <div className="nav-title">Backend Navigation:</div>
        <ul className="nav-items">
          <li
            className={activeNavItem === "/hello" ? "active" : ""}
            onClick={() => handleNavClick("/hello")}
          >
            <FontAwesomeIcon icon={faHome} /> /hello
          </li>
          <li
            className={activeNavItem === "/about" ? "active" : ""}
            onClick={() => handleNavClick("/about")}
          >
            <FontAwesomeIcon icon={faInfoCircle} /> /about
          </li>
        </ul>
        <div className="nav-response">
          <div className="response-label">Response:</div>
          <div className="response-content">{navResponse}</div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>
            <FontAwesomeIcon icon={faUser} /> User Information
          </h2>
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{analytics.username}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>
            <FontAwesomeIcon icon={faChartLine} /> Visit Analytics
          </h2>
          <div className="analytics-info">
            <div className="info-item highlight">
              <span className="info-label">Total Hits:</span>
              <span className="info-value counter">{analytics.totalHits}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>
            <FontAwesomeIcon icon={faClock} /> Recent Visits
          </h2>
          <div className="timestamps">
            {analytics.timestamps && analytics.timestamps.length > 0 ? (
              <ul className="timestamp-list">
                {analytics.timestamps.map((timestamp, index) => (
                  <li key={index} className="timestamp-item">
                    <span className="timestamp-value">
                      {formatTimestamp(timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No visit data available</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>
            <FontAwesomeIcon icon={faMousePointer} /> Button Click Analytics
          </h2>
          <div className="button-analytics">
            {buttonClicks.length > 0 ? (
              <ul className="button-click-list">
                {buttonClicks.map((click, index) => (
                  <li key={index} className="button-click-item">
                    <div className="click-badge">{click.buttonId}</div>
                    <div className="click-details">
                      <span className="click-user">{click.username}</span>
                      <span className="click-time">
                        {formatTimestamp(click.timestamp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No button click data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="test-section">
        <h2>Test Button Click Tracking</h2>
        <p className="helper-text">
          Each button click is tracked using the /hello API endpoint
        </p>
        <div className="button-container">
          <button
            id="test-button-1"
            className="test-button primary"
            onClick={() => handleButtonClick("test-button-1")}
          >
            Dashboard
          </button>
          <button
            id="test-button-2"
            className="test-button success"
            onClick={() => handleButtonClick("test-button-2")}
          >
            Reports
          </button>
          <button
            id="test-button-3"
            className="test-button warning"
            onClick={() => handleButtonClick("test-button-3")}
          >
            Settings
          </button>
          <button
            id="test-button-4"
            className="test-button danger"
            onClick={() => handleButtonClick("test-button-4")}
          >
            Logout
          </button>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>
          <FontAwesomeIcon icon={faServer} /> Backend API: http://localhost:3000
          | Frontend: http://localhost:3002
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
