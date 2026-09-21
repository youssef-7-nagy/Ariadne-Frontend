import React from 'react';
import './About.css';
import aboutStory from '../assets/meet-the-minds/all.jpg';
import InteractiveGrid from '../components/InteractiveGrid';
import MeetTheMinds from '../components/MeetTheMinds';

// Import logos from assets/trusted leaders
import logoBasha from '../assets/trusted leaders/Basha.png';
import logoCairoPhotoWeek from '../assets/trusted leaders/cairo-phot-week.png';
import logoCairo from '../assets/trusted leaders/cairo.jpeg';
import logoCarlos from '../assets/trusted leaders/carlos.jpeg';
import logoClient4 from '../assets/trusted leaders/client4.avif';
import logoCommunitas from '../assets/trusted leaders/communitas.jpeg';
import logoDLS from '../assets/trusted leaders/DLS.png';
import logoDowntown from '../assets/trusted leaders/Downtown-factory.png';
import logoElsawy from '../assets/trusted leaders/elsawy-logo.png';
import logoExtraSauce from '../assets/trusted leaders/Extra-sauce.png';
import logoInsa from '../assets/trusted leaders/Insa.png';
import logoKamena from '../assets/trusted leaders/Kamena.png';

// ── Partner brand data (12 unique logos) ───────────────────────────────────
const PARTNERS = [
    { name: 'Basha', logo: logoBasha },
    { name: 'Cairo Photo Week', logo: logoCairoPhotoWeek },
    { name: 'Cairo Design Week', logo: logoCairo },
    { name: 'Carlos', logo: logoCarlos },
    { name: 'Lo2ta', logo: logoClient4 },
    { name: 'Communitas', logo: logoCommunitas },
    { name: 'DLS', logo: logoDLS },
    { name: 'Downtown Factory', logo: logoDowntown },
    { name: 'Elsawy', logo: logoElsawy },
    { name: 'Extra Sauce', logo: logoExtraSauce },
    { name: 'Insa', logo: logoInsa },
    { name: 'Kamena', logo: logoKamena },
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
                            Founded with a single obsession…To make every idea and story counts<br />
                            Ariadne has grown into full-service cinematography, documentation and storytelling powerhouse
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
                        <img 
                            src={aboutStory} 
                            alt="Ariadne team at work" 
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>
                </div>
            </section>



            {/* ── Meet The Minds Section ── */}
            <MeetTheMinds />

            {/* ── Values ── */}
            <section className="about-values">
                <div className="about-values-inner">
                    <div className="about-section-header">
                        <h2>What Drives Us</h2>
                        <p>Six principles that guide every frame we capture.</p>
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

            {/* ── Interactive Grid Partners (White Background) ── */}
            <section className="about-partners">
                <div className="about-partners-inner">
                    <div className="about-section-header">
                        <h2>Trusted By Industry <span>Leaders</span></h2>
                        <p>
                            We're proud to partner with innovative brands and forward-thinking companies
                            that demand the very best in visual storytelling.
                        </p>
                    </div>

                    <div className="interactive-partners-stage">
                        <InteractiveGrid
                            images={PARTNERS.map(p => p.logo).filter(Boolean)}
                            columns={4}
                            rows={3}
                            repeat={false}
                            gap={12}
                            rounded={10}
                            logoScale={4}
                            cardFill="#ffffff"
                            cardBorder="rgba(0, 0, 0, 0.08)"
                            shadow={true}
                            cardShadow="rgba(0, 0, 0, 0.04)"
                            glow={true}
                            glowStart="rgba(124, 58, 237, 0.25)"
                            glowEnd="#7c3aed"
                            glowIntensity={40}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
