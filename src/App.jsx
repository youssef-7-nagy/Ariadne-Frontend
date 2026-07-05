import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppToaster from './components/AppToaster';
import SplashScreen from './components/SplashScreen';

import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import CategoryProjects from './pages/CategoryProjects';
import ClientProjects from './pages/ClientProjects';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import OAuthCallback from './pages/OAuthCallback';
import { Navigate } from 'react-router-dom';

const parseJson = (rawValue, fallback) => {
    try {
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch {
        return fallback;
    }
};

const ProtectedRoute = ({ children, allowedRoles, userData, isLoggedIn }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles) {
        const role = userData?.role || 'user'; // Default to 'user' if undefined
        if (!allowedRoles.includes(role)) {
            // If an admin tries to access a restricted page, send them to the admin panel
            if (role === 'admin') {
                return <Navigate to="/admin" replace />;
            }
            return <Navigate to="/" replace />;
        }
    }
    return children;
};

const App = () => {
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem('hasSeenSplash');
    });
    const [userData, setUserData] = useState(() => parseJson(localStorage.getItem('user'), null));
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Apply/remove 'dark' class on <html> whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (showSplash) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showSplash]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        const handleAuthChange = () => {
            setUserData(parseJson(localStorage.getItem('user'), null));
            setIsLoggedIn(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
    };

    return (
        <Router>
            {showSplash && (
                <SplashScreen 
                    onFinish={() => {
                        setShowSplash(false);
                        sessionStorage.setItem('hasSeenSplash', 'true');
                    }} 
                />
            )}
            <ScrollToTop />
            <AppToaster />
            <div className="d-flex flex-column min-vh-100">
                <Navbar 
                    isLoggedIn={isLoggedIn} 
                    userData={userData} 
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
                <main className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/packages" element={<Portfolio />} />
                        <Route path="/portfolio/:categorySlug" element={<CategoryProjects />} />
                        <Route path="/portfolio/client/:clientName" element={<ClientProjects />} />
                        <Route path="/portfolio/project/:projectSlug" element={<ProjectDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/oauth/callback" element={<OAuthCallback />} />
                        
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['user', 'customer']}>
                                    <Profile />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn} userData={userData} allowedRoles={['admin']}>
                                    <AdminPanel />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
