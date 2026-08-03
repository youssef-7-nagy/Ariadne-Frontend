import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Section3Showcase from '../components/Section3Showcase';
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
import imgAboutStory from '../assets/about-story.jpg';
import imgHome6257 from '../assets/home/IMG_6257.jpg';
import imgHome6270 from '../assets/home/IMG_6270.jpg';
import imgHome6342 from '../assets/home/IMG_6342.jpg';
import imgHome301 from '../assets/home/section301.jpg';
import imgHome302 from '../assets/home/section302.jpg';
import imgHome303 from '../assets/home/section303.jpg';


const LOCAL_IMAGE_MAP = {
    'short-films': imgShortFilms,
    'documentaries': imgDocumentaries,
    'commercials': imgCommercials,
    'events': imgEvents,
    'podcasts': imgPodcasts,
    'live-streaming': imgStreaming,
    'corporate-videos': imgCorporate,
    'music-videos': imgMusicVideos,
    'photography': imgPhotography,
    'behind-the-scenes': imgBTS,
};

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');


const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};



const curvedGalleryImages = [
    { src: imgHome6270, left: '1.5%', top: '56%', rotate: -62 },
    { src: imgHome6342, left: '9%', top: '30%', rotate: -42 },
    { src: imgHome301, left: '21%', top: '13%', rotate: -23 },
    { src: imgHome302, left: '36.5%', top: '4%', rotate: -8 },
    { src: imgHome303, left: '53%', top: '4%', rotate: 8 },
    { src: imgAboutStory, left: '68.5%', top: '13%', rotate: 23 },
    { src: imgHome6257, left: '80%', top: '30%', rotate: 42 },
    { src: imgHome6270, left: '87.5%', top: '56%', rotate: 62 },
];

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const getCategoryBg = (category) => {
        return category.coverImage ? resolveUrl(category.coverImage) : LOCAL_IMAGE_MAP[category.slug];
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/portfolio/categories`);
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);



    return (
        <div className="home-container">
            {/* Section 1: Hero Cinematic Intro */}
            <section className="home-hero-cinematic">

                {/* === Section 2 Background Glows & Texture === */}
                <div className="curved-bg-glows">
                    <div className="curved-glow-left-amber"></div>
                    <div className="curved-glow-right-amber"></div>
                    <div className="curved-rainbow-leak"></div>
                    <div className="curved-noise-overlay"></div>
                </div>

                {/* === Film grain + ambient lighting === */}
                <div className="hero-grain"></div>
                <div className="hero-ambient-glow"></div>

                {/* === Letterbox bars === */}
                <div className="hero-bar hero-bar-top"></div>
                <div className="hero-bar hero-bar-bottom"></div>

                {/* === HUD — top bar === */}
                <div className="hero-hud">
                    <div className="hero-hud-l">
                        <span className="hero-rec-dot"></span>
                        <span>REC</span>
                    </div>
                    <div className="hero-hud-c">
                        <span>ARIADNE CREATIVE STUDIO</span>
                        <span className="hero-hud-gem">◆</span>
                        <span>EST. 2026</span>
                    </div>
                    <div className="hero-hud-r">F/1.8 · 85mm · ISO 400</div>
                </div>

                {/* === MAIN CONTAINER: Split Grid === */}
                <div className="hero-main-container">

                    {/* === LEFT: Text content === */}
                    <div className="hero-text-panel">

                        {/* Studio badge */}
                        <div className="hero-badge">
                            <span className="hero-badge-bar"></span>
                            <span>Photography Studio</span>
                        </div>

                        {/* Main headline */}
                        <h1 className="hero-headline">
                            <span className="hero-hl-top">We Create</span>
                            <span className="hero-hl-serif">Timeless</span>
                            <span className="hero-hl-bottom">Imagery</span>
                        </h1>

                        {/* Thin divider */}
                        <div className="hero-rule"></div>

                        {/* Subtext */}
                        <p className="hero-subtext">
                            A premium photography studio crafting luxurious visual stories — portraits, events, and commercial imagery for distinguished brands.
                        </p>

                        {/* CTAs */}
                        <div className="hero-cta-row">
                            <Link to="/portfolio" className="hero-btn-primary">
                                <span>View Portfolio</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
                                </svg>
                            </Link>
                            <Link to="/packages" className="hero-btn-ghost">Book a Session</Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats-row">
                            <div className="hero-stat">
                                <span className="hero-stat-num">500<sup>+</sup></span>
                                <span className="hero-stat-label">Sessions</span>
                            </div>
                            <div className="hero-stat-sep"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-num">8</span>
                                <span className="hero-stat-label">Years</span>
                            </div>
                            <div className="hero-stat-sep"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-num">100<sup>%</sup></span>
                                <span className="hero-stat-label">Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* === RIGHT: Framed Photo Showcase === */}
                    <div className="hero-right-showcase">
                        <div className="hero-frame-wrapper">
                            {/* Camera Viewfinder Corners */}
                            <span className="vf-corner vf-tl"></span>
                            <span className="vf-corner vf-tr"></span>
                            <span className="vf-corner vf-bl"></span>
                            <span className="vf-corner vf-br"></span>

                            <img src={imgAboutStory} alt="Ariadne Photographer" className="hero-framed-photo" />

                            <div className="hero-frame-tag">
                                <span className="tag-dot"></span>
                                <span>BTS · BEHIND THE LENS</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* === Vertical side label === */}
                <div className="hero-side-label">
                    <span>CAPTURING MOMENTS · CRAFTING MEMORIES</span>
                </div>

                {/* === Scroll indicator === */}
                <div className="hero-scroll">
                    <div className="hero-scroll-line"></div>
                    <span>SCROLL</span>
                </div>

            </section>


            {/* Section 2: Curved Gallery Showcase */}
            <section className="curved-gallery-section">
                <div className="curved-bg-glows">
                    <div className="curved-glow-left-amber"></div>
                    <div className="curved-glow-right-amber"></div>
                    <div className="curved-rainbow-leak"></div>
                    <div className="curved-noise-overlay"></div>
                </div>

                {/* Technical Viewfinder Camera Overlay */}
                <div className="curved-viewfinder-overlay">
                    <div className="vf-bracket vf-top-left"></div>
                    <div className="vf-bracket vf-top-right"></div>
                    <div className="vf-bracket vf-bottom-left"></div>
                    <div className="vf-bracket vf-bottom-right"></div>
                    
                    <div className="vf-grid-line vf-grid-v1"></div>
                    <div className="vf-grid-line vf-grid-v2"></div>
                    <div className="vf-grid-line vf-grid-h1"></div>
                    <div className="vf-grid-line vf-grid-h2"></div>
                    
                    <div className="vf-status vf-status-tl">
                        <span className="vf-rec-dot"></span>
                        <span className="vf-status-text">REC</span>
                    </div>
                    <div className="vf-status vf-status-tr">
                        <span className="vf-status-text">TC 09:12:45:22</span>
                    </div>
                    <div className="vf-status vf-status-bl">
                        <span className="vf-status-text">F2.8  |  1/250s  |  ISO 400</span>
                    </div>
                    <div className="vf-status vf-status-br">
                        <span className="vf-status-text">RAW 8K  |  24fps  |  [+]</span>
                    </div>
                    <div className="vf-focus-ring"></div>
                </div>

                <div className="curved-gallery-container">
                    {/* The arch of curved photos */}
                    <div className="curved-arch-photos">
                        {curvedGalleryImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                className={`arch-photo-card arch-card-${idx}`}
                                style={{
                                    left: img.left,
                                    top: img.top,
                                    transform: `rotate(${img.rotate}deg)`,
                                }}
                            >
                                <img src={img.src} alt={`Showcase visual ${idx + 1}`} />
                            </div>
                        ))}
                    </div>

                    {/* Center Content block */}
                    <div className="curved-center-content">
                        <h2>Create Timeless Photos<br />That Tell Your Story</h2>
                        <p>Professional photography for personal moments, brands, and unforgettable memories.</p>
                        <Link to="/packages" className="btn-book-session-curved">Book a Session</Link>
                    </div>

                    {/* Footer features */}
                    <div className="curved-footer-features">
                        <div className="curved-feat-col">
                            <h5>Fast Delivery</h5>
                            <p>Get your edited gallery in a short time</p>
                        </div>
                        <div className="curved-feat-divider"></div>
                        <div className="curved-feat-col">
                            <h5>Personal Approach</h5>
                            <p>Every shoot is tailored to your vision</p>
                        </div>
                        <div className="curved-feat-divider"></div>
                        <div className="curved-feat-col">
                            <h5>Natural Style</h5>
                            <p>Authentic photos with emotion and elegance</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Interactive 3D Showcase */}
            <Section3Showcase />

            {/* Section 4: Testimonials */}
            <section className="home-section testimonials-section">
                <div className="container text-center">
                    <h2 className="section-title">What Our Clients Say</h2>
                    <div className="row mt-5">
                        <div className="col-md-10 col-lg-8 mx-auto">
                            <div className="testimonial-wrapper">
                                <p className="testimonial-quote">"Ariadne has completely transformed the way we operate. Highly recommended for anyone looking to scale effortlessly and achieve professional results!"</p>
                                <footer className="testimonial-author">Jane Doe, <cite title="Source Title">CEO at TechCorp</cite></footer>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Expanding Categories Gallery */}
            <section className="home-section categories-section">
                <div className="container text-center">
                    <h2 className="section-title">Our Expertise</h2>
                    <p className="section-subtitle">Explore the diverse range of visual storytelling categories we offer.</p>

                    <div className="wrapper" style={{ height: '600px', marginTop: '20px' }}>
                        <button
                            className="carousel-btn prev-btn"
                            onClick={() => setActiveIndex(prev => prev - 1)}
                        >
                            &#10094;
                        </button>

                        <div className="inner" style={{
                            '--quantity': categories.length || 10,
                            transform: `perspective(1800px) rotateX(-15deg) rotateY(${-(360 / (categories.length || 1)) * activeIndex}deg)`
                        }}>
                            {categories.length > 0 ? categories.map((category, index) => {
                                const bgImage = getCategoryBg(category);
                                const normalizedActiveIndex = ((activeIndex % categories.length) + categories.length) % categories.length;
                                const isActive = normalizedActiveIndex === index;

                                return (
                                    <Link
                                        to={`/portfolio/${category.slug}`}
                                        className={`card ${isActive ? 'active-front' : ''}`}
                                        key={category._id}
                                        style={{ '--index': index }}
                                        onClick={(e) => {
                                            if (normalizedActiveIndex !== index) {
                                                e.preventDefault();
                                                // Calculate shortest path rotation
                                                let diff = index - normalizedActiveIndex;
                                                const half = categories.length / 2;
                                                if (diff > half) diff -= categories.length;
                                                if (diff < -half) diff += categories.length;

                                                setActiveIndex(prev => prev + diff);
                                            }
                                        }}
                                    >
                                        <div className="img" style={{ backgroundImage: `url(${bgImage})` }}></div>
                                        <div className="card-title-overlay">
                                            <h3>{category.name}</h3>
                                        </div>
                                    </Link>
                                );
                            }) : (
                                <div style={{ color: '#fff', width: '100%', padding: '2rem' }}>Loading categories...</div>
                            )}
                        </div>

                        <button
                            className="carousel-btn next-btn"
                            onClick={() => setActiveIndex(prev => prev + 1)}
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;