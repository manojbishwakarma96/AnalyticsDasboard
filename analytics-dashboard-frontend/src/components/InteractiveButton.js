import React, { useState } from "react";
import { trackButtonClick } from "../services/api";
import "./InteractiveButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const InteractiveButton = ({
  id,
  className,
  icon,
  color = "primary",
  username,
  onClickSuccess,
  children,
}) => {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    try {
      // Set button to loading state
      setStatus("loading");

      // Track button click
      await trackButtonClick(id, username);

      // Set success and trigger animation
      setStatus("success");
      setAnimating(true);

      // Call the onClickSuccess callback if provided
      if (onClickSuccess) {
        onClickSuccess(id);
      }

      // Reset button after a delay
      setTimeout(() => {
        setStatus("idle");
        setAnimating(false);
      }, 2000);
    } catch (err) {
      console.error(`Error tracking button click for ${id}:`, err);
      setStatus("error");

      // Reset button after a longer delay for error state
      setTimeout(() => {
        setStatus("idle");
        setAnimating(false);
      }, 3000);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <FontAwesomeIcon icon={faSpinner} spin />;
      case "success":
        return <FontAwesomeIcon icon={faCheck} />;
      case "error":
        return <FontAwesomeIcon icon={faExclamationTriangle} />;
      default:
        return icon ? <FontAwesomeIcon icon={icon} /> : null;
    }
  };

  return (
    <button
      id={id}
      onClick={handleClick}
      disabled={status === "loading"}
      className={`
        interactive-button
        ${color}
        ${status !== "idle" ? status : ""}
        ${animating ? "animating" : ""}
        ${className || ""}
      `}
      data-testid={`button-${id}`}
    >
      <span className="button-icon">{getStatusIcon()}</span>
      <span className="button-text">{children}</span>
      <span className="button-feedback">
        {status === "success" && "Tracked!"}
        {status === "error" && "Failed"}
      </span>
    </button>
  );
};

export default InteractiveButton;
