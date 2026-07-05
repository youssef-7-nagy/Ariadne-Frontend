import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './PhotographyShowcase.css';

/* ─── Panel data — keep existing images unchanged ─── */
const PANELS = [
    {
        id: 1,
        title: 'WILD LANDSCAPES',
        subtitle: 'Landscape Photography',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=85&w=1800&auto=format&fit=crop',
        floatDelay: 0,
        floatDuration: 6.2,
    },
    {
        id: 2,
        title: 'PORTRAIT STORIES',
        subtitle: 'Portrait Photography',
        img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=85&w=1800&auto=format&fit=crop',
        floatDelay: 0.55,
        floatDuration: 7.0,
    },
    {
        id: 3,
        title: 'MOMENTS IN MOTION',
        subtitle: 'Action Photography',
        img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=85&w=1800&auto=format&fit=crop',
        floatDelay: 1.1,
        floatDuration: 7.6,
    },
];

/* Slow, heavy spring for mouse parallax */
const SPRING_CFG = { damping: 50, stiffness: 65, mass: 1.6 };

/* Panel entrance — slide up from below, staggered */
const panelVariants = {
    hidden: { opacity: 0, y: 70, scale: 0.96 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.3,
            delay: i * 0.22,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/* Position map — matches CSS exactly (top/left/zIndex per panel) */
const POSITIONS = [
    { top: '-20px', left: '-80px', zIndex: 1 },
    { top: '90px',  left: '60px',  zIndex: 2 },
    { top: '200px', left: '200px', zIndex: 3 },
];

/* ─── Component ─── */
export default function PhotographyShowcase() {
    const sectionRef = useRef(null);

    /* Mouse tracking (normalized –0.5 → +0.5) */
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const springX = useSpring(rawX, SPRING_CFG);
    const springY = useSpring(rawY, SPRING_CFG);

    /* Tiny extra tilt that follows cursor — subtle but alive */
    const extraRotX = useTransform(springY, [-0.5, 0.5], [3.5, -3.5]);
    const extraRotY = useTransform(springX, [-0.5, 0.5], [-5,   5  ]);

    const onMouseMove = (e) => {
        const r = sectionRef.current?.getBoundingClientRect();
        if (!r) return;
        rawX.set((e.clientX - r.left) / r.width  - 0.5);
        rawY.set((e.clientY - r.top)  / r.height - 0.5);
    };
    const onMouseLeave = () => { rawX.set(0); rawY.set(0); };

    return (
        <section
            className="pfp-section"
            ref={sectionRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className="pfp-scene">
                {/*
                  Mouse parallax wrapper.
                  The base rotation (rotateX/Y) and scale live in CSS on .pfp-inner.
                  Framer Motion adds the tiny cursor-following delta on a nested div.
                */}
                <div className="pfp-inner">
                    <motion.div
                        style={{
                            rotateX: extraRotX,
                            rotateY: extraRotY,
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {PANELS.map((panel, i) => (
                        /* Entrance animation — positioned to match CSS layout */
                        <motion.div
                            key={panel.id}
                            custom={i}
                            variants={panelVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            style={{
                                position: 'absolute',
                                top:     POSITIONS[i].top,
                                left:    POSITIONS[i].left,
                                zIndex:  POSITIONS[i].zIndex,
                                width:   '820px',
                                height:  '500px',
                            }}
                        >
                            {/* Continuous float — each panel at a different speed */}
                            <motion.div
                                animate={{ y: [0, -11, 0] }}
                                transition={{
                                    duration: panel.floatDuration,
                                    delay:    panel.floatDelay,
                                    repeat:   Infinity,
                                    ease:     'easeInOut',
                                }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <div className={`pfp-panel pfp-panel-${panel.id}`}>
                                    {/* Full-bleed photograph */}
                                    <img
                                        src={panel.img}
                                        alt={panel.title}
                                        className="pfp-img"
                                        loading="lazy"
                                    />

                                    {/* Glass gloss */}
                                    <div className="pfp-gloss" />

                                    {/* Bottom text overlay */}
                                    <div className="pfp-overlay">
                                        <div className="pfp-text">
                                            <h3 className="pfp-title">{panel.title}</h3>
                                            <p  className="pfp-subtitle">{panel.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
