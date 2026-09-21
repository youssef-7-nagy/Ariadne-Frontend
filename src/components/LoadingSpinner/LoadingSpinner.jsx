import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'loading', className = '' }) => {
  return (
    <div className={`loader-page ${className}`} id="page">
      <div className="loader-container" id="container">
        <div className="loader-ring" id="ring"></div>
        <div className="loader-ring" id="ring"></div>
        <div className="loader-ring" id="ring"></div>
        <div className="loader-ring" id="ring"></div>
        <div className="loader-text" id="h3">{text}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
