import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Portfolio.css';

/* ─── Fallback category images ─── */
import imgShortFilms from '../assets/categories/short-films.png';
import imgDocumentaries from '../assets/categories/documentaries.png';
import imgCommercials from '../assets/categories/commercials.png';
import imgEvents from '../assets/categories/events.png';
import imgPodcasts from '../assets/categories/podcasts.png';
import imgStreaming from '../assets/categories/streaming.png';
import imgCorporate from '../assets/categories/corporate.png';
import imgMusicVideos from '../assets/categories/music-videos.png';
import imgPhotography from '../assets/categories/photography.png';
import imgBTS from '../assets/categories/behind-the-scenes.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* ─── Fallback data used when categories haven't been created in the DB yet ─── */
const FALLBACK_CATEGORIES = [
    { _id: 'fb-1',  slug: 'short-films',       name: 'Short Films',       description: 'Narrative-driven artistic short films.',                      localImg: imgShortFilms },
    { _id: 'fb-2',  slug: 'documentaries',      name: 'Documentaries',     description: 'Long-form cinematic narratives uncovering the truth.',         localImg: imgDocumentaries },
    { _id: 'fb-3',  slug: 'commercials',        name: 'Commercials',       description: 'High-impact advertising campaigns for premium brands.',       localImg: imgCommercials },
    { _id: 'fb-4',  slug: 'events',             name: 'Events',            description: 'Capturing conferences, ceremonies, and luxury events.',       localImg: imgEvents },
    { _id: 'fb-5',  slug: 'podcasts',           name: 'Podcasts',          description: 'Professional podcast recording and production.',              localImg: imgPodcasts },
    { _id: 'fb-6',  slug: 'live-streaming',     name: 'Live Streaming',    description: 'Multi-camera professional streaming solutions.',              localImg: imgStreaming },
    { _id: 'fb-7',  slug: 'corporate-videos',   name: 'Corporate Videos',  description: 'Business presentations, company profiles, and branding.',     localImg: imgCorporate },
    { _id: 'fb-8',  slug: 'music-videos',       name: 'Music Videos',      description: 'Creative visual storytelling for artists and bands.',         localImg: imgMusicVideos },
    { _id: 'fb-9',  slug: 'photography',        name: 'Photography',       description: 'Professional photography for brands and individuals.',        localImg: imgPhotography },
    { _id: 'fb-10', slug: 'behind-the-scenes',  name: 'Behind The Scenes', description: 'Exclusive production process coverage.',                      localImg: imgBTS },
];

/* Map slugs to local images for fallback when DB coverImage is missing */
const LOCAL_IMAGE_MAP = {};
FALLBACK_CATEGORIES.forEach(c => { LOCAL_IMAGE_MAP[c.slug] = c.localImg; });

const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};

/* ─── Skeleton Card Component ─── */
const SkeletonCard = ({ index }) => (
    <div className="pf-skeleton-card" style={{ animationDelay: `${index * 0.08}s` }}>
        <div className="pf-skeleton-shimmer" />
        <div className="pf-skeleton-content">
            <div className="pf-skeleton-title" />
            <div className="pf-skeleton-desc" />
            <div className="pf-skeleton-desc short" />
        </div>
    </div>
);

