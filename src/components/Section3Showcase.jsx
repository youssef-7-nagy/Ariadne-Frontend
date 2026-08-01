import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import './Section3Showcase.css';

import section301 from '../assets/home/section301.jpg';
import section302 from '../assets/home/section302.jpg';
import section303 from '../assets/home/section303.jpg';

const SHOWCASE_ITEMS = [
    {
        id: 'card-1',
        number: '01',
        tag: 'PHOTOGRAPHY',
        title: 'ROMANTIC CHIPPING',
        subtitle: 'Authentic human emotion, quiet moments & raw natural atmosphere.',
        img: section301,
        fallbackImg: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1200&auto=format&fit=crop',
        slug: 'photography',
        accentColor: '#ff6b35'
    },
    {
        id: 'card-2',
        number: '02',
        tag: 'CINEMATIC',
        title: 'THE POWER OF DREAMS',
        subtitle: 'Short films and documentaries crafted with rich narrative color grading.',
        img: section302,
        fallbackImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
        slug: 'short-films',
        accentColor: '#e0a96d'
    },
    {
        id: 'card-3',
        number: '03',
        tag: 'COMMERCIAL',
        title: 'THE DRIVE OF YOUR LIFE',
        subtitle: 'High-octane commercial campaigns and visual brand storytelling.',
        img: section303,
        fallbackImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
        slug: 'commercials',
        accentColor: '#4a90e2'
    }
];

const SPRING_CONFIG = { damping: 30, stiffness: 120, mass: 0.8 };

export default function Section3Showcase() {
    const [distributionMode, setDistributionMode] = useState('cascade'); // 'cascade' | 'fan' | 'grid'
    const sectionRef = useRef(null);

    // Mouse tracking for 3D parallax tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, SPRING_CONFIG);
    const springY = useSpring(mouseY, SPRING_CONFIG);

    const tiltX = useTransform(springY, [-0.5, 0.5], [8, -8]);
    const tiltY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

    const handleMouseMove = (e) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(normX);
        mouseY.set(normY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <section
            className="s3-section"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Lighting Background */}
            <div className="s3-ambient-bg">
                <div className="s3-glow s3-glow-orange" />
                <div className="s3-glow s3-glow-blue" />
                <div className="s3-grid-pattern" />
            </div>

            <div className="s3-container">
                {/* Header & Mode Switcher Controls */}
                <div className="s3-header">
                    <div className="s3-title-block">
                        <span className="s3-eyebrow">
                            <Sparkles className="s3-sparkle-icon" size={14} />
                            FEATURED VISUAL WORKS
                        </span>
                        <h2 className="s3-main-title">Crafting Visual Stories</h2>
                        <p className="s3-subtitle">
                            Distribute and explore our signature photography, cinematic films, and commercial productions.
                        </p>
                    </div>

                    {/* Interactive Distribution Mode Selector */}
                    <div className="s3-mode-selector">
                        <button
                            className={`s3-mode-btn ${distributionMode === 'cascade' ? 'active' : ''}`}
                            onClick={() => setDistributionMode('cascade')}
                            title="3D Cascade Depth Distribution"
                        >
                            <Layers size={16} />
                            <span>3D Cascade</span>
                        </button>
                        <button
                            className={`s3-mode-btn ${distributionMode === 'fan' ? 'active' : ''}`}
                            onClick={() => setDistributionMode('fan')}
                            title="Floating Fan Arch Distribution"
                        >
                            <Sparkles size={16} />
                            <span>Floating Fan</span>
                        </button>
                        <button
                            className={`s3-mode-btn ${distributionMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setDistributionMode('grid')}
                            title="Asymmetric Editorial Grid Distribution"
                        >
                            <LayoutGrid size={16} />
                            <span>Editorial Grid</span>
                        </button>
                    </div>
                </div>

                {/* Stage Area for Cards Distribution */}
                <motion.div
                    className={`s3-stage s3-stage-${distributionMode}`}
                    style={{
                        rotateX: distributionMode !== 'grid' ? tiltX : 0,
                        rotateY: distributionMode !== 'grid' ? tiltY : 0,
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={distributionMode}
                            className={`s3-cards-wrapper s3-layout-${distributionMode}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {SHOWCASE_ITEMS.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className={`s3-card s3-card-${index + 1}`}
                                    layout
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.25, 1, 0.5, 1],
                                        delay: index * 0.08
                                    }}
                                >
                                    <div className="s3-card-inner">
                                        {/* Image layer */}
                                        <img
                                            src={item.img}
                                            onError={(e) => { e.target.src = item.fallbackImg; }}
                                            alt={item.title}
                                            className="s3-card-img"
                                        />

                                        {/* Overlays */}
                                        <div className="s3-card-gradient" />
                                        <div className="s3-glass-shimmer" />
                                        <div className="s3-edge-highlight" />

                                        {/* Card Top Row Badges */}
                                        <div className="s3-card-header">
                                            <span className="s3-card-tag">{item.tag}</span>
                                            <span className="s3-card-num">{item.number}</span>
                                        </div>

                                        {/* Card Footer Content */}
                                        <div className="s3-card-body">
                                            <div className="s3-accent-bar" style={{ backgroundColor: item.accentColor }} />
                                            <h3 className="s3-card-title">{item.title}</h3>
                                            <p className="s3-card-desc">{item.subtitle}</p>

                                            <Link to={`/portfolio/${item.slug}`} className="s3-card-link">
                                                <span>Explore Work</span>
                                                <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Floor Reflection Effect for 3D modes */}
                    {distributionMode !== 'grid' && (
                        <div className="s3-floor-reflection" />
                    )}
                </motion.div>
            </div>
        </section>
    );
}
