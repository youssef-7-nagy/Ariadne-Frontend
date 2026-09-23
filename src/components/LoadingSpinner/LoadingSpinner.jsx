import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading', className = '' }) => {
  return (
    <div className={`loader-page ${className}`}>
      <div className="loader-container">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-text">{text || 'Loading'}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
