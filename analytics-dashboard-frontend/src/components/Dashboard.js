import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>User Information</h2>
          <div className="user-info">
            <p>
              Username: <span id="username">Loading...</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Visit Analytics</h2>
          <div className="analytics-info">
            <p>
              Total Hits: <span id="total-hits">Loading...</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Visits</h2>
          <div className="timestamps">
            <ul id="timestamp-list">
              <li>Loading timestamps...</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Button Click Analytics</h2>
          <div className="button-analytics">
            <p>No button click data available</p>
          </div>
        </div>
      </div>

      <div className="test-section">
        <h2>Test Button Click Tracking</h2>
        <button id="test-button-1" className="test-button">
          Button 1
        </button>
        <button id="test-button-2" className="test-button">
          Button 2
        </button>
        <button id="test-button-3" className="test-button">
          Button 3
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
