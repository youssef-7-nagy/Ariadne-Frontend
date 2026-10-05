import React from 'react';
import img011 from '../assets/home/011.jpeg';
import img012 from '../assets/home/012.jpeg';
import img013 from '../assets/home/013.jpeg';
import './HighlightsSection.css';

const HIGHLIGHT_CARDS = [
    {
        id: 'h1',
        image: img011,
        alt: 'We create a unique project',
        taglinePrefix: 'WE CREATE ',
        taglineAccent: 'A UNIQUE PROJECT',
        subtitle: 'ATTRACT A NEW AUDIENCE',
        description: 'To conquer a new market, or reach a new target, video content is essential.',
    },
    {
        id: 'h2',
        image: img012,
        alt: 'We tell your story',
        taglinePrefix: 'WE TELL ',
        taglineAccent: 'YOUR STORY',
        subtitle: 'STAND OUT FROM THE COMPETITION',
        description: "On social networks and all digital platforms, businesses that communicate using video capture 8 times more attention.",
    },
    {
        id: 'h3',
        image: img013,
        alt: 'Comprehensive support',
        taglinePrefix: 'COMPREHENSIVE ',
        taglineAccent: 'SUPPORT',
        subtitle: 'A SINGLE POINT OF CONTACT FOR YOUR PROJECT',
        description: 'Our team brings together all audiovisual communication professions to create a personalized product.',
    },
];

const SectionHeader = ({ eyebrowBrand = 'ARIADNE FILMS', eyebrowType = 'AUDIOVISUAL COMMUNICATION AGENCY', title = 'Our strengths' }) => (
    <header className="hl-header">
        <div className="hl-eyebrow">
            <span>{eyebrowBrand}</span>
            <span className="hl-slash">/</span>
            <span>{eyebrowType}</span>
        </div>
        <h2 className="hl-title">{title}</h2>
    </header>
);

const HighlightCard = ({ card }) => (
    <article className="hl-card">
        <div className="hl-card-bg">
            <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
            <div className="hl-card-overlay" />
        </div>
        <div className="hl-card-content">
            <h3 className="hl-card-tagline">
                <span>{card.taglinePrefix}</span>
                <span className="hl-accent">{card.taglineAccent}</span>
            </h3>
            <h4 className="hl-card-subtitle">{card.subtitle}</h4>
            <p className="hl-card-desc">{card.description}</p>
            <div className="hl-card-logo">
                <img src="/mylogo.png" alt="ARIA Logo" loading="lazy" decoding="async" />
            </div>
        </div>
    </article>
);

const HighlightsSection = ({
    cards = HIGHLIGHT_CARDS,
}) => (
    <section className="hl-section" aria-label="Our strengths">
        <div className="hl-container">
            <SectionHeader />
            <div className="hl-grid">
                {cards.map((card) => (
                    <HighlightCard key={card.id} card={card} />
                ))}
            </div>
        </div>
    </section>
);

export default HighlightsSection;
