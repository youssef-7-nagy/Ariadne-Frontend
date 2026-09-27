import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import testVideo from '../assets/home/Test.mp4';
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

import { API_URL } from '../utils/apiUrl';


const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};





const Home = () => {
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(600);
    const videoTrackRef = useRef(null);
    const scrollVideoRef = useRef(null);
    const targetProgressRef = useRef(0);
    const currentRenderedTimeRef = useRef(0);
    const durationRef = useRef(0);
    const isSeekingRef = useRef(false);
    const pendingTimeRef = useRef(null);

    const handlePrev = useCallback(() => {
        setActiveIndex(prev => prev - 1);
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex(prev => prev + 1);
    }, []);

    // Touch & Swipe gesture interaction for 3D Category Carousel
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const hasSwipedRef = useRef(false);
    const isSwipingActiveRef = useRef(false);
    const isVerticalScrollRef = useRef(false);
    const lastSwipeTimeRef = useRef(0);
    const SWIPE_THRESHOLD = 40;

    const handlePointerDown = (e) => {
        if (!e.isPrimary) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.target.closest('.carousel-btn')) return;

        touchStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        };
        hasSwipedRef.current = false;
        isSwipingActiveRef.current = true;
        isVerticalScrollRef.current = false;
    };

    const handlePointerMove = (e) => {
        if (!isSwipingActiveRef.current || hasSwipedRef.current) return;

        const deltaX = e.clientX - touchStartRef.current.x;
        const deltaY = e.clientY - touchStartRef.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // If vertical movement is dominant early, allow native page scroll
        if (!isVerticalScrollRef.current && absY > absX && absY > 10) {
            isVerticalScrollRef.current = true;
            return;
        }

        if (isVerticalScrollRef.current) return;

        // Check horizontal swipe threshold
        if (absX >= SWIPE_THRESHOLD && absX > absY) {
            const now = Date.now();
            if (now - lastSwipeTimeRef.current < 250) return;
            lastSwipeTimeRef.current = now;

            hasSwipedRef.current = true;
            isSwipingActiveRef.current = false;

            // Direction mapping: SWIPE RIGHT -> PREV (moves carousel RIGHT), SWIPE LEFT -> NEXT (moves carousel LEFT)
            if (deltaX > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
    };

    const handlePointerUp = (e) => {
        if (!isSwipingActiveRef.current) {
            setTimeout(() => {
                hasSwipedRef.current = false;
            }, 150);
            return;
        }

        // Support quick flick if pointermove did not cross threshold yet
        if (!hasSwipedRef.current && !isVerticalScrollRef.current) {
            const deltaX = e.clientX - touchStartRef.current.x;
            const deltaY = e.clientY - touchStartRef.current.y;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX >= SWIPE_THRESHOLD && absX > absY) {
                const now = Date.now();
                if (now - lastSwipeTimeRef.current >= 250) {
                    lastSwipeTimeRef.current = now;
                    hasSwipedRef.current = true;
                    if (deltaX > 0) {
                        handlePrev();
                    } else {
                        handleNext();
                    }
                }
            }
        }

        isSwipingActiveRef.current = false;
        setTimeout(() => {
            hasSwipedRef.current = false;
        }, 150);
    };

    const handlePointerCancel = () => {
        isSwipingActiveRef.current = false;
        isVerticalScrollRef.current = false;
        setTimeout(() => {
            hasSwipedRef.current = false;
        }, 150);
    };

    const updateCarouselHeight = useCallback(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w <= 360) setCarouselHeight(Math.min(350, Math.max(300, Math.round(h * 0.48))));
        else if (w <= 480) setCarouselHeight(Math.min(390, Math.max(330, Math.round(h * 0.5))));
        else if (w <= 600) setCarouselHeight(440);
        else if (w <= 768) setCarouselHeight(500);
        else if (w <= 1024) setCarouselHeight(540);
        else setCarouselHeight(600);
    }, []);

    useEffect(() => {
        let timer;
        const debouncedResize = () => {
            clearTimeout(timer);
            timer = setTimeout(updateCarouselHeight, 100);
        };
        updateCarouselHeight();
        window.addEventListener('resize', debouncedResize, { passive: true });
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', debouncedResize);
        };
    }, [updateCarouselHeight]);

    const getCategoryBg = (category) => {
        return (category.coverImage ? resolveUrl(category.coverImage) : LOCAL_IMAGE_MAP[category.slug]) || '';
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

    const updateScrollProgress = useCallback(() => {
        if (!videoTrackRef.current) return;
        const rect = videoTrackRef.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const scrollableDistance = rect.height - vh;
        if (scrollableDistance <= 0) return;

        // 0% when top of section aligns with viewport top, 100% when pinned scroll finishes
        const rawProgress = -rect.top / scrollableDistance;
        const progress = Math.max(0, Math.min(1, rawProgress));
        targetProgressRef.current = progress;
    }, []);

    const handleVideoMetadata = () => {
        const video = scrollVideoRef.current;
        if (video) {
            durationRef.current = video.duration || 0;
            video.pause();
            try {
                video.currentTime = 0.001;
            } catch {
                video.currentTime = 0;
            }
            updateScrollProgress();
        }
    };

    useEffect(() => {
        const video = scrollVideoRef.current;
        let animationFrameId;

        const handleSeeked = () => {
            isSeekingRef.current = false;
            if (pendingTimeRef.current !== null && scrollVideoRef.current) {
                const next = pendingTimeRef.current;
                pendingTimeRef.current = null;
                isSeekingRef.current = true;
                try {
                    scrollVideoRef.current.currentTime = next;
                } catch {
                    isSeekingRef.current = false;
                }
            }
        };

        const handleSeeking = () => {
            isSeekingRef.current = true;
        };

        if (video) {
            video.addEventListener('seeked', handleSeeked);
            video.addEventListener('seeking', handleSeeking);
        }

        const updateVideoFrame = () => {
            const duration = durationRef.current || (video && video.duration) || 0;

            if (video && duration > 0) {
                const targetTime = targetProgressRef.current * duration;
                const diff = targetTime - currentRenderedTimeRef.current;

                // Fluid lerp smoothing for cinematic playback
                if (Math.abs(diff) > 0.001) {
                    currentRenderedTimeRef.current += diff * 0.20;

                    if (video.readyState >= 1) {
                        if (!isSeekingRef.current) {
                            isSeekingRef.current = true;
                            try {
                                video.currentTime = currentRenderedTimeRef.current;
                            } catch {
                                isSeekingRef.current = false;
                            }
                        } else {
                            pendingTimeRef.current = currentRenderedTimeRef.current;
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(updateVideoFrame);
        };

        animationFrameId = requestAnimationFrame(updateVideoFrame);

        const onScroll = () => {
            updateScrollProgress();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        updateScrollProgress();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (video) {
                video.removeEventListener('seeked', handleSeeked);
                video.removeEventListener('seeking', handleSeeking);
            }
        };
    }, [updateScrollProgress]);




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
                                <span>View Projects</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                </svg>
                            </Link>
                            <a
                                href="#footer"
                                className="hero-btn-cool-contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const footer = document.getElementById('footer');
                                    if (footer) {
                                        footer.scrollIntoView({ behavior: 'smooth' });
                                        setTimeout(() => {
                                            const magicMenu = document.querySelector('.magic-menu');
                                            if (magicMenu) {
                                                magicMenu.classList.add('force-open');
                                                setTimeout(() => magicMenu.classList.remove('force-open'), 3000);
                                            }
                                        }, 800);
                                    }
                                }}
                            >
                                Contact Us
                            </a>
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

                            <img
                                src={imgAboutStory}
                                alt="Ariadne Photographer"
                                className="hero-framed-photo"
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                            />


                        </div>
                    </div>

                </div>



                {/* === Scroll indicator === */}
                <div className="hero-scroll">
                    <div className="hero-scroll-line"></div>
                    <span>SCROLL</span>
                </div>

            </section>





            {/* Section 2: Scroll-Driven Cinematic Video Showcase Section */}
            <div ref={videoTrackRef} className="home-video-scroll-track">
                <section className="home-white-section pinned-scroll-section" aria-label="Cinematic Teaser">
                    <div className="home-video-bg-wrapper">
                        <video
                            ref={scrollVideoRef}
                            src={testVideo}
                            className="home-video-scrub-element"
                            muted
                            playsInline
                            preload="auto"
                            onLoadedMetadata={handleVideoMetadata}
                            aria-hidden="true"
                        />
                        <div className="home-video-overlay-vignette" />
                    </div>

                {/* Bottom features bar */}
                <div className="video-bottom-features">
                    <div className="curved-feat-col">
                        <h5>Fast Delivery</h5>
                        <p>Get your edited gallery in a short time</p>
                    </div>
                    <div className="curved-feat-divider"></div>
                    <div className="curved-feat-col" style={{ position: 'relative' }}>
                        {/* Center Video CTA */}
                        <div className="video-center-cta">
                            <a
                                href="#footer"
                                className="btn-book-session-curved"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const footer = document.getElementById('footer');
                                    if (footer) {
                                        footer.scrollIntoView({ behavior: 'smooth' });
                                        setTimeout(() => {
                                            const magicMenu = document.querySelector('.magic-menu');
                                            if (magicMenu) {
                                                magicMenu.classList.add('force-open');
                                                setTimeout(() => magicMenu.classList.remove('force-open'), 3000);
                                            }
                                        }, 800);
                                    }
                                }}
                            >
                                Contact Us
                            </a>
                        </div>
                        <h5>Personal Approach</h5>
                        <p>Every shoot is tailored to your vision</p>
                    </div>
                    <div className="curved-feat-divider"></div>
                    <div className="curved-feat-col">
                        <h5>Natural Style</h5>
                        <p>Authentic photos with emotion and elegance</p>
                    </div>
                </div>
            </section>
        </div>


            {/* Section 5: Expanding Categories Gallery */}

            <section className="home-section categories-section">
                <div className="container text-center">
                    <h2 className="section-title">Our Expertise</h2>
                    <p className="section-subtitle">Explore the diverse range of visual storytelling categories we offer.</p>

                    <div
                        className="wrapper"
                        style={{ height: `${carouselHeight}px`, marginTop: '20px' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onClickCapture={(e) => {
                            if (hasSwipedRef.current) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                    >
                        <button
                            className="carousel-btn prev-btn"
                            onClick={handlePrev}
                            aria-label="Previous category"
                        >
                            &#10094;
                        </button>

                        <div className="inner" style={{
                            '--quantity': categories.length || 10,
                            transform: `perspective(var(--perspective, 1800px)) rotateX(var(--rotateX, -15deg)) rotateY(${-(360 / (categories.length || 1)) * activeIndex}deg)`
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
                                        <div className="img" style={{ backgroundImage: `url("${bgImage}")` }}></div>
                                        <div className="card-title-overlay">
                                            <h3>{category.name}</h3>
                                        </div>
                                    </Link>
                                );
                            }) : (
                                <div style={{ color: '#fff', width: '100%', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                                    <LoadingSpinner />
                                </div>
                            )}
                        </div>

                        <button
                            className="carousel-btn next-btn"
                            onClick={handleNext}
                            aria-label="Next category"
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