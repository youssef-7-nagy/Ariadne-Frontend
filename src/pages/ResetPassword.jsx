import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import './Login.css';
import './ForgotPassword.css';
import './ResetPassword.css';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // If no token in URL — show an error immediately
  if (!token) {
    return (
      <div className="login-body">
        <div className="container forgot-container rp-container">
          <div className="forgot-form-wrapper">
            <div className="rp-invalid-token">
              <span className="rp-icon-error">⚠️</span>
              <h2>Invalid Reset Link</h2>
              <p>This password reset link is missing or has already been used. Please request a new one.</p>
              <Link to="/forgot-password" className="submit-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '16px' }}>
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPassword = passwordRef.current?.value?.trim();
    const confirmPassword = confirmRef.current?.value?.trim();

    if (!newPassword || newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });

      setSuccess(true);
      setFeedback({ type: 'success', message: response.data?.message || 'Password updated successfully!' });

      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Reset Password Error:', error);
      const msg = error.response?.data?.message || 'Failed to reset password. The link may have expired.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="container forgot-container rp-container">
        <div className="forgot-form-wrapper">

          {success ? (
            /* ── Success State ── */
            <div className="rp-success-state">
              <FaCheckCircle className="rp-success-icon" />
              <h2>Password Updated!</h2>
              <p>Your password has been changed successfully. Redirecting you to login in 3 seconds…</p>
              <Link to="/login" className="submit-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '20px' }}>
                Go to Login Now
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="rp-header">
                <span className="rp-lock-icon">🔑</span>
                <h1 className="forgot-title">Set New Password</h1>
                <p className="forgot-description">
                  Choose a strong new password for your Ariadne account.
                </p>
              </div>

              {/* New Password */}
              <div className="input-wrapper">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <FaLock className="input-icon" />
                <button
                  type="button"
                  className="rp-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="input-wrapper">
                <input
                  ref={confirmRef}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <FaLock className="input-icon" />
                <button
                  type="button"
                  className="rp-eye-btn"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  aria-label="Toggle confirm visibility"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Feedback */}
              {feedback.message && (
                <p className={`forgot-feedback forgot-feedback--${feedback.type}`}>
                  {feedback.message}
                </p>
              )}

              <button
                type="submit"
                className={`submit-btn ${isLoading ? 'btn-loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Updating Password…' : 'Update Password'}
              </button>

              <Link to="/login" className="back-link">
                <FaArrowLeft style={{ marginRight: '8px', fontSize: '10px' }} />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
