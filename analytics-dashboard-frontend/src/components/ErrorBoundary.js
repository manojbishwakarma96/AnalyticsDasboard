import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Attempt to recover by reloading the app
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience. Here's what happened:</p>
          <div className="error-details">
            {this.state.error && <p>{this.state.error.toString()}</p>}
          </div>
          <button onClick={this.handleReset} className="reset-button">
            <FontAwesomeIcon icon={faRedo} /> Try Again
          </button>
          <p className="support-text">
            If the problem persists, please contact support with error ID: {Date.now().toString(36)}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
