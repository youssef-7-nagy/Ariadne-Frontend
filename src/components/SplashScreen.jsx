import React, { useEffect, useState, useRef } from 'react';
import './SplashScreen.css';
import splashVideo from '../assets/splash_screen/splash screen.mp4';

const SplashScreen = ({ onFinish }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Fallback timeout in case video fails to load or play
        const fallbackTimer = setTimeout(() => {
            if (!videoRef.current || videoRef.current.readyState < 3) {
                handleVideoEnded();
            }
        }, 8000); // Wait 8 seconds maximum

        if (videoRef.current) {
            videoRef.current.play().catch(e => {
                console.error("Autoplay failed:", e);
                handleVideoEnded();
            });
        }

        return () => clearTimeout(fallbackTimer);
    }, []);

    const handleVideoEnded = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            if (onFinish) onFinish();
        }, 800); // 800ms fade out matches CSS transition
    };

    return (
        <div className={`splash-screen-container ${isFadingOut ? 'fade-out' : ''}`}>
            <video 
                ref={videoRef}
                className="splash-video"
                src={splashVideo}
                autoPlay 
                muted 
                playsInline
                onEnded={handleVideoEnded}
            />
        </div>
    );
};

export default SplashScreen;
