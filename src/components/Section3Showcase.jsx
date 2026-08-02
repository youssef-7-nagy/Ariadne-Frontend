import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Section3Showcase.css';

const SHOWCASE_ITEMS = [
    {
        id: 'card-1',
        number: '01',
        tag: 'PHOTOGRAPHY',
        title: 'ROMANTIC CHIPPING',
        subtitle: 'Authentic human emotion, quiet moments & raw natural atmosphere.',
        slug: 'photography',
        accentColor: 'rgba(255, 107, 53, 0.4)',
        accentColorSolid: '#ff6b35'
    },
    {
        id: 'card-2',
        number: '02',
        tag: 'CINEMATIC',
        title: 'THE POWER OF DREAMS',
        subtitle: 'Short films and documentaries crafted with rich narrative color grading.',
        slug: 'short-films',
        accentColor: 'rgba(224, 169, 109, 0.4)',
        accentColorSolid: '#e0a96d'
    },
    {
        id: 'card-3',
        number: '03',
        tag: 'COMMERCIAL',
        title: 'THE DRIVE OF YOUR LIFE',
        subtitle: 'High-octane commercial campaigns and visual brand storytelling.',
        slug: 'commercials',
        accentColor: 'rgba(74, 144, 226, 0.4)',
        accentColorSolid: '#4a90e2'
    }
];

export default function Section3Showcase() {
    return (
        <section className="s3-section">
            {/* Ambient Lighting Background */}
            <div className="s3-ambient-bg">
                <div className="s3-glow s3-glow-orange" />
                <div className="s3-glow s3-glow-blue" />
                <div className="s3-grid-pattern" />
            </div>

            <div className="s3-container">
                {/* Header Block */}
                <div className="s3-header-centered">
                    <span className="s3-eyebrow">
                        <Sparkles className="s3-sparkle-icon" size={14} />
                        FEATURED VISUAL WORKS
                    </span>
                    <h2 className="s3-main-title">Crafting Visual Stories</h2>
                    <p className="s3-subtitle">
                        Explore our signature photography, cinematic films, and commercial productions.
                    </p>
                </div>

                {/* Minimal Cards Grid (No Photos) */}
                <div className="s3-minimal-grid">
                    {SHOWCASE_ITEMS.map((item) => (
                        <div 
                            key={item.id} 
                            className="s3-minimal-card"
                            style={{ '--accent-glow': item.accentColor, '--accent-solid': item.accentColorSolid }}
                        >
                            {/* Crystal Glass Shimmer Overlay */}
                            <div className="s3-glass-shine"></div>

                            {/* Card Background Number */}
                            <span className="s3-card-number">{item.number}</span>

                            <div className="s3-card-content">
                                {/* Tag Capsule */}
                                <span className="s3-card-tag-pill">{item.tag}</span>

                                {/* Title */}
                                <h3 className="s3-card-title-text">{item.title}</h3>

                                {/* Subtitle */}
                                <p className="s3-card-desc-text">{item.subtitle}</p>
                            </div>

                            {/* Explore Link */}
                            <Link to={`/portfolio/${item.slug}`} className="s3-card-explore-btn">
                                <span>Explore Work</span>
                                <ArrowRight className="s3-explore-arrow" size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
