import React from 'react';
import './About.css';
import aboutStory from '../assets/about-story.jpg';

// Import logos from assets/trusted leaders
import logoBasha from '../assets/trusted leaders/Basha.png';
import logoDLS from '../assets/trusted leaders/DLS.jpg';
import logoDowntown from '../assets/trusted leaders/Downtown-factory.png';
import logoExtraSauce from '../assets/trusted leaders/Extra-sauce.png';
import logoInsa from '../assets/trusted leaders/Insa.png';
import logoKamena from '../assets/trusted leaders/Kamena.png';
import logoCairoPhotoWeek from '../assets/trusted leaders/cairo-phot-week.png';
import logoClient4 from '../assets/trusted leaders/client4.avif';
import logoElsawy from '../assets/trusted leaders/elsawy-logo.png';

// ── Partner brand data ──────────────────────────────────────────────────────
const PARTNERS = [
    { name: 'Basha', color: '142, 249, 252', letter: 'B', logo: logoBasha },
    { name: 'DLS', color: '142, 252, 204', letter: 'D', logo: logoDLS, contain: true },
    { name: 'Downtown factory', color: '142, 252, 157', letter: 'D', logo: logoDowntown, contain: true },
    { name: 'Extra Sauce', color: '215, 252, 142', letter: 'E', logo: logoExtraSauce },
    { name: 'Insa', color: '252, 252, 142', letter: 'I', logo: logoInsa, contain: true },
    { name: 'Kamena', color: '252, 208, 142', letter: 'K', logo: logoKamena, contain: true },
    { name: 'Elsawy', color: '252, 142, 142', letter: 'E', logo: logoElsawy, contain: true },
    { name: 'Cairo Photo Week', color: '252, 142, 239', letter: 'C', logo: logoCairoPhotoWeek, contain: true },
    { name: 'Lo2ta', color: '204, 142, 252', letter: 'L', logo: logoClient4, contain: true },
];

const TEAM = [
    {
        name: 'Youssef',
        role: 'Creative Director',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Sarah',
        role: 'Lead Photographer',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Ahmed',
        role: 'Creative Producer',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
];

const VALUES = [
    {
        icon: '🎯',
        title: 'Precision',
        text: 'Every frame is composed with intention. We obsess over the details so your brand story lands exactly as envisioned.',
    },
    {
        icon: '✨',
        title: 'Creativity',
        text: 'We blend artistic vision with strategic thinking — delivering visuals that are both beautiful and purposeful.',
    },
    {
        icon: '🤝',
        title: 'Partnership',
        text: 'We work alongside you as a true creative partner, not just a vendor. Your success is our benchmark.',
    },
    {
        icon: '⚡',
        title: 'Speed',
        text: 'Fast turnarounds without sacrificing quality. We deliver on time, every time, so your projects never stall.',
    },
    {
        icon: '🔒',
        title: 'Trust',
        text: 'Transparent pricing, clear communication and a track record that speaks for itself. No surprises.',
    },
    {
        icon: '🌍',
        title: 'Impact',
        text: "Our work doesn't just look good — it moves people. We create visuals that drive real results for your audience.",
    },
];

const About = () => {
    return (
        <div className="about-page">

            {/* ── Hero ── */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="about-hero-eyebrow">Our Story</span>
                    <h1>We Are <span>Ariadne</span></h1>
                    <p className="about-hero-sub">
                        A premium visual storytelling agency crafting cinematic photography
                        and documentation that leaves a lasting impression.
                    </p>
                </div>
            </section>

            {/* ── Story ── */}
            <section className="about-story">
                <div className="about-story-inner">
                    <div className="about-story-text">
                        <h2>Turning Vision Into <span>Visual Truth</span></h2>
                        <p>
                            Founded with a single obsession — to make every brand look as extraordinary as it really is —
                            Ariadne has grown into a full-service photography and documentation powerhouse.
                        </p>
                        <p>
                            From intimate product shoots to large-scale corporate campaigns, we bring the same relentless
                            attention to detail and creative ambition to every project we take on.
                        </p>
                        <div className="about-stat-row">
                            <div className="about-stat">
                                <span className="about-stat-num">120+</span>
                                <span className="about-stat-label">Projects</span>
                            </div>
                            <div className="about-stat">
                                <span className="about-stat-num">40+</span>
                                <span className="about-stat-label">Brands</span>
                            </div>
                            <div className="about-stat">
                                <span className="about-stat-num">5★</span>
                                <span className="about-stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-story-img-wrap">
                        <img src={aboutStory} alt="Ariadne at work" />
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="about-team">
                <div className="about-team-inner">
                    <div className="about-section-header">
                        <h2>Meet The <span>Minds</span></h2>
                        <p>The core visionaries behind the lens, driving our passion for visual storytelling.</p>
                    </div>
                    <div className="about-team-grid">
                        {TEAM.map((member, i) => (
                            <div className="team-card" key={i}>
                                <div className="team-card-img">
                                    <img src={member.photo} alt={member.name} />
                                    <div className="team-card-overlay">
                                        <div className="team-socials">
                                            <span>📷</span>
                                            <span>🔗</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-card-info">
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="about-values">
                <div className="about-values-inner">
                    <div className="about-section-header">
                        <h2>What Drives Us</h2>
                        <p>Six principles that guide every decision we make and every frame we capture.</p>
                    </div>
                    <div className="about-values-grid">
                        {VALUES.map((v, i) => (
                            <div className="about-value-card" key={i}>
                                <span className="about-value-icon">{v.icon}</span>
                                <h3>{v.title}</h3>
                                <p>{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3D Glassmorphic Partners Carousel ── */}
            <section className="about-partners">
                <div className="about-partners-inner">
                    <div className="about-section-header">
                        <h2>Trusted By Industry <span>Leaders</span></h2>
                        <p>
                            We're proud to partner with innovative brands and forward-thinking companies
                            that demand the very best in visual storytelling.
                        </p>
                    </div>

                    <div className="partners-carousel-wrap">
                        <div
                            className="partners-inner"
                            style={{ '--quantity': PARTNERS.length }}
                        >
                            {PARTNERS.map((partner, i) => (
                                <div
                                    key={i}
                                    className="partner-card glass-card"
                                    style={{
                                        '--index': i,
                                        '--color-card': partner.color,
                                    }}
                                >
                                    <div className="partner-img">
                                        {partner.logo ? (
                                            <img 
                                                src={partner.logo} 
                                                alt={partner.name} 
                                                style={partner.contain ? { objectFit: 'contain', padding: partner.padding || '15px' } : {}}
                                            />
                                        ) : (
                                            <span className="text-logo">
                                                {partner.letter}
                                            </span>
                                        )}
                                        <div className="partner-glow"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
