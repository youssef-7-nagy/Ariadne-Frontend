import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'loading', className = '' }) => {
  return (
    <div className={`loader-page ${className}`}>
      <div className="loader-container">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-text">{text || 'loading'}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
