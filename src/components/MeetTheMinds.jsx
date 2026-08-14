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
        bio: 'Ramsis leads Ariadne\'s executive production and visual strategy, overseeing project development, creative direction, and cinematic execution from inception to final delivery.',
        img: imgRamsis,
        accentColor: '#ff6b35',
        icon: FaBriefcase,
        cameraSpecs: ['ARRI Alexa Mini  |  RED V-Raptor', 'PRODUCTION DEPT  |  SET-01'],
        gradientColors: ['#ff6b35', '#f97316'],
    },
    {
        id: 'leo',
        name: 'Léonardo HANNA',
        role: 'Creative Director',
        badge: 'CREATIVE DIRECTION',
        bio: 'Léonardo brings a sharp vision and precision to set direction. He leads Ariadne\'s cinematic productions, bridging raw human emotion and powerful storylines into high-end films that resonate with audiences.',
        img: imgLeo,
        accentColor: '#7c3aed',
        icon: LuClapperboard,
        cameraSpecs: ['ISO 100  |  85mm  |  f/1.2', '1/250s  |  5.6K RAW'],
        gradientColors: ['#7c3aed', '#a78bfa'],
    },
    {
        id: 'maria',
        name: 'Maria ARTINE',
        role: 'Marketing & PR',
        badge: 'BRAND & PR',
        bio: 'Bringing together PR, communications, client relations, and account management to support the creative process from idea to execution. Working closely with clients and production teams to keep communication clear, relationships strong, and projects moving in the right direction. From understanding a client’s vision to shaping how the work is presented and communicated, the focus is always on creating a smooth experience and work that connects with the right audience.',
        img: imgMaria,
        accentColor: '#8b5cf6',
        icon: FaBullhorn,
        cameraSpecs: ['PROD SCHEDULE  |  CALL SHEET 02', 'CLIENT COLLABORATION'],
        gradientColors: ['#8b5cf6', '#c084fc'],
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Director Of Photography',
        badge: 'CINEMATOGRAPHY',
        bio: 'Leads Ariadne\'s camera and lighting department, overseeing visual storytelling across commercials, brand films, and digital content. His technical expertise in cinematography, and on-set workflow ensures every frame is polished, cinematic, and aligned with the client\'s vision.',
        img: imgFady,
        accentColor: '#10b981',
        icon: FaCamera,
        cameraSpecs: ['REC.709  |  DCI-P3  |  12-BIT', 'DAVINCI RESOLVE Studio'],
        gradientColors: ['#10b981', '#34d399'],
    },
    {
        id: 'samah',
        name: 'Samah TADROS',
        role: 'Production Manager',
        badge: 'PRODUCTION',
        bio: 'Samah coordinates set logistics, scheduling, and production operations for Ariadne\'s projects, ensuring seamless execution across departments and keeping every shoot running flawlessly.',
        img: imgSamah,
        accentColor: '#ec4899',
        icon: FaClipboardList,
        cameraSpecs: ['MOOD BOARD 03  |  PALETTE A', 'ART DIRECTION & STYLING'],
        gradientColors: ['#ec4899', '#f472b6'],
    },
    {
        id: 'pierre',
        name: 'Pierre TOMA',
        role: 'Sound Engineer',
        badge: 'SOUND DEPT',
        bio: 'Leads the audio engineering department, overseeing sound design, mixing, and mastering across all visual formats. His technical expertise in audio post-production ensures pristine clarity, immersive soundscapes, and a balanced final mix that seamlessly elevates the visual narrative.',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: GiSoundWaves,
        cameraSpecs: ['ISO 800  |  35mm  |  T/1.5', '1/50s  |  24fps  |  8K'],
        gradientColors: ['#1392d6', '#60a5fa'],
    },
    {
        id: 'john',
        name: 'John ZAKI',
        role: 'Music Composer',
        badge: 'COMPOSITION',
        bio: 'Crafting original music that transforms ideas into memorable sonic experiences. Every score is composed to elevate the story, strengthen the brand’s identity, and create an emotional connection with the audience. From the first creative concept to the final mix, every note is designed with purpose and impact.',
        img: imgJohn,
        accentColor: '#e0a96d',
        icon: FaMusic,
        cameraSpecs: ['M18 HMI  |  Skypanel S60-C', 'FREEFLY Alta X  |  DJI Inspire 3'],
        gradientColors: ['#e0a96d', '#f5d0a9'],
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

                        // Split name into first and last part to apply mixed color style
                        const nameParts = member.name.split(' ');
                        const firstName = nameParts[0];
                        const lastName = nameParts.slice(1).join(' ');

                        return (
                            <div
                                key={member.id}
                                className={`mtm-row ${isEven ? 'row-left' : 'row-right'}`}
                            >
                                {/* Image Box - Enters first */}
                                <motion.div
                                    className="mtm-img-col"
                                    initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.85, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="mtm-img-card">
                                        <img src={member.img} alt={member.name} className="mtm-img" />
                                        <div className="mtm-viewfinder" />
                                        <span className="mtm-badge" style={{ backgroundColor: member.accentColor }}>
                                            {member.badge}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Content Box - Enters second from opposite side */}
                                <motion.div
                                    className="mtm-content-col"
                                    initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="mtm-content-inner">
                                        <div
                                            className={`mtm-icon-tag ${member.id === 'pierre' ? 'mtm-soundwave-active' : ''} ${member.id === 'leo' ? 'mtm-clapper-active' : ''}`}
                                            style={{ color: member.accentColor }}
                                        >
                                            <IconComponent size={member.id === 'pierre' ? 24 : 20} />
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
                                        <p className="mtm-bio">{member.bio}</p>

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
