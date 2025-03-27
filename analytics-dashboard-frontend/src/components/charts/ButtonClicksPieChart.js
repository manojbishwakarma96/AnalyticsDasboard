import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "chart.js/auto";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ButtonClicksPieChart = ({ buttonClicks }) => {
  // Process button clicks data
  const processButtonClicks = () => {
    // Count clicks by button ID
    const clicksByButton = {};

    buttonClicks.forEach((click) => {
      if (!clicksByButton[click.buttonId]) {
        clicksByButton[click.buttonId] = 0;
      }

      clicksByButton[click.buttonId]++;
    });

    // Prepare data for chart
    const labels = Object.keys(clicksByButton);
    const data = labels.map((buttonId) => clicksByButton[buttonId]);

    return { labels, data };
  };

  const { labels, data } = processButtonClicks();

  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Button Click Distribution",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw;
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} clicks (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: "300px", width: "100%" }}>
      {buttonClicks && buttonClicks.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <div className="no-data-message">Not enough data to display chart</div>
      )}
    </div>
  );
};

export default ButtonClicksPieChart;
