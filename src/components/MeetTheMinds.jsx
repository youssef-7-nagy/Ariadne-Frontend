import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaFilm, FaWandMagicSparkles, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa6';
import './MeetTheMinds.css';

import imgLeo from '../assets/meet-the-minds/Léonardo HANNA.jpg';
import imgPierre from '../assets/meet-the-minds/Pierre TOMA.jpg';
import imgFady from '../assets/meet-the-minds/Fady BARSSOUM.jpg';
import imgRamsis from '../assets/meet-the-minds/Ramsis HANNA.jpg';
import imgSamah from '../assets/meet-the-minds/Samah TADROS.jpg';
import imgJohn from '../assets/meet-the-minds/John ZAKI.jpg';
import imgMaria from '../assets/meet-the-minds/Maria ARTINE.jpg';

const TEAM_MEMBERS = [
    {
        id: 'leo',
        name: 'Léonardo HANNA',
        role: 'Founder & Principal Photographer',
        badge: 'PHOTOGRAPHY',
        bio: 'Founder of Ariadne. Léonardo brings raw artistic passion, precise composition, and a relentless eye for detail to every shoot. Specializing in high-end editorial portraits, commercial campaigns, and visual storytelling, he turns brief moments into timeless visual art.',
        img: imgLeo,
        accentColor: '#7c3aed',
        icon: FaCamera,
    },
    {
        id: 'pierre',
        name: 'Pierre TOMA',
        role: 'Director of Cinematography',
        badge: 'CINEMATOGRAPHY',
        bio: 'Pierre directs Ariadne\u2019s high-end commercial films and cinematic narratives. With deep expertise in camera choreography, lighting design, and creative grading, he translates brand visions into premium, moving visual experiences.',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: FaFilm,
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Lead Editor & Post Director',
        badge: 'POST-PRODUCTION',
        bio: 'Fady leads the post-production department, managing Ariadne\u2019s film editing and coloring pipeline. His technical expertise in sound design, pacing, and color science ensures every film is a polished, cinema-grade masterpiece.',
        img: imgFady,
        accentColor: '#10b981',
        icon: FaWandMagicSparkles,
    },
    {
        id: 'ramsis',
        name: 'Ramsis HANNA',
        role: 'Creative Producer & Operations Head',
        badge: 'PRODUCTION',
        bio: 'Ramsis bridges creative vision with seamless execution. Overseeing logistics, budgeting, and set operations for all commercial shoots, he keeps Ariadne\'s productions organized and running on schedule.',
        img: imgRamsis,
        accentColor: '#ff6b35',
        icon: FaWandMagicSparkles,
    },
    {
        id: 'samah',
        name: 'Samah TADROS',
        role: 'Art Director & Stylist',
        badge: 'ART DIRECTION',
        bio: 'Samah orchestrates the visual styling and aesthetic theme of every project. By coordinating set designs, fashion elements, and color palettes, she elevates brand imagery into cohesive, high-fashion storytelling.',
        img: imgSamah,
        accentColor: '#ec4899',
        icon: FaCamera,
    },
    {
        id: 'john',
        name: 'John ZAKI',
        role: 'Lighting & Technical Lead',
        badge: 'TECHNICAL',
        bio: 'John commands the complex setups behind Ariadne\u2019s signature lighting and technical operations. Specializing in drone aerials and high-speed camera rigs, he captures dynamic perspectives on set.',
        img: imgJohn,
        accentColor: '#e0a96d',
        icon: FaFilm,
    },
    {
        id: 'maria',
        name: 'Maria ARTINE',
        role: 'Production Coordinator & Client Lead',
        badge: 'COORDINATION',
        bio: 'Maria manages client communications and ensures production plans align perfectly with client expectations. Her focus on detail guarantees that every project deliverable meets Ariadne\'s premium standards.',
        img: imgMaria,
        accentColor: '#8b5cf6',
        icon: FaWandMagicSparkles,
    }
];

