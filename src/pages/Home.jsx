import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};

const HERO_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop', top: '8%', left: '15%', rotate: '-12deg', size: 'clamp(140px, 15vw, 280px)', delay: '0s' },
    { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop', top: '2%', left: '50%', rotate: '4deg', size: 'clamp(160px, 18vw, 340px)', transform: 'translateX(-50%)', delay: '1s' },
    { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop', top: '10%', right: '15%', rotate: '15deg', size: 'clamp(130px, 14vw, 260px)', delay: '2s' },
    { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop', top: '35%', left: '4%', rotate: '-22deg', size: 'clamp(110px, 12vw, 220px)', delay: '0.5s' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', top: '32%', right: '3%', rotate: '25deg', size: 'clamp(120px, 13vw, 240px)', delay: '1.5s' },
    { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', bottom: '20%', left: '12%', rotate: '-8deg', size: 'clamp(150px, 16vw, 290px)', delay: '2.5s' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop', bottom: '22%', right: '10%', rotate: '-10deg', size: 'clamp(140px, 15vw, 270px)', delay: '0.8s' },
    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', top: '70%', left: '-2%', rotate: '-35deg', size: 'clamp(90px, 10vw, 190px)', delay: '1.2s' },
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop', top: '65%', right: '0%', rotate: '32deg', size: 'clamp(100px, 11vw, 210px)', delay: '2.2s' },
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

    const getHeroImages = () => {
        return HERO_IMAGES;
    };

    return (
        <div className="home-container">
            {/* Section 1: Hero Cinematic */}
            <section className="home-hero-cinematic">
                <div className="hero-cinematic-bg">
                    <div className="hero-glow hero-glow-left"></div>
                    <div className="hero-glow hero-glow-right"></div>
                    <div className="hero-rainbow"></div>
                </div>

                <div className="floating-gallery">
                    {getHeroImages().map((img, idx) => (
                        <div 
                            key={idx} 
                            className="float-img"
                            style={{ 
                                top: img.top, 
                                left: img.left, 
                                right: img.right, 
                                bottom: img.bottom,
                                width: img.size,
                                animationDelay: img.delay,
                                '--base-rot': img.rotate,
                                '--base-trans': img.transform || 'translateX(0)',
                            }}
                        >
                            <img src={img.src} alt={`Gallery item ${idx}`} />
                        </div>
                    ))}
                </div>

                <div className="cinematic-content">
                    <div className="center-text-block">
                        <h1>Cinematic Visual<br/>Storytelling</h1>
                        <p>A premium photography and documentation agency. We capture beautiful moments and create stunning visual assets your audience will love.</p>
                        <Link to="/packages" className="btn-book-session">Discover Our Work</Link>
                    </div>

                    <div className="cinematic-features">
                        <div className="feat-item">
                            <h4>Unmatched Quality</h4>
                            <p>Premium aesthetics<br/>in every frame</p>
                        </div>
                        <div className="feat-divider"></div>
                        <div className="feat-item">
                            <h4>Artistic Vision</h4>
                            <p>Every shoot is tailored<br/>to your story</p>
                        </div>
                        <div className="feat-divider"></div>
                        <div className="feat-item">
                            <h4>Fast Delivery</h4>
                            <p>Professional results<br/>when you need them</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Exact Overlapping Cascade */}
            <section className="overlap-cascade-section">
                <div className="cascade-container">
                    
                    {/* Card 1: Beige */}
                    <div className="cascade-card card-beige">
                        <div className="cascade-top text-dark">
                            <span>ARIADNE 2026</span>
                            <span>AGENCY</span>
                        </div>
                        <h2 className="cascade-title text-dark">ARIADNE<br/>AGENCY</h2>
                        <div className="cascade-subtext text-dark">
                            <p>A PREMIUM SHOWCASE OF CINEMATIC PHOTOGRAPHY AND VISUAL DESIGN FOR BRANDS WORLDWIDE. WE TELL YOUR STORY.</p>
                        </div>
                    </div>

                    {/* Card 2: Purple */}
                    <div className="cascade-card card-purple">
                        <div className="cascade-top">
                            <span className="text-yellow">ARIADNE 2026</span>
                            <span className="text-yellow">VISION =</span>
                        </div>
                        <h2 className="cascade-title text-yellow">WE ARE<br/>VISUAL<br/>ARTISTS</h2>
                        <div className="cascade-footer text-yellow">
                            <p>GLOBAL — 24/7</p>
                        </div>
                    </div>

                    {/* Card 3: Yellow */}
                    <div className="cascade-card card-yellow">
                        <div className="cascade-top">
                            <span className="text-dark"></span>
                            <span className="text-dark">FOCUS X</span>
                        </div>
                        <div className="cascade-middle">
                            <h2 className="cascade-title-small text-dark">CINEMATIC<br/>VISUALS<br/>2026</h2>
                            <div className="cascade-img-inset">
                                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" alt="Cinematic Camera" />
                            </div>
                        </div>
                        <div className="cascade-footer text-dark">
                            <p>DUBAI — 10:20 AM</p>
                        </div>
                    </div>

                    {/* Card 4: Brown */}
                    <div className="cascade-card card-brown">
                        <div className="cascade-flex-row">
                            <div className="cascade-left-col">
                                <h2 className="cascade-title text-yellow">LET'S<br/>WORK</h2>
                                <ul className="cascade-menu text-yellow">
                                    <li>HOME</li>
                                    <li>ABOUT US</li>
                                    <li>PORTFOLIO</li>
                                    <li>SERVICES</li>
                                    <li>PACKAGES</li>
                                    <li>CONTACT</li>
                                </ul>
                            </div>
                            <div className="cascade-center-img">
                                <img src="https://images.unsplash.com/photo-1554046920-90dcac9a7c36?q=80&w=600&auto=format&fit=crop" alt="Photographer" style={{borderRadius: '50%'}} />
                            </div>
                            <div className="cascade-right-col">
                                <p className="text-yellow text-right-align">AVAILABLE FOR BRAND<br/>CAMPAIGNS, COMMERCIAL<br/>SHOOTS, AND CINEMATIC<br/>PROJECTS GLOBALLY.</p>
                                <h2 className="cascade-title text-yellow text-right-align">WITH<br/>US</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Section 3: 3D Diagonal Glass Showcase */}
            <section className="diagonal-showcase-section">
                <div className="diagonal-container">
                    <div className="diagonal-cards-wrapper">

                        {/* Card 1 */}
                        <div className="diagonal-card card-1">
                            <img src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1200&auto=format&fit=crop" alt="Romantic Chipping" className="diagonal-img" />
                            <div className="dc-gradient-overlay"></div>
                            <div className="dc-glass-shimmer"></div>
                            <div className="diagonal-content">
                                <div className="dc-top-row">
                                    <span className="dc-tag">Photography</span>
                                </div>
                                <div className="diagonal-bottom-area">
                                    <h2 className="diagonal-title">ROMANTIC<br/>CHIPPING</h2>
                                    <div className="dc-footer">
                                        <span className="dc-line"></span>
                                        <span className="dc-label">FEATURED PROJECT</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="diagonal-card card-2">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" alt="The Power of Dreams" className="diagonal-img bw-filter" />
                            <div className="dc-gradient-overlay"></div>
                            <div className="dc-glass-shimmer"></div>
                            <div className="diagonal-content">
                                <div className="dc-top-row">
                                    <span className="dc-tag">Cinematic</span>
                                </div>
                                <div className="diagonal-bottom-area">
                                    <h2 className="diagonal-title">THE POWER<br/>OF DREAMS</h2>
                                    <div className="dc-footer">
                                        <span className="dc-line"></span>
                                        <span className="dc-label">CINEMATIC VISION</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="diagonal-card card-3">
                            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop" alt="The Drive of Your Life" className="diagonal-img" />
                            <div className="dc-gradient-overlay"></div>
                            <div className="dc-glass-shimmer"></div>
                            <div className="diagonal-content">
                                <div className="dc-top-row">
                                    <span className="dc-tag">Commercial</span>
                                </div>
                                <div className="diagonal-bottom-area">
                                    <h2 className="diagonal-title">THE DRIVE<br/>OF YOUR LIFE</h2>
                                    <div className="dc-footer">
                                        <span className="dc-line"></span>
                                        <span className="dc-label">COMMERCIAL WORK</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Section 3.5: Glass Panels Showcase */}
            <section className="glass-panels-section">
                <div className="glass-panels-stage">
                    <div className="glass-panel glass-panel-1">
                        <img src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1200&auto=format&fit=crop" alt="Photography" className="glass-panel-img" />
                        <div className="glass-panel-shine"></div>
                        <div className="glass-panel-edge-light"></div>
                    </div>
                    <div className="glass-panel glass-panel-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" alt="Cinematic" className="glass-panel-img" />
                        <div className="glass-panel-shine"></div>
                        <div className="glass-panel-edge-light"></div>
                    </div>
                    <div className="glass-panel glass-panel-3">
                        <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop" alt="Commercial" className="glass-panel-img" />
                        <div className="glass-panel-shine"></div>
                        <div className="glass-panel-edge-light"></div>
                    </div>
                    <div className="glass-floor-reflection"></div>
                </div>
            </section>

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

            {/* Section 6: Call to Action */}
            <section className="home-section cta-section">
                <div className="container text-center px-3">
                    <h2 className="cta-title">Ready to Get Started?</h2>
                    <Link to="/login" className="cta-button shadow" style={{ textDecoration: 'none' }}>Join Us Today</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;