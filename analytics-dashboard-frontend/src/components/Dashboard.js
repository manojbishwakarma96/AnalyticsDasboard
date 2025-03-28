import React, { useState, useEffect } from "react";
import {
  getAnalyticsData,
  getButtonClickAnalytics,
  trackVisit,
} from "../services/api";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faUser,
  faChartLine,
  faClock,
  faMousePointer,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faRefresh,
  faDownload,
  faShareAlt,
  faTachometerAlt,
  faCog,
  faSignOutAlt,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import ButtonClicksPieChart from "./charts/ButtonClicksPieChart";
import InteractiveButton from "./InteractiveButton";

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [buttonClicks, setButtonClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Fetch analytics data
      const data = await getAnalyticsData();
      setAnalyticsData(data);
      setBackendConnected(true);

      // Fetch button click data
      const buttonData = await getButtonClickAnalytics();
      setButtonClicks(buttonData);

      setLastChecked(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to connect to backend server. Please check your connection."
      );
      setBackendConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleNavigation = async (page) => {
    setActivePage(page);
    try {
      // Track the visit to the page
      if (page === "home") {
        await trackVisit("/hello");
      } else if (page === "about") {
        await trackVisit("/about");
      }

      // Refresh data after navigation
      fetchData();
    } catch (err) {
      console.error(`Error navigating to ${page}:`, err);
    }
  };

  const handleButtonClick = (buttonId) => {
    // Refresh data to show new button click
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

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="dashboard" role="main">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Navigation Bar */}
      <header className="dashboard-header" role="banner">
        <div className="logo-container">
          <FontAwesomeIcon
            icon={faTachometerAlt}
            size="lg"
            className="logo-icon"
            aria-hidden="true"
          />
          <h1>Analytics Dashboard</h1>
        </div>
        <nav className="navigation-menu" role="navigation" aria-label="Main navigation">
          <button
            className={`nav-button ${activePage === "home" ? "active" : ""}`}
            onClick={() => handleNavigation("home")}
            aria-current={activePage === "home" ? "page" : undefined}
            aria-label="Home page"
          >
            <FontAwesomeIcon icon={faHome} aria-hidden="true" /> Home
          </button>
          <button
            className={`nav-button ${activePage === "about" ? "active" : ""}`}
            onClick={() => handleNavigation("about")}
            aria-current={activePage === "about" ? "page" : undefined}
            aria-label="About page"
          >
            <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" /> About
          </button>
        </nav>
        <div className="dashboard-controls" role="toolbar" aria-label="Dashboard controls">
          <div
            className={`backend-status ${
              backendConnected ? "connected" : "disconnected"
            }`}
            role="status"
            aria-live="polite"
          >
            <FontAwesomeIcon
              icon={backendConnected ? faCheckCircle : faExclamationTriangle}
              aria-hidden="true"
            />
            <span>{backendConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label={refreshing ? "Refreshing data..." : "Refresh data"}
          >
            <FontAwesomeIcon icon={faRefresh} spin={refreshing} aria-hidden="true" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Status info bar */}
      <div className="status-bar" role="status" aria-live="polite">
        <div className="status-info">
          <span className="status-label">Last updated:</span>
          <span className="status-value">
            {lastChecked ? formatTimestamp(lastChecked) : "Never"}
          </span>
        </div>
        {error && (
          <div className="error-message" role="alert">
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" /> {error}
          </div>
        )}
      </div>

      {/* Main content area */}
      <main id="main-content" className="dashboard-content" tabIndex="-1">
        {/* Summary Cards Row */}
        <div className="summary-cards" role="region" aria-label="Dashboard summary">
          {/* User Information Card */}
          <div className="summary-card" role="article">
            <div className="card-icon-container">
              <FontAwesomeIcon icon={faUser} className="card-icon" aria-hidden="true" />
            </div>
            <div className="card-content">
              <h2>User</h2>
              <div className="card-value" aria-label="Current user">
                {analyticsData?.username || "Guest"}
              </div>
            </div>
          </div>

          {/* Total Hits Card */}
          <div className="summary-card" role="article">
            <div className="card-icon-container accent-blue">
              <FontAwesomeIcon icon={faChartLine} className="card-icon" aria-hidden="true" />
            </div>
            <div className="card-content">
              <h2>Total Hits</h2>
              <div className="card-value highlight" aria-label="Total number of hits">
                {analyticsData?.hits || 0}
              </div>
            </div>
          </div>

          {/* Button Clicks Card */}
          <div className="summary-card" role="article">
            <div className="card-icon-container accent-orange">
              <FontAwesomeIcon icon={faMousePointer} className="card-icon" aria-hidden="true" />
            </div>
            <div className="card-content">
              <h2>Button Clicks</h2>
              <div className="card-value highlight" aria-label="Total number of button clicks">
                {buttonClicks?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          <div className="dashboard-card recent-visits" role="region" aria-label="Recent visits">
            <div className="card-header">
              <h2>
                <FontAwesomeIcon icon={faClock} aria-hidden="true" /> Recent Visits
              </h2>
            </div>
            <div className="card-body">
              <div className="timestamps">
                {analyticsData?.timestamps &&
                analyticsData.timestamps.length > 0 ? (
                  <ul className="timestamp-list">
                    {analyticsData.timestamps.map((timestamp, index) => (
                      <li key={index} className="timestamp-item">
                        <span className="timestamp-value">
                          {formatTimestamp(timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">No visit data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Button Click Analytics Card */}
          <div className="dashboard-card button-clicks" role="region" aria-label="Button click analytics">
            <div className="card-header">
              <h2>
                <FontAwesomeIcon icon={faMousePointer} aria-hidden="true" /> Button Click Analytics
              </h2>
            </div>
            <div className="card-body">
              <div className="button-analytics">
                {buttonClicks && buttonClicks.length > 0 ? (
                  <ul className="button-click-list">
                    {buttonClicks.slice(0, 8).map((click, index) => (
                      <li key={index} className="button-click-item">
                        <div className="click-badge">{click.buttonId}</div>
                        <div className="click-details">
                          <span className="click-user">
                            {click.username || "Guest"}
                          </span>
                          <span className="click-time">
                            {formatTimestamp(click.timestamp)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">No button click data available</div>
                )}

                {buttonClicks && buttonClicks.length > 8 && (
                  <div className="view-more-link">
                    <a href="#">View all {buttonClicks.length} button clicks</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Button Click Distribution Chart */}
          <div className="dashboard-card chart-card" role="region" aria-label="Button click distribution chart">
            <div className="card-header">
              <h2>
                <FontAwesomeIcon icon={faChartLine} aria-hidden="true" /> Button Click Distribution
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {buttonClicks && buttonClicks.length > 0 ? (
                  <ButtonClicksPieChart buttonClicks={buttonClicks} />
                ) : (
                  <div className="no-data">
                    Not enough data to generate chart
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Buttons Section */}
        <div className="interactive-section" role="region" aria-label="Interactive buttons">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faMousePointer} aria-hidden="true" /> Interactive Buttons
            </h2>
            <p className="section-description">
              Click on these buttons to test the button click tracking feature.
              Each click is recorded with the button ID, timestamp, and user
              information.
            </p>
          </div>
          <div className="buttons-grid">
            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faDownload} aria-hidden="true" /> Data Export
                </h3>
              </div>
              <div className="card-body">
                <p>Export your analytics data to CSV format</p>
                <InteractiveButton
                  id="export-data-btn"
                  color="primary"
                  icon={faDownload}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  Export Data
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "export-data-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faShareAlt} aria-hidden="true" /> Share Report
                </h3>
              </div>
              <div className="card-body">
                <p>Share your analytics report with your team</p>
                <InteractiveButton
                  id="share-report-btn"
                  color="success"
                  icon={faShareAlt}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  Share Report
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "share-report-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faChartLine} aria-hidden="true" /> Generate Insights
                </h3>
              </div>
              <div className="card-body">
                <p>Generate AI-powered insights from your data</p>
                <InteractiveButton
                  id="generate-insights-btn"
                  color="warning"
                  icon={faChartLine}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  Generate Insights
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "generate-insights-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Button Row */}
          <div className="buttons-grid additional-buttons">
            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faFileAlt} aria-hidden="true" /> Reports
                </h3>
              </div>
              <div className="card-body">
                <p>View and generate detailed analytics reports</p>
                <InteractiveButton
                  id="reports-btn"
                  color="info"
                  icon={faFileAlt}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  View Reports
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "reports-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faCog} aria-hidden="true" /> Settings
                </h3>
              </div>
              <div className="card-body">
                <p>Configure your dashboard and tracking preferences</p>
                <InteractiveButton
                  id="settings-btn"
                  color="secondary"
                  icon={faCog}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  Open Settings
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "settings-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="button-card" role="article">
              <div className="card-header">
                <h3>
                  <FontAwesomeIcon icon={faSignOutAlt} aria-hidden="true" /> Logout
                </h3>
              </div>
              <div className="card-body">
                <p>Securely sign out from your current session</p>
                <InteractiveButton
                  id="logout-btn"
                  color="danger"
                  icon={faSignOutAlt}
                  username={analyticsData?.username || "Guest"}
                  onClickSuccess={handleButtonClick}
                >
                  Logout
                </InteractiveButton>
              </div>
              <div className="card-footer">
                <div className="click-counter">
                  <span className="counter-label">Clicks:</span>
                  <span className="counter-value">
                    {
                      buttonClicks.filter(
                        (click) => click.buttonId === "logout-btn"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
