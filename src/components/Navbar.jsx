import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaTimes,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
    FaInstagram,
    FaEnvelope,
    FaPhoneAlt
} from "react-icons/fa";
import "./Navbar.css";

const getAvatarUrl = (gender) => {
    const normalized = (gender || '').toLowerCase();
    if (normalized === 'female') return 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
    return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
};

export const Navbar = ({ isLoggedIn = false, userData = null, onLogout, theme, toggleTheme }) => {
    const isAdmin = userData?.role === "admin";
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const drawerRef = useRef(null);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        if (typeof onLogout === "function") {
            onLogout();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ─────────────────────────────────────────────────────────────
    // 1. HOME NAVBAR VARIANT (Unchanged transparent/dark hero navbar)
    // ─────────────────────────────────────────────────────────────
    if (isHome) {
        return (
            <div className={`nav-sticky-wrapper is-home ${isScrolled ? 'scrolled' : ''}`}>
                <nav className="navbar navbar--home">
                    {/* Logo */}
                    <div
                        className="logo"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src="/mylogo.png" alt="ARIA Artistic Production" className="logo-img" />
                    </div>

                    {/* Desktop Nav Links */}
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Profile
                            </NavLink>
                        </li>
                    </ul>

                    {/* Right side: Theme Toggle & Profile Dropdown (Desktop) & Hamburger (Mobile) */}
                    <div className="nav-right-actions">
                        <div className="desktop-auth-actions">
                            {/* Night & Light Mode Switch */}
                            <label className="theme-switch" aria-label="Toggle theme">
                                <input
                                    type="checkbox"
                                    className="theme-switch__checkbox"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme || (() => { })}
                                />
                                <div className="theme-switch__container">
                                    <div className="theme-switch__clouds" />
                                    <div className="theme-switch__stars-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="theme-switch__circle-container">
                                        <div className="theme-switch__sun-moon-container">
                                            <div className="theme-switch__moon">
                                                <div className="theme-switch__spot" />
                                                <div className="theme-switch__spot" />
                                                <div className="theme-switch__spot" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {isLoggedIn ? (
                                <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                                    <div className="profile-dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                        <div className="avatar-container">
                                            <img
                                                src={getAvatarUrl(userData?.gender)}
                                                alt="User Avatar"
                                                className="navbar-avatar"
                                            />
                                            <span className="avatar-status-dot"></span>
                                        </div>
                                        <span className="profile-trigger-name">
                                            {userData?.name ? userData.name.split(' ')[0] : 'Account'}
                                        </span>
                                        <FaChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="profile-dropdown-menu">
                                            <div className="dropdown-user-info">
                                                <div className="dropdown-user-name">{userData?.name || 'User'}</div>
                                                <div className="dropdown-user-email">{userData?.email || ''}</div>
                                                <span className={`dropdown-role-badge ${isAdmin ? 'admin' : 'client'}`}>
                                                    {isAdmin ? 'System Admin' : 'Creative Partner'}
                                                </span>
                                            </div>

                                            <hr className="dropdown-divider" />

                                            {!isAdmin && (
                                                <NavLink to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                                    <FaUser className="item-icon" />
                                                    <span>My Dashboard</span>
                                                </NavLink>
                                            )}

                                            {isAdmin && (
                                                <NavLink to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                                    <FaUser className="item-icon" />
                                                    <span>Admin Panel</span>
                                                </NavLink>
                                            )}

                                            <hr className="dropdown-divider" />

                                            <button className="dropdown-logout-btn" onClick={handleLogout}>
                                                <FaSignOutAlt className="item-icon" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink to="/login" className="login-btn-desktop">
                                    Sign In
                                </NavLink>
                            )}
                        </div>

                        <button
                            className={`navbar-hamburger-btn mobile-only-hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </nav>

                {/* Slide-out Menu Drawer */}
                <div
                    className={`nav-drawer-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className={`nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} ref={drawerRef}>
                    <div className="nav-drawer-header">
                        <div className="drawer-brand">
                            <img src="/mylogo.png" alt="ARIA" className="drawer-logo-img" />
                        </div>
                        <button
                            className="nav-drawer-close"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="nav-drawer-content">
                        <ul className="drawer-links">
                            <li>
                                <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>
                                    Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    Profile
                                </NavLink>
                            </li>
                            {isLoggedIn && isAdmin && (
                                <li>
                                    <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                        Admin Dashboard
                                    </NavLink>
                                </li>
                            )}
                        </ul>

                        <div className="drawer-divider"></div>

                        {/* User actions */}
                        <div className="drawer-actions">
                            {isLoggedIn ? (
                                <div className="drawer-user-card">
                                    <div className="drawer-user-info">
                                        <img
                                            src={getAvatarUrl(userData?.gender)}
                                            alt="Avatar"
                                            className="drawer-avatar"
                                        />
                                        <div>
                                            <div className="drawer-user-name">{userData?.name || 'Account'}</div>
                                            <div className="drawer-user-email">{userData?.email || ''}</div>
                                        </div>
                                    </div>
                                    <button className="drawer-logout-btn" onClick={handleLogout}>
                                        <FaSignOutAlt />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <NavLink to="/login" className="drawer-login-btn" onClick={() => setIsMobileMenuOpen(false)}>
                                    Sign In / Register
                                </NavLink>
                            )}
                        </div>

                        <div className="drawer-footer">
                            <p className="drawer-contact-line">Cinematic Photography & Visual Arts</p>
                            <div className="drawer-socials">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="mailto:info@ariadneg.com" aria-label="Email">
                                    <FaEnvelope />
                                </a>
                                <a href="tel:+201000000000" aria-label="Phone">
                                    <FaPhoneAlt />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ALL OTHER PAGES (Original clean white navbar with rounded pill navigation)
    // ─────────────────────────────────────────────────────────────
    return (
        <div className={`nav-sticky-wrapper is-default ${isScrolled ? 'scrolled' : ''}`}>
            {/* Backdrop overlay for mobile menu on default navbar */}
            <div
                className={`default-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="navbar navbar--default">
                {/* ARIA Logo on left */}
                <div
                    className="logo"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/mylogo.png" alt="ARIA Artistic Production" className="logo-img" />
                </div>

                {/* Centered Rounded Pill Nav Links */}
                <ul className={`nav-links default-nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                    <li>
                        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => (isActive || location.pathname.startsWith('/about') ? 'active' : '')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/portfolio"
                            className={({ isActive }) => (
                                isActive ||
                                location.pathname.startsWith('/portfolio') ||
                                location.pathname.startsWith('/projects') ||
                                location.pathname.startsWith('/packages')
                                    ? 'active'
                                    : ''
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Projects
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => (isActive || location.pathname.startsWith('/profile') ? 'active' : '')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Profile
                        </NavLink>
                    </li>
                    {isLoggedIn && isAdmin && (
                        <li className="nav-link-mobile-only">
                            <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                Admin Panel
                            </NavLink>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li className="nav-link-mobile-only">
                            <button className="mobile-logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    )}
                    {!isLoggedIn && (
                        <li className="nav-link-mobile-only">
                            <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>

                {/* Right side: Theme Switch, Profile Dropdown & Mobile Hamburger */}
                <div className="nav-buttons default-nav-buttons">
                    <label className="theme-switch" aria-label="Toggle theme">
                        <input
                            type="checkbox"
                            className="theme-switch__checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme || (() => { })}
                        />
                        <div className="theme-switch__container">
                            <div className="theme-switch__clouds" />
                            <div className="theme-switch__stars-container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="theme-switch__circle-container">
                                <div className="theme-switch__sun-moon-container">
                                    <div className="theme-switch__moon">
                                        <div className="theme-switch__spot" />
                                        <div className="theme-switch__spot" />
                                        <div className="theme-switch__spot" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    {isLoggedIn ? (
                        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                            <div className="profile-dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="avatar-container">
                                    <img
                                        src={getAvatarUrl(userData?.gender)}
                                        alt="User Avatar"
                                        className="navbar-avatar"
                                    />
                                    <span className="avatar-status-dot"></span>
                                </div>
                                <span className="profile-trigger-name">
                                    {userData?.name ? userData.name.split(' ')[0] : 'Account'}
                                </span>
                                <FaChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="profile-dropdown-menu">
                                    <div className="dropdown-user-info">
                                        <div className="dropdown-user-name">{userData?.name || 'User'}</div>
                                        <div className="dropdown-user-email">{userData?.email || ''}</div>
                                        <span className={`dropdown-role-badge ${isAdmin ? 'admin' : 'client'}`}>
                                            {isAdmin ? 'System Admin' : 'Creative Partner'}
                                        </span>
                                    </div>

                                    <hr className="dropdown-divider" />

                                    {!isAdmin && (
                                        <NavLink to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <FaUser className="item-icon" />
                                            <span>My Dashboard</span>
                                        </NavLink>
                                    )}

                                    {isAdmin && (
                                        <NavLink to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <FaUser className="item-icon" />
                                            <span>Admin Panel</span>
                                        </NavLink>
                                    )}

                                    <hr className="dropdown-divider" />

                                    <button className="dropdown-logout-btn" onClick={handleLogout}>
                                        <FaSignOutAlt className="item-icon" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to="/login" className="login-btn-desktop default-login-btn">
                            Sign In
                        </NavLink>
                    )}

                    {/* Original Hamburger for Default Navbar */}
                    <button
                        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;