/* ─── Category Card Component ─── */
const CategoryCard = ({ category, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const imgRef = useRef(null);

    const coverSrc = category.coverImage
        ? resolveUrl(category.coverImage)
        : (LOCAL_IMAGE_MAP[category.slug] || '');

    useEffect(() => {
        if (!coverSrc) return;
        const img = new Image();
        img.src = coverSrc;
        img.onload = () => setImgLoaded(true);
    }, [coverSrc]);

    return (
        <Link
            to={`/portfolio/${category.slug}`}
            className="pf-card-link"
            style={{ animationDelay: `${index * 0.07}s` }}
            aria-label={`View ${category.name} projects`}
        >
            <article className="pf-card" role="article">
                {/* Background Image with lazy loading */}
                <div
                    className={`pf-card-bg ${imgLoaded ? 'loaded' : ''}`}
                    style={{ backgroundImage: coverSrc ? `url(${coverSrc})` : 'none' }}
                />

                {/* Cinematic gradient overlay */}
                <div className="pf-card-gradient" />

                {/* Hover glow effect */}
                <div className="pf-card-glow" />

                {/* Noise texture for cinematic grain */}
                <div className="pf-card-noise" />

                {/* Content */}
                <div className="pf-card-content">
                    <div className="pf-card-category-line" />
                    <h3 className="pf-card-name">{category.name}</h3>
                    <p className="pf-card-desc">{category.description}</p>
                    <div className="pf-card-cta">
                        <span className="pf-card-cta-text">Explore</span>
                        <svg className="pf-card-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                </div>

                {/* Corner play icon */}
                <div className="pf-card-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
            </article>
        </Link>
    );
};

/* ─── Main Portfolio Component ─── */
const Portfolio = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/portfolio/categories`);
                if (response.data.success && response.data.data.length > 0) {
                    setCategories(response.data.data);
                } else {
                    /* No categories in DB yet — use fallback data */
                    setCategories(FALLBACK_CATEGORIES);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
                /* On error, use fallback categories so the page still looks great */
                setCategories(FALLBACK_CATEGORIES);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="portfolio-container">
            {/* Ambient background effects */}
            <div className="pf-ambient pf-ambient-1" />
            <div className="pf-ambient pf-ambient-2" />
            <div className="pf-ambient pf-ambient-3" />

            <div className="pf-inner">
                {/* Header Section */}
                <header className="pf-header">
                    <h1 className="pf-title">
                        <span className="pf-title-line-1">Cinematic</span>
                        <span className="pf-title-line-2">Portfolio</span>
                    </h1>
                    <p className="pf-subtitle">
                        Explore our curated collection of visual storytelling across genres.
                        <br className="pf-subtitle-br" />
                        Each frame crafted with precision and artistic vision.
                    </p>
                    <div className="pf-title-accent" />
                </header>

                {/* Stats Bar */}
                <div className="pf-stats-bar">
                    <div className="pf-stat">
                        <span className="pf-stat-number">{isLoading ? '—' : categories.length}</span>
                        <span className="pf-stat-label">Categories</span>
                    </div>
                    <div className="pf-stat-divider" />
                    <div className="pf-stat">
                        <span className="pf-stat-number">50+</span>
                        <span className="pf-stat-label">Projects</span>
                    </div>
                    <div className="pf-stat-divider" />
                    <div className="pf-stat">
                        <span className="pf-stat-number">4K</span>
                        <span className="pf-stat-label">Resolution</span>
                    </div>
                    <div className="pf-stat-divider" />
                    <div className="pf-stat">
                        <span className="pf-stat-number">HDR</span>
                        <span className="pf-stat-label">Color Grade</span>
                    </div>
                </div>

                {/* Category Grid */}
                {isLoading ? (
                    <div className="pf-grid">
                        {[...Array(10)].map((_, i) => (
                            <SkeletonCard key={i} index={i} />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="pf-empty">
                        <div className="pf-empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                                <line x1="7" y1="2" x2="7" y2="22" />
                                <line x1="17" y1="2" x2="17" y2="22" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <line x1="2" y1="7" x2="7" y2="7" />
                                <line x1="2" y1="17" x2="7" y2="17" />
                                <line x1="17" y1="17" x2="22" y2="17" />
                                <line x1="17" y1="7" x2="22" y2="7" />
                            </svg>
                        </div>
                        <h2 className="pf-empty-title">Coming Soon</h2>
                        <p className="pf-empty-desc">Our portfolio is being curated. Check back soon for our latest work.</p>
                    </div>
                ) : (
                    <div className="pf-grid">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
