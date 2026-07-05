import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <h1 style={{ fontSize: '8rem', fontWeight: 'bold', color: 'var(--accent-color)', margin: 0, lineHeight: 1 }}>404</h1>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', padding: '12px 30px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', transition: 'opacity 0.3s' }}>
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
