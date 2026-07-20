import React, { useRef, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./Login.css";
import "./ForgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');


const ForgotPassword = () => {
  const emailRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();

    if (!email) {
      setFeedback({ type: "error", message: "Please enter your email address." });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });

      setFeedback({
        type: "success",
        message: response.data?.message || "Reset link sent! Check your inbox.",
      });

      emailRef.current.value = "";
      // Do not auto-redirect — let user read the message and go check email
    } catch (error) {
      console.error("Forgot Password Error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to send reset link. Try again.";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="container forgot-container">
        <div className="forgot-form-wrapper">
          <form onSubmit={handleSubmit} className="forgot-form">
            <h1 className="forgot-title">Reset Password</h1>

            <p className="forgot-description">
              Enter your email address and we will send you a link to reset your password.
            </p>

            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
                required
                disabled={isLoading}
              />
              <FaEnvelope className="input-icon" />
            </div>

            {feedback.message ? (
              <p className={`forgot-feedback forgot-feedback--${feedback.type}`}>
                {feedback.message}
              </p>
            ) : null}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? "btn-loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <Link to="/login" className="back-link">
              <FaArrowLeft style={{ marginRight: "8px", fontSize: "10px" }} />
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
