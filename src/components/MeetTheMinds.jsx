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
    FaBullhorn 
} from 'react-icons/fa6';
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
        role: 'Director',
        badge: 'DIRECTING',
        bio: 'Léonardo brings a sharp vision and precision to set direction. He leads Ariadne\'s cinematic productions, bridging raw human emotion and powerful storylines into high-end films that resonate with audiences.',
        img: imgLeo,
        accentColor: '#7c3aed',
        icon: FaVideo,
        cameraSpecs: ['ISO 100  |  85mm  |  f/1.2', '1/250s  |  5.6K RAW'],
        gradientColors: ['#7c3aed', '#a78bfa'],
    },
    {
        id: 'pierre',
        name: 'Pierre TOMA',
        role: 'Sound Engineer',
        badge: 'SOUND DEPT',
        bio: 'Pierre commands the auditory dimension of Ariadne\'s films. From on-set boom and lavalier recording to complex multi-layered sound design, creative mixing, and clean mastering, he ensures every story is heard clearly.',
        img: imgPierre,
        accentColor: '#1392d6',
        icon: FaMicrophone,
        cameraSpecs: ['ISO 800  |  35mm  |  T/1.5', '1/50s  |  24fps  |  8K'],
        gradientColors: ['#1392d6', '#60a5fa'],
    },
    {
        id: 'fady',
        name: 'Fady BARSSOUM',
        role: 'Director of Photography',
        badge: 'CINEMATOGRAPHY',
        bio: 'Fady directs the camera and lighting department, crafting Ariadne\'s distinct visual identity. His precise compositions, lens choices, and light choreography bring depth and cinematic realism to every scene.',
        img: imgFady,
        accentColor: '#10b981',
        icon: FaCamera,
        cameraSpecs: ['REC.709  |  DCI-P3  |  12-BIT', 'DAVINCI RESOLVE Studio'],
        gradientColors: ['#10b981', '#34d399'],
    },
    {
        id: 'ramsis',
        name: 'Ramsis HANNA',
        role: 'Storyboard Artist',
        badge: 'CREATIVE ART',
        bio: 'Ramsis maps the visual blueprints of our productions. By converting scripts into detailed, expressive storyboard panels, he orchestrates camera blocking, action sequences, and visual flow before shooting begins.',
        img: imgRamsis,
        accentColor: '#ff6b35',
        icon: FaPenNib,
        cameraSpecs: ['ARRI Alexa Mini  |  RED V-Raptor', 'PRODUCTION DEPT  |  SET-01'],
        gradientColors: ['#ff6b35', '#f97316'],
    },
    {
        id: 'samah',
        name: 'Samah TADROS',
        role: 'Set Designer',
        badge: 'SET DESIGN',
        bio: 'Samah constructs the physical environments that form the backdrops of Ariadne\'s films. By orchestrating set architecture, interior props, and color palettes, she builds immersive, textured worlds inside every frame.',
        img: imgSamah,
        accentColor: '#ec4899',
        icon: FaPalette,
        cameraSpecs: ['MOOD BOARD 03  |  PALETTE A', 'ART DIRECTION & STYLING'],
        gradientColors: ['#ec4899', '#f472b6'],
    },
    {
        id: 'john',
        name: 'John ZAKI',
        role: 'Music Composer',
        badge: 'COMPOSITION',
        bio: 'John composes original musical scores and emotional soundtracks that drive Ariadne\'s stories forward. Utilizing symphonic depth and modern synthesizers, his compositions capture the mood and tempo of each production.',
        img: imgJohn,
        accentColor: '#e0a96d',
        icon: FaMusic,
        cameraSpecs: ['M18 HMI  |  Skypanel S60-C', 'FREEFLY Alta X  |  DJI Inspire 3'],
        gradientColors: ['#e0a96d', '#f5d0a9'],
    },
    {
        id: 'maria',
        name: 'Maria ARTINE',
        role: 'Marketing & PR',
        badge: 'BRAND & PR',
        bio: 'Maria manages public relations, marketing outreach, and strategic campaigns for Ariadne. She builds brand value, promotes our visual works to global clients, and establishes premium partnerships across the industry.',
        img: imgMaria,
        accentColor: '#8b5cf6',
        icon: FaBullhorn,
        cameraSpecs: ['PROD SCHEDULE  |  CALL SHEET 02', 'CLIENT COLLABORATION'],
        gradientColors: ['#8b5cf6', '#c084fc'],
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
                                        <div className="mtm-viewfinder" />
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