/* ── Spring easing curve ── */
const springTransition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] };

export default function MeetTheMinds() {
    return (
        <section className="mtm-section">
            {/* Decorative background elements */}
            <div className="mtm-bg-orb mtm-bg-orb--1" />
            <div className="mtm-bg-orb mtm-bg-orb--2" />
            <div className="mtm-bg-line" />

            <div className="mtm-container">
                {/* Header */}
                <motion.div
                    className="mtm-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="mtm-eyebrow">
                        <FaWandMagicSparkles size={14} />
                        OUR CREATIVE FORCE
                    </span>
                    <h2 className="mtm-title">Meet The <span>Minds</span></h2>
                    <p className="mtm-subtitle">
                        The visionaries, directors, and artists behind the lens — shaping Ariadne's visual truth.
                    </p>
                </motion.div>

                {/* Team Rows - Alternating Left / Right */}
                <div className="mtm-rows">
                    {TEAM_MEMBERS.map((member, index) => {
                        const isEven = index % 2 === 0;
                        const IconComponent = member.icon;
                        const memberNum = String(index + 1).padStart(2, '0');

                        return (
                            <div
                                key={member.id}
                                className={`mtm-row ${isEven ? 'row-left' : 'row-right'}`}
                            >
                                {/* Image Box */}
                                <motion.div
                                    className="mtm-img-col"
                                    initial={{ opacity: 0, x: isEven ? -120 : 120, rotate: isEven ? -3 : 3 }}
                                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ ...springTransition }}
                                >
                                    <div className="mtm-img-card" style={{ '--accent': member.accentColor }}>
                                        <img src={member.img} alt={member.name} className="mtm-img" />
                                        <div className="mtm-img-glass" />
                                        <div className="mtm-img-glow" style={{ backgroundColor: member.accentColor }} />
                                        <span className="mtm-badge" style={{ backgroundColor: member.accentColor }}>
                                            {member.badge}
                                        </span>
                                        {/* Large number watermark */}
                                        <span className="mtm-num">{memberNum}</span>
                                    </div>
                                </motion.div>

                                {/* Content Box */}
                                <motion.div
                                    className="mtm-content-col"
                                    initial={{ opacity: 0, x: isEven ? 120 : -120 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ ...springTransition, delay: 0.2 }}
                                >
                                    <div className="mtm-content-inner">
                                        {/* Accent line + icon */}
                                        <motion.div
                                            className="mtm-accent-bar"
                                            style={{ backgroundColor: member.accentColor }}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: 0.5 }}
                                        />

                                        <div className="mtm-icon-tag" style={{ color: member.accentColor, borderColor: `${member.accentColor}33`, background: `${member.accentColor}12` }}>
                                            <IconComponent size={20} />
                                        </div>

                                        <motion.h3
                                            className="mtm-name"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.35 }}
                                        >
                                            {member.name}
                                        </motion.h3>

                                        <motion.h4
                                            className="mtm-role"
                                            style={{ color: member.accentColor }}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.45 }}
                                        >
                                            {member.role}
                                        </motion.h4>

                                        <div className="mtm-divider" style={{ backgroundColor: member.accentColor }} />

                                        <motion.p
                                            className="mtm-bio"
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.55 }}
                                        >
                                            {member.bio}
                                        </motion.p>

                                        <motion.div
                                            className="mtm-socials"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.65 }}
                                        >
                                            <a href="#instagram" className="mtm-social-link" title="Instagram" style={{ '--hover-color': member.accentColor }}>
                                                <FaInstagram size={17} />
                                            </a>
                                            <a href="#linkedin" className="mtm-social-link" title="LinkedIn" style={{ '--hover-color': member.accentColor }}>
                                                <FaLinkedin size={17} />
                                            </a>
                                            <a href="#contact" className="mtm-social-link" title="Email" style={{ '--hover-color': member.accentColor }}>
                                                <FaEnvelope size={17} />
                                            </a>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
