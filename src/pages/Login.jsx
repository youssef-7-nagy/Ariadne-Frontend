import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "../utils/notify";
import "./Login.css";

import {
    FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash
} from "react-icons/fa";

import { API_URL } from "../utils/apiUrl";

const EMAIL_USED_MESSAGE = "This email is already used. Please sign in instead.";

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const navigate = useNavigate();

    const regNameRef = useRef(null);
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
        const email = regEmailRef.current.value;
        const password = regPasswordRef.current.value;

        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password
            });
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            emitAuthChanged();
            notify.success("Success - Registration successful!");

            setTimeout(() => {
                if (user && (user.role === 'admin' || user.role === 'superadmin')) {
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
                if (user && (user.role === 'admin' || user.role === 'superadmin')) {
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

    return (
        <div className="login-body">
            <div className={`login-container ${isActive ? "active" : ""}`} id="container">

                {/* --- REGISTER FORM --- */}
                <div className="form-container sign-up">
                    <form onSubmit={submitRegister}>
                        <h1>Create Account</h1>
                        <button type="button" className="google-btn" onClick={handleGoogleAuth}>
                            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            Continue with Google
                        </button>
                        <span>or use your email for registration</span>
                        <div className="input-wrapper">
                            <input type="text" placeholder="Name" ref={regNameRef} required />
                            <FaUser className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email" ref={regEmailRef} required />
                            <FaEnvelope className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input 
                                type={showRegPassword ? "text" : "password"} 
                                placeholder="Password" 
                                ref={regPasswordRef} 
                                required 
                                className="password-input"
                            />
                            <FaLock className="input-icon" />
                            {showRegPassword ? (
                                <FaEyeSlash className="input-icon-right clickable-icon" onClick={() => setShowRegPassword(false)} />
                            ) : (
                                <FaEye className="input-icon-right clickable-icon" onClick={() => setShowRegPassword(true)} />
                            )}
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
                        <button type="button" className="google-btn" onClick={handleGoogleAuth}>
                            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            Continue with Google
                        </button>
                        <span>or use your email password</span>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email" ref={loginEmailRef} required />
                            <FaEnvelope className="input-icon" />
                        </div>
                        <div className="input-wrapper">
                            <input 
                                type={showLoginPassword ? "text" : "password"} 
                                placeholder="Password" 
                                ref={loginPasswordRef} 
                                required 
                                className="password-input"
                            />
                            <FaLock className="input-icon" />
                            {showLoginPassword ? (
                                <FaEyeSlash className="input-icon-right clickable-icon" onClick={() => setShowLoginPassword(false)} />
                            ) : (
                                <FaEye className="input-icon-right clickable-icon" onClick={() => setShowLoginPassword(true)} />
                            )}
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