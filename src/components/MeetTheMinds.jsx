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
        bio: 'Pierre directs Ariadne’s high-end commercial films and cinematic narratives. With deep expertise in camera choreography, lighting design, and creative grading, he translates brand visions into premium, moving visual experiences.',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: FaFilm,
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Lead Editor & Post Director',
        badge: 'POST-PRODUCTION',
        bio: 'Fady leads the post-production department, managing Ariadne’s film editing and coloring pipeline. His technical expertise in sound design, pacing, and color science ensures every film is a polished, cinema-grade masterpiece.',
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
        bio: 'John commands the complex setups behind Ariadne’s signature lighting and technical operations. Specializing in drone aerials and high-speed camera rigs, he captures dynamic perspectives on set.',
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

export default function MeetTheMinds() {
    return (
        <section className="mtm-section">
            <div className="mtm-container">
                {/* Header */}
                <div className="mtm-header">
                    <span className="mtm-eyebrow">
                        <FaWandMagicSparkles size={14} />
                        OUR CREATIVE FORCE
                    </span>
                    <h2 className="mtm-title">Meet The <span>Minds</span></h2>
                    <p className="mtm-subtitle">
                        The visionaries, directors, and artists behind the lens — shaping Ariadne’s visual truth.
                    </p>
                </div>

                {/* Team Rows - Alternating Left / Right */}
                <div className="mtm-rows">
                    {TEAM_MEMBERS.map((member, index) => {
                        const isEven = index % 2 === 0; // Even = Image Left, Bio Right. Odd = Bio Left, Image Right.
                        const IconComponent = member.icon;

                        return (
                            <div
                                key={member.id}
                                className={`mtm-row ${isEven ? 'row-left' : 'row-right'}`}
                            >
                                {/* Image Box */}
                                <motion.div
                                    className="mtm-img-col"
                                    initial={{ opacity: 0, x: isEven ? -90 : 90 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="mtm-img-card">
                                        <img src={member.img} alt={member.name} className="mtm-img" />
                                        <div className="mtm-img-glass" />
                                        <div className="mtm-img-glow" style={{ backgroundColor: member.accentColor }} />
                                        <span className="mtm-badge" style={{ backgroundColor: member.accentColor }}>
                                            {member.badge}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Content Box */}
                                <motion.div
                                    className="mtm-content-col"
                                    initial={{ opacity: 0, x: isEven ? 90 : -90 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="mtm-content-inner">
                                        <div className="mtm-icon-tag" style={{ color: member.accentColor }}>
                                            <IconComponent size={20} />
                                        </div>
                                        <h3 className="mtm-name">{member.name}</h3>
                                        <h4 className="mtm-role" style={{ color: member.accentColor }}>{member.role}</h4>
                                        <div className="mtm-divider" style={{ backgroundColor: member.accentColor }} />
                                        <p className="mtm-bio">{member.bio}</p>

                                        <div className="mtm-socials">
                                            <a href="#instagram" className="mtm-social-link" title="Instagram">
                                                <FaInstagram size={17} />
                                            </a>
                                            <a href="#linkedin" className="mtm-social-link" title="LinkedIn">
                                                <FaLinkedin size={17} />
                                            </a>
                                            <a href="#contact" className="mtm-social-link" title="Email">
                                                <FaEnvelope size={17} />
                                            </a>
                                        </div>
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
