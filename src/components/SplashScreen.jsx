import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('intro'); // intro → reveal → exit

    useEffect(() => {
        // Phase sequence: intro (0ms) → reveal (800ms) → exit (3200ms) → done (3900ms)
        const t1 = setTimeout(() => setPhase('reveal'), 800);
        const t2 = setTimeout(() => setPhase('exit'), 3200);
        const t3 = setTimeout(() => { if (onFinish) onFinish(); }, 3900);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onFinish]);

    return (
        <div className={`spl-root ${phase}`}>
            {/* Grain Overlay */}
            <div className="spl-grain" />

            {/* Ambient Light Rays */}
            <div className="spl-rays">
                <span className="spl-ray spl-ray-1" />
                <span className="spl-ray spl-ray-2" />
                <span className="spl-ray spl-ray-3" />
            </div>

            {/* Shutter Lines — cinematic letterbox bars */}
            <div className="spl-bar spl-bar-top" />
            <div className="spl-bar spl-bar-bottom" />

            {/* Center Stage */}
            <div className="spl-center">
                {/* Aperture Ring */}
                <div className="spl-aperture">
                    <div className="spl-aperture-ring spl-ring-outer" />
                    <div className="spl-aperture-ring spl-ring-mid" />
                    <div className="spl-aperture-ring spl-ring-inner" />
                    <div className="spl-aperture-blades">
                        {[...Array(8)].map((_, i) => (
                            <span key={i} className="spl-blade" style={{ '--i': i }} />
                        ))}
                    </div>
                    {/* Logo inside aperture */}
                    <div className="spl-logo-wrap">
                        <img src="/mylogo.png" alt="Ariadne" className="spl-logo" />
                    </div>
                </div>

                {/* Studio Name — letter-by-letter */}
                <div className="spl-brand">
                    {'ARIADNE'.split('').map((ch, i) => (
                        <span key={i} className="spl-letter" style={{ '--idx': i }}>{ch}</span>
                    ))}
                </div>

                <div className="spl-tagline">
                    <span className="spl-tag-text">Photography Studio</span>
                </div>

                {/* Progress line */}
                <div className="spl-progress-wrap">
                    <div className="spl-progress-bar" />
                    <div className="spl-progress-glow" />
                </div>
            </div>

            {/* Corner HUD brackets */}
            <span className="spl-hud spl-hud-tl" />
            <span className="spl-hud spl-hud-tr" />
            <span className="spl-hud spl-hud-bl" />
            <span className="spl-hud spl-hud-br" />

            {/* REC indicator */}
            <div className="spl-rec">
                <span className="spl-rec-dot" />
                <span className="spl-rec-label">REC</span>
            </div>

            {/* Frame counter */}
            <div className="spl-frame-counter">00:00:01:24</div>
        </div>
    );
};

export default SplashScreen;
