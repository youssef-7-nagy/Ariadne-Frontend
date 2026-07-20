import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "../utils/notify";
import "./Login.css";

import {
    FaGoogle, FaFacebookF, FaApple,
    FaUser, FaEnvelope, FaLock, FaPhone
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const EMAIL_USED_MESSAGE = "This email is already used. Please sign in instead.";

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const regNameRef = useRef(null);
    const regPhoneRef = useRef(null);
    const regEmailRef = useRef(null);
    const regPasswordRef = useRef(null);
    const loginEmailRef = useRef(null);
    const loginPasswordRef = useRef(null);

    const handleRegisterClick = () => {
        setIsActive(true);
    };
    const handleLoginClick = () => {
        setIsActive(false);
    };

    const emitAuthChanged = () => {
        window.dispatchEvent(new Event("auth-changed"));
    };

    const submitRegister = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const name = regNameRef.current.value;
        const phone = regPhoneRef.current.value;
        const email = regEmailRef.current.value;
        const password = regPasswordRef.current.value;

        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                phone,
                email,
                password
            });
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            emitAuthChanged();
            notify.success("Success - Registration successful!");

            setTimeout(() => {
                if (user && user.role === 'admin') {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/profile";
                }
            }, 100);
        } catch (err) {
            console.error("Register Error:", err);
            const backendMessage = err.response?.data?.message || "";
            const loweredMessage = backendMessage.toLowerCase();
            const isEmailAlreadyUsed =
                loweredMessage.includes("email") &&
                (loweredMessage.includes("already") ||
                    loweredMessage.includes("used") ||
                    loweredMessage.includes("exist") ||
                    loweredMessage.includes("duplicate"));

            const message = isEmailAlreadyUsed
                ? EMAIL_USED_MESSAGE
                : backendMessage || "Registration failed. Try again.";
            notify.error(`Error - ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const submitLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const email = loginEmailRef.current.value;
        const password = loginPasswordRef.current.value;

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            emitAuthChanged();
            notify.success("Success - Login successful!");
            setTimeout(() => {
                if (user && user.role === 'admin') {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/profile";
                }
            }, 100);
        } catch (err) {
            console.error("Login Error:", err);
            const message = err.response?.data?.message || "Login failed. Check your credentials.";
            notify.error(`Error - ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Redirect to backend Passport OAuth endpoint.
     * The backend handles the full OAuth flow and redirects back
     * to /oauth/callback with the JWT token in the query string.
     */
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        window.location.href = `${API_URL}/api/auth/google`;
    };

    const handleFacebookAuth = (e) => {
        e.preventDefault();
        window.location.href = `${API_URL}/api/auth/facebook`;
    };

    const handleAppleAuth = (e) => {
        e.preventDefault();
        window.location.href = `${API_URL}/api/auth/apple`;
    };

    return (
        <div className="login-body">
            <div className={`login-container ${isActive ? "active" : ""}`} id="container">

                {/* --- REGISTER FORM --- */}
                <div className="form-container sign-up">
                    <form onSubmit={submitRegister}>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <a href="#" className="icon" title="Sign up with Google" onClick={handleGoogleAuth}><FaGoogle /></a>
                            <a href="#" className="icon" title="Sign up with Facebook" onClick={handleFacebookAuth}><FaFacebookF /></a>
                            <a href="#" className="icon" title="Sign up with Apple" onClick={handleAppleAuth}><FaApple /></a>
                        </div>
                        <span>or use your email for registration</span>
                        <div className="input-wrapper">
                            <input type="text" placeholder="Name" ref={regNameRef} required />
                            <FaUser className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input type="tel" placeholder="Phone" ref={regPhoneRef} required />
                            <FaPhone className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email" ref={regEmailRef} required />
                            <FaEnvelope className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input type="password" placeholder="Password" ref={regPasswordRef} required />
                            <FaLock className="input-icon" />
                        </div>
                        <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Sign Up"}</button>

                        {/* Mobile Toggle Link */}
                        <p className="mobile-toggle">
                            Already have an account? <span onClick={handleLoginClick}>Sign In</span>
                        </p>
                    </form>
                </div>

                {/* --- LOGIN FORM --- */}
                <div className="form-container sign-in">
                    <form onSubmit={submitLogin}>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <a href="#" className="icon" title="Sign in with Google" onClick={handleGoogleAuth}><FaGoogle /></a>
                            <a href="#" className="icon" title="Sign in with Facebook" onClick={handleFacebookAuth}><FaFacebookF /></a>
                            <a href="#" className="icon" title="Sign in with Apple" onClick={handleAppleAuth}><FaApple /></a>
                        </div>
                        <span>or use your email password</span>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email" ref={loginEmailRef} required />
                            <FaEnvelope className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input type="password" placeholder="Password" ref={loginPasswordRef} required />
                            <FaLock className="input-icon" />
                        </div>

                        <a href="/forgot-password" style={{ marginTop: "15px", marginBottom: "10px" }}>
                            Forget Your Password?
                        </a>

                        <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Sign In"}</button>

                        {/* Mobile Toggle Link */}
                        <p className="mobile-toggle">
                            Don't have an account? <span onClick={handleRegisterClick}>Sign Up</span>
                        </p>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button type="button" className="ghost-btn" onClick={handleLoginClick}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button type="button" className="ghost-btn" onClick={handleRegisterClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;