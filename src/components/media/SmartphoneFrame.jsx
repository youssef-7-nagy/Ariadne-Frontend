import React from 'react';
import './SmartphoneFrame.css';

/**
 * SmartphoneFrame
 * 
 * A realistic, minimal smartphone frame mockup for portrait videos, vertical short films,
 * and vertical cinematic media in the portfolio.
 * 
 * Features:
 * - Sleek black chassis with tactile power button on right edge
 * - Authentic top notch with subtle speaker slit & front camera lens
 * - Minimal home indicator bar at the bottom
 * - Rounded inner display with strict clipping (overflow: hidden)
 * - Zero lockscreen clutter (no clock, date, fingerprint, or lockscreen icons)
 * - Proportional responsive scaling across Desktop, Tablet, and Mobile
 */
export const SmartphoneFrame = ({
    children,
    className = '',
    style = {},
    showNotch = true,
    showHomeBar = true
}) => {
    return (
        <div className={`sp-frame-container ${className}`} style={style}>
            {/* Outer phone chassis */}
            <div className="sp-phone-body">
                {/* Physical side button (Power / Lock) */}
                <div className="sp-side-button sp-side-button--power" aria-hidden="true" />
                
                {/* Physical side buttons (Volume Up / Down) */}
                <div className="sp-side-button sp-side-button--vol-up" aria-hidden="true" />
                <div className="sp-side-button sp-side-button--vol-down" aria-hidden="true" />

                {/* Inner screen display */}
                <div className="sp-phone-screen">
                    {/* Top sensor notch / island */}
                    {showNotch && (
                        <div className="sp-phone-notch" aria-hidden="true">
                            <div className="sp-notch-speaker" />
                            <div className="sp-notch-camera" />
                        </div>
                    )}

                    {/* Media content slot (Video / Image / Custom Player) */}
                    <div className="sp-screen-content">
                        {children}
                    </div>

                    {/* Bottom home indicator bar */}
                    {showHomeBar && (
                        <div className="sp-home-indicator" aria-hidden="true" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartphoneFrame;
