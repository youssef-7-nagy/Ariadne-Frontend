import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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
        id: 'leo',
        name: 'Léonardo HANNA',
        role: 'Creative Director',
        badge: 'CREATIVE DIRECTOR',
        bio: 'Léonardo brings a sharp vision and precision to set direction. He leads Ariadne\'s cinematic productions, bridging raw human emotion and powerful storylines into high-end films that resonate with audiences.',
        img: imgLeo,
        accentColor: '#1e3a8a',
        ribbonFold: '#0f1f4b',
        icon: LuClapperboard,
        cameraSpecs: ['ISO 100  |  85mm  |  f/1.2', '1/250s  |  5.6K RAW'],
        gradientColors: ['#1e3a8a', '#7dd3fc'],
    },
    {
        id: 'ramsis',
        name: 'Ramsis HANNA',
        role: 'Senior Producer',
        badge: 'SENIOR PRODUCER',
        bio: 'Ramsis leads Ariadne\'s senior production and visual strategy, overseeing project development, creative direction, and cinematic execution from inception to final delivery.',
        img: imgRamsis,
        accentColor: '#d4b483',
        ribbonFold: '#b8945f',
        icon: FaBriefcase,
        cameraSpecs: ['ARRI Alexa Mini  |  RED V-Raptor', 'PRODUCTION DEPT  |  SET-01'],
        gradientColors: ['#d4b483', '#1e3a8a'],
    },
    {
        id: 'samah',
        name: 'Samah TADROS',
        role: 'Production Manager',
        badge: 'PRODUCTION',
        bio: 'Samah coordinates set logistics, scheduling, and production operations for Ariadne\'s projects, ensuring seamless execution across departments and keeping every shoot running flawlessly.',
        img: imgSamah,
        accentColor: '#A8B3A0',
        ribbonFold: '#8c9883',
        icon: FaClipboardList,
        cameraSpecs: ['MOOD BOARD 03  |  PALETTE A', 'ART DIRECTION & STYLING'],
        gradientColors: ['#A8B3A0', '#1e3a8a'],
    },
    {
        id: 'maria',
        name: 'Maria ARTINE',
        role: 'Marketing & PR',
        badge: 'BRAND & PR',
        bio: 'Maria leads marketing, PR, and client relations at Ariadne, managing communication with clients and production teams and ensuring every project moves smoothly from concept to execution.',
        img: imgMaria,
        accentColor: '#7dd3fc',
        ribbonFold: '#38bdf8',
        icon: FaBullhorn,
        cameraSpecs: ['PROD SCHEDULE  |  CALL SHEET 02', 'CLIENT COLLABORATION'],
        gradientColors: ['#7dd3fc', '#1e3a8a'],
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Director Of Photography',
        badge: 'CINEMATOGRAPHY',
        bio: 'Fady leads Ariadne\'s camera and lighting department, overseeing cinematography and on-set production to ensure every frame is precise, cinematic, and aligned with the project\'s vision.',
        img: imgFady,
        accentColor: '#d4b483',
        ribbonFold: '#b8945f',
        icon: FaCamera,
        cameraSpecs: ['REC.709  |  DCI-P3  |  12-BIT', 'DAVINCI RESOLVE Studio'],
        gradientColors: ['#d4b483', '#A8B3A0'],
    },
    {
        id: 'pierre',
        name: 'Pierre TOMA',
        role: 'Sound Engineer',
        badge: 'SOUND DEPT',
        bio: 'Pierre leads Ariadne\'s audio department, overseeing sound design, mixing, and mastering to create clear, immersive sound that complements and enhances every visual story.',
        img: imgPierre,
        accentColor: '#1e3a8a',
        ribbonFold: '#0f1f4b',
        icon: GiSoundWaves,
        cameraSpecs: ['ISO 800  |  35mm  |  T/1.5', '1/50s  |  24fps  |  8K'],
        gradientColors: ['#1e3a8a', '#7dd3fc'],
    },
    {
        id: 'john',
        name: 'John ZAKI',
        role: 'Music Composer',
        badge: 'COMPOSITION',
        bio: 'John creates original music for Ariadne\'s productions, developing scores that bring emotion, atmosphere, and a distinct identity to every visual story.',
        img: imgJohn,
        accentColor: '#A8B3A0',
        ribbonFold: '#8c9883',
        icon: FaMusic,
        cameraSpecs: ['M18 HMI  |  Skypanel S60-C', 'FREEFLY Alta X  |  DJI Inspire 3'],
        gradientColors: ['#A8B3A0', '#d4b483'],
    }
];

function OwnerProfile({ member, index }) {
    const isEven = index % 2 === 0; // Even = Image Left, Bio Right. Odd = Bio Left, Image Right.
    const IconComponent = member.icon;

    // Split name into first and last part to apply mixed color style
    const nameParts = member.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const imgVariants = {
        hidden: { opacity: 0, x: isEven ? -40 : 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, x: isEven ? 40 : -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
        }
    };

    return (
        <motion.div 
            className={`mtm-row ${isEven ? 'row-left' : 'row-right'}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Image Box - Enters first */}
            <motion.div
                className="mtm-img-col"
                variants={imgVariants}
            >
                <div className="mtm-img-card">
                    <img 
                        src={member.img} 
                        alt={member.name} 
                        className="mtm-img" 
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="mtm-viewfinder" />
                </div>
            </motion.div>

            {/* Content Box - Enters second from opposite side */}
            <motion.div
                className="mtm-content-col"
                variants={contentVariants}
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
                            className="mtm-name-accent"
                            style={{
                                '--member-accent': member.accentColor,
                                '--grad-start': member.gradientColors[0],
                                '--grad-end': member.gradientColors[1],
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
        </motion.div>
    );
}

export default function MeetTheMinds() {
    const location = useLocation();

    return (
        <section key={location.pathname} className="mtm-section">
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
                    {TEAM_MEMBERS.map((member, index) => (
                        <OwnerProfile key={member.id} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
