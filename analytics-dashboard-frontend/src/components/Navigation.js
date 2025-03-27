import React, { useState, useEffect } from "react";
import { getAvailableRoutes, trackVisit } from "../services/api";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faChartLine,
  faSpinner,
  faExclamationTriangle,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  home: faHome,
  "info-circle": faInfoCircle,
  "chart-line": faChartLine,
  compass: faCompass,
  // Add more icon mappings as needed
};

const Navigation = ({ onNavigate, activeRoute }) => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navResponse, setNavResponse] = useState("");

  useEffect(() => {
    // Fetch available routes when component mounts
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const data = await getAvailableRoutes();
      setRoutes(data.routes || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError("Failed to load available routes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavClick = async (route) => {
    try {
      setNavResponse("Loading...");
      const response = await trackVisit(route.path);
      setNavResponse(response);
      onNavigate(route.path);
    } catch (err) {
      console.error(`Error navigating to ${route.path}:`, err);
      setNavResponse(`Error: Could not connect to ${route.path}`);
    }
  };

  const getIconForRoute = (iconName) => {
    return iconMap[iconName] || faCompass;
  };

  if (isLoading) {
    return (
      <div className="navigation-loading">
        <FontAwesomeIcon icon={faSpinner} spin />
        <span>Loading routes...</span>
      </div>
    );
  }

  return (
    <div className="navigation-container">
      <div className="nav-header">
        <h2>
          <FontAwesomeIcon icon={faCompass} /> Navigation
        </h2>
        <button className="refresh-routes-btn" onClick={fetchRoutes}>
          Refresh Routes
        </button>
      </div>

      {error && (
        <div className="nav-error">
          <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
        </div>
      )}

      <nav className="main-nav">
        <ul className="nav-list">
          {routes.map((route, index) => (
            <li
              key={index}
              className={activeRoute === route.path ? "active" : ""}
              onClick={() => handleNavClick(route)}
            >
              <FontAwesomeIcon icon={getIconForRoute(route.icon)} />
              <span>{route.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-response-container">
        <div className="response-label">Response:</div>
        <div className="response-content">{navResponse}</div>
      </div>
    </div>
  );
};

export default Navigation;
