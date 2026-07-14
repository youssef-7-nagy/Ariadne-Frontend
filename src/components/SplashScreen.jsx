import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showElements, setShowElements] = useState(false);

    useEffect(() => {
        // Show loading bar slightly after logo starts revealing
        const elementsTimer = setTimeout(() => {
            setShowElements(true);
        }, 500);

        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 800); // 800ms fade out matches CSS transition
        }, 3000); // Appear for 3 seconds

        return () => {
            clearTimeout(timer);
            clearTimeout(elementsTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen-container ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="logo-split-container">
                    <img src="/mylogo.png" alt="Ariadne Logo Left" className="splash-logo-half left-half" />
                    <img src="/mylogo.png" alt="Ariadne Logo Right" className="splash-logo-half right-half" />
                    <div className="logo-glow"></div>
                </div>
                <div className={`loading-bar-container ${showElements ? 'show' : ''}`}>
                    <div className="loading-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
