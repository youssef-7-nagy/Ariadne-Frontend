import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'loading', className = '' }) => {
  return (
    <div className={`loader-page ${className}`}>
      <div className="loader-container">
        <div className="loader-ring ring-navy" />
        <div className="loader-ring ring-gold" />
        <div className="loader-ring ring-baby-blue" />
        <div className="loader-ring ring-sage" />
        <div className="loader-text">{text || 'loading'}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

