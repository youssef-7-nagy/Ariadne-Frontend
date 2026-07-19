import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import "./PortfolioShowcase.css";

/* ─── Card definitions — replace src with your own images ─── */
const CARDS = [
    {
        id: 1,
        src: "",          // ← add your image URL here
        label: "Project One",
        tag: "Photography",
    },
    {
        id: 2,
        src: "",          // ← add your image URL here
        label: "Project Two",
        tag: "Cinematics",
    },
    {
        id: 3,
        src: "",          // ← add your image URL here
        label: "Project Three",
        tag: "Commercial",
    },
];

const SPRING = { damping: 55, stiffness: 60, mass: 1.8 };

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.94 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.2,
            delay: i * 0.18,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const textVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
    }),
};

const OFFSETS = [
    { top: "-30px", left: "-110px", z: -200, zIndex: 1 },
    { top: "100px",  left:  "40px", z:    0, zIndex: 2 },
    { top: "230px", left: "190px", z:  200, zIndex: 3 },
];

export default function PortfolioShowcase() {
    const wrapperRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const springX = useSpring(rawX, SPRING);
    const springY = useSpring(rawY, SPRING);
    const extraRotX = useTransform(springY, [-0.5, 0.5], [4, -4]);
    const extraRotY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

    const onMouseMove = (e) => {
        const r = wrapperRef.current?.getBoundingClientRect();
        if (!r) return;
        rawX.set((e.clientX - r.left) / r.width - 0.5);
        rawY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onMouseLeave = () => { rawX.set(0); rawY.set(0); setHovered(false); };

    return (
        <section className="pfs-section">
            <div className="pfs-blob pfs-blob-a" aria-hidden="true" />
            <div className="pfs-blob pfs-blob-b" aria-hidden="true" />

            <div className="pfs-inner">
                {/* ── Left: Text ── */}
                <div className="pfs-text-side">
                    <motion.span
                        className="pfs-eyebrow"
                        custom={0}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        Featured Work
                    </motion.span>

                    <motion.h2
                        className="pfs-heading"
                        custom={1}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        Stories We have{" "}<br />
                        <span className="pfs-heading-accent">Brought to Life</span>
                    </motion.h2>

                    <motion.p
                        className="pfs-desc"
                        custom={2}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        Every frame is a deliberate choice. Browse a curated selection
                        of our cinematic photography, commercial campaigns, and
                        documentary work crafted for brands that demand excellence.
                    </motion.p>

                    <motion.div
                        custom={3}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        <Link to="/portfolio" className="pfs-btn" id="pfs-view-projects-btn">
                            <span>View All Projects</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="pfs-stats"
                        custom={4}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        <div className="pfs-stat">
                            <strong>200+</strong>
                            <span>Projects</span>
                        </div>
                        <div className="pfs-stat-divider" />
                        <div className="pfs-stat">
                            <strong>50+</strong>
                            <span>Clients</span>
                        </div>
                        <div className="pfs-stat-divider" />
                        <div className="pfs-stat">
                            <strong>8+</strong>
                            <span>Years</span>
                        </div>
                    </motion.div>
                </div>

                {/* ── Right: 3D card stack ── */}
                <div
                    className="pfs-cards-side"
                    ref={wrapperRef}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onMouseEnter={() => setHovered(true)}
                >
                    <div className="pfs-scene">
                        <div className="pfs-pivot">
                            <motion.div
                                style={{
                                    rotateX: extraRotX,
                                    rotateY: extraRotY,
                                    width: "100%",
                                    height: "100%",
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {CARDS.map((card, i) => (
                                    <motion.div
                                        key={card.id}
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-60px" }}
                                        style={{
                                            position: "absolute",
                                            top: OFFSETS[i].top,
                                            left: OFFSETS[i].left,
                                            zIndex: OFFSETS[i].zIndex,
                                            width: "640px",
                                            height: "400px",
                                        }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -12, 0] }}
                                            transition={{
                                                duration: 5.5 + i * 0.8,
                                                delay: i * 0.6,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            style={{ width: "100%", height: "100%" }}
                                        >
                                            <div
                                                className={`pfs-card pfs-card-${card.id} ${hovered ? "pfs-spread" : ""}`}
                                                style={{ "--depth": `${OFFSETS[i].z}px` }}
                                            >
                                                {card.src ? (
                                                    <img
                                                        src={card.src}
                                                        alt={card.label}
                                                        className="pfs-card-img"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="pfs-card-empty">
                                                        <div className="pfs-empty-icon">
                                                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                                <polyline points="21 15 16 10 5 21"/>
                                                            </svg>
                                                        </div>
                                                        <p className="pfs-empty-label">{card.label}</p>
                                                        <span className="pfs-empty-hint">Add image URL to CARDS array</span>
                                                    </div>
                                                )}

                                                <div className="pfs-gloss" aria-hidden="true" />

                                                <div className="pfs-card-overlay">
                                                    <span className="pfs-card-tag">{card.tag}</span>
                                                    <h4 className="pfs-card-title">{card.label}</h4>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
