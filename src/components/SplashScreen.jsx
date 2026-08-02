import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 500); // 500ms smooth fade out
        }, 1400); // Quick 1.4 second fun splash

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`splash-screen-container ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="splash-fun-capsule">
                {/* Camera Viewfinder Corner Brackets */}
                <span className="splash-vf-corner splash-vf-tl"></span>
                <span className="splash-vf-corner splash-vf-tr"></span>
                <span className="splash-vf-corner splash-vf-bl"></span>
                <span className="splash-vf-corner splash-vf-br"></span>

                {/* HUD Top Tag */}
                <div className="splash-hud-tag">
                    <span className="splash-rec-dot"></span>
                    <span>ARIADNE STUDIO</span>
                </div>

                {/* Compact Logo */}
                <div className="splash-logo-wrapper">
                    <img src="/mylogo.png" alt="Ariadne Logo" className="splash-mini-logo" />
                </div>

                {/* Animated Gold Line Indicator */}
                <div className="splash-progress-track">
                    <div className="splash-progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
