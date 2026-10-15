import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'loading', className = '' }) => {
  return (
    <div className={`loader-page ${className}`}>
      <div
        className="loader-container"
        role="status"
        aria-label={text || 'loading'}
      >
        <div className="loader-ring" aria-hidden="true" />
        <div className="loader-ring" aria-hidden="true" />
        <div className="loader-ring" aria-hidden="true" />
        <div className="loader-ring" aria-hidden="true" />
        <span className="loader-text">{text || 'loading'}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
