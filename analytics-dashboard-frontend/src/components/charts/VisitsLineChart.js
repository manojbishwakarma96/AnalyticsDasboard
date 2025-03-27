import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chart.js/auto";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const VisitsLineChart = ({ timestamps }) => {
  // Process timestamps data
  const processTimestamps = () => {
    // Group timestamps by day
    const groupedByDay = {};

    // Sort timestamps from oldest to newest
    const sortedTimestamps = [...timestamps].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    sortedTimestamps.forEach((timestamp) => {
      // Format date as YYYY-MM-DD for grouping
      const date = new Date(timestamp);
      const day = date.toISOString().split("T")[0];

      if (!groupedByDay[day]) {
        groupedByDay[day] = 0;
      }

      groupedByDay[day]++;
    });

    // Prepare data for chart
    const labels = Object.keys(groupedByDay).slice(-14); // Last 14 days
    const data = labels.map((day) => groupedByDay[day]);

    return { labels, data };
  };

  const { labels, data } = processTimestamps();

  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: "Page Visits",
        data,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Visits Over Time",
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Number of Visits",
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: "300px", width: "100%" }}>
      {timestamps && timestamps.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="no-data-message">Not enough data to display chart</div>
      )}
    </div>
  );
};

export default VisitsLineChart;
