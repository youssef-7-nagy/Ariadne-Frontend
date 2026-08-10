import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start smooth exit dissolve after 1.5s
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 1500);

        // Completely finish & remove splash after 2.0s total
        const finishTimer = setTimeout(() => {
            if (onFinish) onFinish();
        }, 2050);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`smooth-splash-root ${isExiting ? 'exit' : ''}`}>
            {/* Soft Ambient Radial Light */}
            <div className="smooth-splash-glow" />

            {/* Logo Stage */}
            <div className="smooth-splash-content">
                <img
                    src="/mylogo.png"
                    alt="ARIA Production"
                    className="smooth-splash-logo"
                />
            </div>
        </div>
    );
};

export default SplashScreen;
