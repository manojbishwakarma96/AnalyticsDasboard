import React, { useState, useEffect } from "react";
import { getAnalyticsData, getButtonClickAnalytics } from "../services/api";
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
  faPieChart,
  faChartBar,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import VisitsLineChart from "./charts/VisitsLineChart";
import ButtonClicksPieChart from "./charts/ButtonClicksPieChart";
import StatisticsCards from "./StatisticsCards";
import Navigation from "./Navigation";
import InteractiveButton from "./InteractiveButton";

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
  const [activeNavItem, setActiveNavItem] = useState("/analytics");

  // Fetch analytics data
  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Fetch analytics data
      const data = await getAnalyticsData();
      setAnalytics({
        username: data.username || "Guest",
        totalHits: data.totalHits || 0,
        timestamps: data.timestamps || [],
      });

      // Fetch button click data from localStorage
      const clickData = await getButtonClickAnalytics();
      setButtonClicks(clickData);

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

  // Handle button click callback
  const handleButtonClick = async (buttonId) => {
    // Refresh the analytics data to show the updated hits
    fetchData();
  };

  // Handle navigation
  const handleNavigation = (route) => {
    setActiveNavItem(route);
    // Refresh analytics data after navigation
    fetchData();
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

      {/* New Navigation Component */}
      <Navigation onNavigate={handleNavigation} activeRoute={activeNavItem} />

      {/* Statistics Cards Section */}
      <StatisticsCards analytics={analytics} buttonClicks={buttonClicks} />

      <div className="charts-container">
        {/* Visits Line Chart */}
        <div className="chart-card">
          <h2>
            <FontAwesomeIcon icon={faChartBar} /> Visits Over Time
          </h2>
          <div className="chart-container">
            <VisitsLineChart timestamps={analytics.timestamps || []} />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Container */}
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
              <div>
                <div className="info-item highlight">
                  <span className="info-label">Total Button Clicks:</span>
                  <span className="info-value counter">
                    {buttonClicks.length}
                  </span>
                </div>
                <ul className="button-click-list">
                  {buttonClicks.slice(0, 5).map((click, index) => (
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
                {buttonClicks.length > 5 && (
                  <div className="view-more-link">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      View all {buttonClicks.length} clicks
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-data">No button click data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Button Analytics Section - Side by Side */}
      <div className="button-analytics-section">
        {/* Button Click Distribution Chart */}
        <div className="chart-card button-distribution">
          <h2>
            <FontAwesomeIcon icon={faPieChart} /> Button Click Distribution
          </h2>
          <div className="chart-container">
            <ButtonClicksPieChart buttonClicks={buttonClicks || []} />
          </div>
        </div>

        {/* Button Click Tracking Cards */}
        <div className="test-section button-tracking">
          <h2>
            <FontAwesomeIcon icon={faMousePointer} /> Button Click Tracking
          </h2>
          <p className="helper-text">
            Track user interactions with beautiful, interactive cards. Each
            click is recorded with unique identifiers and timestamps.
          </p>
          <div className="button-container">
            <div className="action-card primary">
              <div className="card-header">
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  className="card-header-icon"
                />
                <h3>Dashboard</h3>
              </div>
              <div className="card-body">
                <p className="card-description">
                  Access analytics dashboard with comprehensive metrics and data
                  visualization.
                </p>
                <InteractiveButton
                  id="dashboard-btn"
                  color="primary"
                  icon={faTachometerAlt}
                  username={analytics.username}
                  onClickSuccess={handleButtonClick}
                >
                  Access Dashboard
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="stats-count">
                  <span>Popularity:</span>
                  <span className="count">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "dashboard-btn"
                      ).length
                    }{" "}
                    clicks
                  </span>
                </div>
              </div>
            </div>

            <div className="action-card success">
              <div className="card-header">
                <FontAwesomeIcon icon={faList} className="card-header-icon" />
                <h3>Reports</h3>
              </div>
              <div className="card-body">
                <p className="card-description">
                  Generate detailed reports and export analytics data for your
                  presentations.
                </p>
                <InteractiveButton
                  id="reports-btn"
                  color="success"
                  icon={faList}
                  username={analytics.username}
                  onClickSuccess={handleButtonClick}
                >
                  Generate Reports
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="stats-count">
                  <span>Popularity:</span>
                  <span className="count">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "reports-btn"
                      ).length
                    }{" "}
                    clicks
                  </span>
                </div>
              </div>
            </div>

            <div className="action-card warning">
              <div className="card-header">
                <FontAwesomeIcon icon={faCog} className="card-header-icon" />
                <h3>Settings</h3>
              </div>
              <div className="card-body">
                <p className="card-description">
                  Configure your analytics preferences and account settings.
                </p>
                <InteractiveButton
                  id="settings-btn"
                  color="warning"
                  icon={faCog}
                  username={analytics.username}
                  onClickSuccess={handleButtonClick}
                >
                  Adjust Settings
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="stats-count">
                  <span>Popularity:</span>
                  <span className="count">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "settings-btn"
                      ).length
                    }{" "}
                    clicks
                  </span>
                </div>
              </div>
            </div>

            <div className="action-card danger">
              <div className="card-header">
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="card-header-icon"
                />
                <h3>Logout</h3>
              </div>
              <div className="card-body">
                <p className="card-description">
                  Securely sign out from your analytics dashboard session.
                </p>
                <InteractiveButton
                  id="logout-btn"
                  color="danger"
                  icon={faSignOutAlt}
                  username={analytics.username}
                  onClickSuccess={handleButtonClick}
                >
                  Sign Out
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="stats-count">
                  <span>Popularity:</span>
                  <span className="count">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "logout-btn"
                      ).length
                    }{" "}
                    clicks
                  </span>
                </div>
              </div>
            </div>
          </div>
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
