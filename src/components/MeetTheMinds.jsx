import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaCamera, 
    FaFilm, 
    FaWandMagicSparkles, 
    FaVideo, 
    FaMicrophone, 
    FaPenNib, 
    FaPalette, 
    FaMusic, 
    FaBullhorn,
    FaBriefcase,
    FaClipboardList
} from 'react-icons/fa6';
import { GiSoundWaves } from 'react-icons/gi';
import { LuClapperboard } from 'react-icons/lu';
import './MeetTheMinds.css';

import imgLeo from '../assets/meet-the-minds/Léonardo HANNA.jpg';
import imgPierre from '../assets/meet-the-minds/Pierre TOMA.jpg';
import imgFady from '../assets/meet-the-minds/Fady BARSSOUM.jpg';
import imgRamsis from '../assets/meet-the-minds/Ramsis HANNA.jpeg';
import imgSamah from '../assets/meet-the-minds/Samah TADROS.jpg';
import imgJohn from '../assets/meet-the-minds/John ZAKI.jpg';
import imgMaria from '../assets/meet-the-minds/Maria ARTINE.jpg';

const TEAM_MEMBERS = [
    {
        id: 'ramsis',
        name: 'Ramsis HANNA',
        role: 'Executive Producer',
        badge: 'EXECUTIVE PRODUCER',
        img: imgRamsis,
        accentColor: '#ff6b35',
        icon: FaBriefcase,
        cameraSpecs: ['PRODUCTION DEPT', 'SET-01'],
        gradientColors: ['#ff6b35', '#f97316'],
    },
    {
        id: 'leo',
        name: 'Léonardo HANNA',
        role: 'Creative Director',
        badge: 'CREATIVE DIRECTION',
        img: imgLeo,
        accentColor: '#7c3aed',
        icon: LuClapperboard,
        cameraSpecs: ['DIRECTING DEPT', '5.6K RAW'],
        gradientColors: ['#7c3aed', '#a78bfa'],
    },
    {
        id: 'maria',
        name: 'Maria ARTINE',
        role: 'Marketing & PR',
        badge: 'BRAND & PR',
        img: imgMaria,
        accentColor: '#8b5cf6',
        icon: FaBullhorn,
        cameraSpecs: ['BRAND STRATEGY', 'GLOBAL PR'],
        gradientColors: ['#8b5cf6', '#c084fc'],
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Director Of Photography',
        badge: 'CINEMATOGRAPHY',
        img: imgFady,
        accentColor: '#10b981',
        icon: FaCamera,
        cameraSpecs: ['CAMERA & LIGHTS', 'DCI-P3 12-BIT'],
        gradientColors: ['#10b981', '#34d399'],
    },
    {
        id: 'samah',
        name: 'Samah TADROS',
        role: 'Production Manager',
        badge: 'PRODUCTION',
        img: imgSamah,
        accentColor: '#ec4899',
        icon: FaClipboardList,
        cameraSpecs: ['LOGISTICS', 'SET MANAGEMENT'],
        gradientColors: ['#ec4899', '#f472b6'],
    },
    {
        id: 'pierre',
        name: 'Pierre TOMA',
        role: 'Sound Engineer',
        badge: 'SOUND DEPT',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: GiSoundWaves,
        cameraSpecs: ['AUDIO MIXING', 'SOUND DESIGN'],
        gradientColors: ['#1392d6', '#60a5fa'],
    },
    {
        id: 'john',
        name: 'John ZAKI',
        role: 'Music Composer',
        badge: 'COMPOSITION',
        img: imgJohn,
        accentColor: '#e0a96d',
        icon: FaMusic,
        cameraSpecs: ['ORIGINAL SCORE', 'COMPOSITION'],
        gradientColors: ['#e0a96d', '#f5d0a9'],
    }
];

