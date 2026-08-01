import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaFilm, FaWandMagicSparkles, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa6';
import './MeetTheMinds.css';

import imgLeo from '../assets/meet-the-minds/leo.jpg';
import imgPierre from '../assets/meet-the-minds/pierre.jpg';
import imgRamsis from '../assets/meet-the-minds/ramsis.jpg';
import imgTante from '../assets/meet-the-minds/tante.jpg';
import imgGirl1 from '../assets/meet-the-minds/girl1.jpg';
import imgBoy from '../assets/meet-the-minds/boy.jpg';
import imgBoy1 from '../assets/meet-the-minds/boy1.jpg';

const TEAM_MEMBERS = [
    {
        id: 'leo',
        name: 'Leonarda Hanna',
        role: 'Lead Photographer & Founder',
        badge: 'PHOTOGRAPHY',
        bio: 'Leonarda Hanna brings raw artistic passion, cinematic composition, and a relentless eye for detail to every shoot. Specializing in high-end fashion, editorial portraits, and visual storytelling, he turns split seconds into timeless visual art.',
        img: imgLeo,
        accentColor: '#7c3aed',
        icon: FaCamera,
    },
    {
        id: 'pierre',
        name: 'Pierre',
        role: 'Senior Cinematographer & Director',
        badge: 'CINEMATOGRAPHY',
        bio: 'Pierre oversees Ariadne’s motion productions and cinematic film direction. With deep expertise in mood lighting, camera choreography, and narrative grading, he creates compelling visual stories for world-class brands.',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: FaFilm,
    },
    {
        id: 'ramsis',
        name: 'Ramsis',
        role: 'Creative Producer & Operations Head',
        badge: 'PRODUCTION',
        bio: 'Ramsis bridges creative ambition with flawless execution. Managing large-scale commercial sets and logistics, he ensures every project operates seamlessly from pre-production to final delivery.',
        img: imgRamsis,
        accentColor: '#ff6b35',
        icon: FaWandMagicSparkles,
    },
    {
        id: 'tante',
        name: 'Madame Tante',
        role: 'Executive Partner & Strategy Director',
        badge: 'STRATEGY',
        bio: 'Guiding high-level client partnerships and agency vision, Tante ensures Ariadne continues pushing creative boundaries while cultivating long-term relationships with industry leaders.',
        img: imgTante,
        accentColor: '#e0a96d',
        icon: FaWandMagicSparkles,
    },
    {
        id: 'sara',
        name: 'Sara Khalil',
        role: 'Art Director & Stylist',
        badge: 'ART DIRECTION',
        bio: 'Sara shapes the visual harmony of every concept. From color palettes to set design, her aesthetic direction elevates brand identities into unforgettable visual experiences.',
        img: imgGirl1,
        accentColor: '#ec4899',
        icon: FaCamera,
    },
    {
        id: 'mark',
        name: 'Mark',
        role: 'Lighting & Aerial Director',
        badge: 'TECHNICAL',
        bio: 'Mastering high-tech camera rigs, complex studio lighting, and drone aerial cinematography to capture impossible angles and dynamic environments.',
        img: imgBoy,
        accentColor: '#10b981',
        icon: FaFilm,
    },
    {
        id: 'david',
        name: 'David',
        role: 'Lead Colorist & Post Director',
        badge: 'POST PRODUCTION',
        bio: 'Transforming raw footage into polished, cinema-grade masterpieces with meticulous color science, sound design, and visual effects.',
        img: imgBoy1,
        accentColor: '#8b5cf6',
        icon: FaFilm,
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
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
                                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
