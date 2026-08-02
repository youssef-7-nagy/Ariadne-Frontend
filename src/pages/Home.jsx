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
    { src: imgHome6257, left: '5.5%', top: '80%', rotate: -75 },
    { src: imgHome6270, left: '6%', top: '52%', rotate: -58 },
    { src: imgHome6342, left: '11.5%', top: '29%', rotate: -40 },
    { src: imgHome301, left: '22.5%', top: '13.5%', rotate: -22 },
    { src: imgHome302, left: '37.8%', top: '6%', rotate: -6 },
    { src: imgHome303, left: '52.2%', top: '6%', rotate: 6 },
    { src: imgAboutStory, left: '67.5%', top: '13.5%', rotate: 22 },
    { src: imgHome6257, left: '78.5%', top: '29%', rotate: 40 },
    { src: imgHome6270, left: '83.8%', top: '52%', rotate: 58 },
    { src: imgHome6342, left: '84.5%', top: '80%', rotate: 75 },
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
            {/* Section 1: Hero Cinematic */}
            <section className="home-hero-cinematic">
                <div className="hero-bg-container">
                    <img 
                        src={imgAboutStory} 
                        alt="Ariadne Cinematic Story" 
                        className="hero-bg-image" 
                    />
                    <div className="hero-overlay-dark"></div>
                </div>

                <div className="cinematic-content">
                    <div className="hero-top-info">
                        <span className="hero-tagline">ARIADNE CREATIVE STUDIO</span>
                        <span className="hero-gold-dot">•</span>
                        <span className="hero-location">EST. 2026</span>
                    </div>

                    <div className="center-text-block animate-fade-in">
                        <h1 className="hero-headline">
                            <span className="text-light">WE DOCUMENT</span>
                            <br />
                            <span className="text-serif-gold">CINEMATIC TRUTH</span>
                        </h1>
                        <p className="hero-subtext">
                            A premium photography and documentation agency. We craft luxurious visual assets, high-end commercial imagery, and cinematic stories for distinguished brands worldwide.
                        </p>
                        
                        <div className="hero-cta-wrapper">
                            <Link to="/portfolio" className="btn-explore-portfolio">
                                <span className="btn-text">EXPLORE PORTFOLIO</span>
                                <span className="btn-arrow-icon">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Subtle Scroll Indicator */}
                    <div className="hero-scroll-indicator">
                        <div className="scroll-mouse">
                            <div className="scroll-wheel"></div>
                        </div>
                        <span className="scroll-label">SCROLL TO DISCOVER</span>
                    </div>
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