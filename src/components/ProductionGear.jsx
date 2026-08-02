import React from 'react';
import { motion } from 'framer-motion';
import {
    FaCamera,
    FaFilm,
    FaPalette,
    FaMicrophone,
    FaBolt,
    FaMoon,
    FaWandMagicSparkles
} from 'react-icons/fa6';
import './ProductionGear.css';
import ourCamera from '../assets/trusted leaders/our-camera.jpeg';

const GEAR_FEATURES = [
    {
        icon: FaCamera,
        title: 'Ultra High Resolution',
        description: 'Advanced large-format sensors capture every microscopic detail and texture with pristine, lifelike clarity.'
    },
    {
        icon: FaFilm,
        title: 'Cinematic Video Quality',
        description: 'Exceptional dynamic range and native depth of field that deliver high-end theatrical visuals.'
    },
    {
        icon: FaPalette,
        title: 'Exceptional Color Accuracy',
        description: 'Advanced color science preserves authentic skin tones, true gradients, and accurate color values.'
    },
    {
        icon: FaMicrophone,
        title: 'Professional Audio Capture',
        description: 'Premium on-set recording equipment preserves clean, directional dialogue and immersive soundscapes.'
    },
    {
        icon: FaBolt,
        title: 'Fast & Reliable Performance',
        description: 'High-speed media and robust camera engineering allow us to shoot confidently in any environment.'
    },
    {
        icon: FaMoon,
        title: 'Excellent Low-Light Capability',
        description: 'State-of-the-art low-noise sensors preserve clean, rich detail in challenging high-contrast shadows.'
    }
];

export default function ProductionGear() {
    return (
        <section className="pg-section">
            <div className="pg-container">
                
                {/* Center Header */}
                <div className="pg-header">
                    <span className="pg-eyebrow">
                        <FaWandMagicSparkles size={12} style={{ color: '#c8a96a' }} />
                        PRODUCTION GEAR
                    </span>
                    <h2 className="pg-title">
                        World-Class Tools. <span>Cinematic Precision.</span>
                    </h2>
                </div>

                <div className="pg-grid">
                    
                    {/* Left side: Showcase Image Card with Viewfinder HUD */}
                    <motion.div
                        className="pg-image-col"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="pg-image-card">
                            <img src={ourCamera} alt="Ariadne Professional Cinema Camera Rig" className="pg-img" />
                            
                            {/* Rule of Thirds Composition Guide Lines */}
                            <div className="pg-composition-guides">
                                <div className="pg-guide-line pg-h-line-1" />
                                <div className="pg-guide-line pg-h-line-2" />
                                <div className="pg-guide-line pg-v-line-1" />
                                <div className="pg-guide-line pg-v-line-2" />
                            </div>

                            {/* Center focus indicator crosshair */}
                            <div className="pg-focus-crosshair" />

                            <div className="pg-viewfinder" />
                            
                            {/* Top Camera Telemetry Row */}
                            <div className="pg-cam-telemetry-top">
                                <span>TC 01:42:09:15</span>
                                <span>5600K</span>
                                <span>FPS 23.976</span>
                            </div>

                            {/* Bottom Camera Telemetry Row */}
                            <div className="pg-cam-telemetry-bottom">
                                <span className="pg-overlay-tech">8K RAW  |  16-BIT</span>
                                <span className="pg-overlay-status">● REC</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side: Content & Specs Table */}
                    <div className="pg-content-col">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="pg-desc">
                                Great storytelling starts with professional tools. We invest in industry-standard cinema cameras, high-resolving lenses, and advanced stabilization gear because every frame depends on precision.
                            </p>
                        </motion.div>

                        {/* Technical Spec Telemetry Table */}
                        <motion.div 
                            className="pg-specs-table"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="pg-spec-row">
                                <span className="pg-spec-label">DYNAMIC RANGE</span>
                                <span className="pg-spec-val">17+ stops (Dual Gain)</span>
                            </div>
                            <div className="pg-spec-row">
                                <span className="pg-spec-label">COLOR SCIENCE</span>
                                <span className="pg-spec-val">16-Bit Color Space</span>
                            </div>
                            <div className="pg-spec-row">
                                <span className="pg-spec-label">LENS COMPATIBILITY</span>
                                <span className="pg-spec-val">PL & EF Cinema Mounts</span>
                            </div>
                        </motion.div>

                        {/* Specs Grid — 3 Cards per row */}
                        <div className="pg-features-grid">
                            {GEAR_FEATURES.map((feat, idx) => {
                                const Icon = feat.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        className="pg-feature-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="pg-card-icon-wrap">
                                            <Icon size={18} className="pg-card-icon" />
                                        </div>
                                        <div className="pg-card-content">
                                            <h3 className="pg-card-title">{feat.title}</h3>
                                            <p className="pg-card-desc">{feat.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* CTA Action */}
                <motion.div
                    className="pg-cta-wrap"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <a href="#portfolio" className="pg-cta-btn">
                        Discover Our Production Process
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
