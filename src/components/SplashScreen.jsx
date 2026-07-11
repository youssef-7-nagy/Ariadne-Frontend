import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('idle'); // idle → expand → reveal → fadeout

    useEffect(() => {
        // Phase timeline (mimics app launch feel)
        const t1 = setTimeout(() => setPhase('expand'),  300);   // logo icon scales up
        const t2 = setTimeout(() => setPhase('reveal'),  1100);  // wordmark slides in
        const t3 = setTimeout(() => setPhase('fadeout'), 3200);  // everything fades out
        const t4 = setTimeout(() => { if (onFinish) onFinish(); }, 4000); // unmount

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, []);

    return (
        <div className={`sp-wrapper ${phase === 'fadeout' ? 'sp-fadeout' : ''}`}>
            {/* Particle ambient orbs */}
            <div className="sp-orb sp-orb-1" />
            <div className="sp-orb sp-orb-2" />
            <div className="sp-orb sp-orb-3" />

            {/* Scan line effect */}
            <div className={`sp-scanline ${phase !== 'idle' ? 'sp-scanline-active' : ''}`} />

            {/* Main card */}
            <div className={`sp-card ${phase !== 'idle' ? 'sp-card-active' : ''}`}>
                {/* Animated border */}
                <div className={`sp-border sp-border-top    ${phase === 'reveal' || phase === 'fadeout' ? 'sp-border-visible' : ''}`} />
                <div className={`sp-border sp-border-right  ${phase === 'reveal' || phase === 'fadeout' ? 'sp-border-visible' : ''}`} />
                <div className={`sp-border sp-border-bottom ${phase === 'reveal' || phase === 'fadeout' ? 'sp-border-visible' : ''}`} />
                <div className={`sp-border sp-border-left   ${phase === 'reveal' || phase === 'fadeout' ? 'sp-border-visible' : ''}`} />

                {/* Logo area */}
                <div className="sp-logo-area">
                    {/* ── Icon mark (the "A" letterform) ── */}
                    <div className={`sp-icon-wrap ${phase !== 'idle' ? 'sp-icon-expanded' : ''}`}>
                        {/* Stylised "Ar" monogram as SVG */}
                        <svg className="sp-monogram" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Outer glow ring */}
                            <circle cx="30" cy="30" r="28" stroke="#bd9f67" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />
                            {/* "A" shape */}
                            <path d="M12 46 L30 14 L48 46" stroke="#bd9f67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            <path d="M18.5 36 L41.5 36" stroke="#bd9f67" strokeWidth="2" strokeLinecap="round"/>
                            {/* Centre dot */}
                            <circle cx="30" cy="14" r="2" fill="#bd9f67" />
                        </svg>

                        {/* Shimmer trail on hover/expand */}
                        <div className={`sp-shimmer ${phase === 'expand' || phase === 'reveal' ? 'sp-shimmer-active' : ''}`} />
                    </div>

                    {/* ── Full wordmark — slides in after expand ── */}
                    <div className={`sp-wordmark-wrap ${phase === 'reveal' || phase === 'fadeout' ? 'sp-wordmark-visible' : ''}`}>
                        {/* Letter-by-letter "ARIADNE" */}
                        {'ARIADNE'.split('').map((letter, i) => (
                            <span
                                key={i}
                                className="sp-letter"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                {letter}
                            </span>
                        ))}
                        {/* Cursor blink */}
                        <span className={`sp-cursor ${phase === 'reveal' ? 'sp-cursor-blink' : 'sp-cursor-hide'}`}>|</span>
                    </div>
                </div>

                {/* Tag line */}
                <p className={`sp-tagline ${phase === 'reveal' || phase === 'fadeout' ? 'sp-tagline-visible' : ''}`}>
                    cinematic · visual storytelling
                </p>

                {/* Bottom text (like the reference "universe of ui") */}
                <span className={`sp-bottom-text ${phase === 'reveal' || phase === 'fadeout' ? 'sp-bottom-visible' : ''}`}>
                    premium cinematography
                </span>

                {/* Loading bar */}
                <div className={`sp-loader-track ${phase !== 'idle' ? 'sp-loader-track-visible' : ''}`}>
                    <div className={`sp-loader-fill ${phase === 'reveal' || phase === 'fadeout' ? 'sp-loader-complete' : ''}`} />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