export default function MeetTheMinds() {
    // Group members into pairs (2 per line)
    const pairs = [];
    for (let i = 0; i < TEAM_MEMBERS.length; i += 2) {
        pairs.push(TEAM_MEMBERS.slice(i, i + 2));
    }

    return (
        <section className="mtm-section">
            <div className="mtm-container">
                {/* Header */}
                <motion.div 
                    className="mtm-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
                >
                    <span className="mtm-eyebrow">
                        <FaWandMagicSparkles size={14} />
                        OUR CREATIVE FORCE
                    </span>
                    <h2 className="mtm-title">Meet The <span>Minds</span></h2>
                    <p className="mtm-subtitle">
                        The visionaries, directors, and artists behind the lens — shaping Ariadne’s visual truth.
                    </p>
                </motion.div>

                {/* Team Grid Rows (2 Owners Per Line) */}
                <div className="mtm-grid-rows">
                    {pairs.map((pair, rowIndex) => (
                        <div 
                            key={rowIndex} 
                            className={`mtm-pair-row ${pair.length === 1 ? 'mtm-pair-single' : ''}`}
                        >
                            {pair.map((member, colIndex) => {
                                const isLeft = colIndex === 0;
                                const isSingle = pair.length === 1;
                                const IconComponent = member.icon;

                                const nameParts = member.name.split(' ');
                                const firstName = nameParts[0];
                                const lastName = nameParts.slice(1).join(' ');

                                // Slower, ultra-cinematic 3D entrance animation:
                                // Left owner slides from -130px with -3deg tilt
                                // Right owner slides from +130px with +3deg tilt
                                // Single owner glides from bottom (+80px)
                                const initialPos = isSingle 
                                    ? { opacity: 0, y: 80, scale: 0.92 }
                                    : { opacity: 0, x: isLeft ? -130 : 130, rotate: isLeft ? -3 : 3, scale: 0.93 };

                                return (
                                    <motion.div
                                        key={member.id}
                                        className="mtm-card-wrap"
                                        initial={initialPos}
                                        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ 
                                            duration: 1.45, 
                                            delay: colIndex * 0.22, 
                                            ease: [0.19, 1, 0.22, 1] 
                                        }}
                                        whileHover={{ 
                                            y: -12, 
                                            scale: 1.025,
                                            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } 
                                        }}
                                    >
                                        <div className="mtm-member-card">
                                            {/* Image Box */}
                                            <div className="mtm-card-img-box">
                                                <img src={member.img} alt={member.name} className="mtm-card-img" />
                                                <div className="mtm-viewfinder" />
                                                <span className="mtm-badge" style={{ backgroundColor: member.accentColor }}>
                                                    {member.badge}
                                                </span>
                                            </div>

                                            {/* Content Box */}
                                            <div className="mtm-card-info">
                                                <div 
                                                    className={`mtm-icon-tag ${member.id === 'pierre' ? 'mtm-soundwave-active' : ''} ${member.id === 'leo' ? 'mtm-clapper-active' : ''}`} 
                                                    style={{ color: member.accentColor }}
                                                >
                                                    <IconComponent size={member.id === 'pierre' ? 22 : 18} />
                                                    {member.id === 'pierre' && (
                                                        <div className="mtm-soundwave-bars">
                                                            <span className="bar"></span>
                                                            <span className="bar"></span>
                                                            <span className="bar"></span>
                                                            <span className="bar"></span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="mtm-name">
                                                    {firstName}{' '}
                                                    <span
                                                        style={{
                                                            background: `linear-gradient(135deg, ${member.gradientColors[0]}, ${member.gradientColors[1]})`,
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            backgroundClip: 'text',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {lastName}
                                                    </span>
                                                </h3>

                                                <h4 className="mtm-role" style={{ color: member.accentColor }}>{member.role}</h4>
                                                <div className="mtm-divider" style={{ backgroundColor: member.accentColor }} />

                                                {/* Specs Tags */}
                                                <div className="mtm-spec-tags">
                                                    {member.cameraSpecs.map((spec, i) => (
                                                        <span key={i} className="mtm-spec-tag">{spec}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

