import React from "react";
import "./StatisticsCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faMousePointer,
  faClock,
  faUserAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const StatisticsCards = ({ analytics, buttonClicks }) => {
  // Calculate additional statistics
  const calculateStats = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Count visits today
    const visitsToday = analytics.timestamps
      ? analytics.timestamps.filter(
          (timestamp) =>
            new Date(timestamp).toISOString().split("T")[0] === today
        ).length
      : 0;

    // Get most recent visit
    const mostRecentVisit =
      analytics.timestamps && analytics.timestamps.length > 0
        ? new Date(
            Math.max(
              ...analytics.timestamps.map((timestamp) => new Date(timestamp))
            )
          )
        : null;

    // Average visits per day (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const visitsLast7Days = analytics.timestamps
      ? analytics.timestamps.filter(
          (timestamp) => new Date(timestamp) >= last7Days
        ).length
      : 0;

    const avgVisitsPerDay = Math.round(visitsLast7Days / 7);

    return {
      totalVisits: analytics.totalHits || 0,
      visitsToday,
      totalButtonClicks: buttonClicks ? buttonClicks.length : 0,
      mostRecentVisit,
      avgVisitsPerDay,
    };
  };

  const stats = calculateStats();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    return new Date(timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Define the cards to display
  const cards = [
    {
      title: "Total Visits",
      value: stats.totalVisits,
      icon: faEye,
      color: "blue",
      change: "+12% from last month", // Sample data - in real app would be calculated
    },
    {
      title: "Today's Visits",
      value: stats.visitsToday,
      icon: faCalendarAlt,
      color: "green",
      change: "+3 from yesterday", // Sample data
    },
    {
      title: "Button Clicks",
      value: stats.totalButtonClicks,
      icon: faMousePointer,
      color: "purple",
      change: "+8% from last week", // Sample data
    },
    {
      title: "Avg. Daily Visits",
      value: stats.avgVisitsPerDay,
      icon: faUserAlt,
      color: "orange",
      change: "Last 7 days",
    },
    {
      title: "Last Activity",
      value: formatTimestamp(stats.mostRecentVisit),
      icon: faClock,
      color: "red",
      change: "Real-time tracking",
    },
  ];

  return (
    <div className="statistics-cards">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card ${card.color}`}>
          <div className="card-icon">
            <FontAwesomeIcon icon={card.icon} />
          </div>
          <div className="card-content">
            <h3 className="card-title">{card.title}</h3>
            <div className="card-value">{card.value}</div>
            <div className="card-change">{card.change}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
