import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
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
import imgHeroStory from '../assets/home/first.png';


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





// Section 1.5: Cloudinary Featured Cinematic Video Showcase with exact ARIA title sync & poster crossfade
const CinematicFeaturedSection = React.memo(() => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [ariaVisible, setAriaVisible] = useState(false);
    const [ariaKey, setAriaKey] = useState(0);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [hasError, setHasError] = useState(false);

    // 1. Proximity observer: buffer video shortly before entering viewport (~350px)
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || typeof IntersectionObserver === 'undefined') {
            setShouldLoad(true);
            return;
        }

        const proximityObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    proximityObserver.disconnect();
                }
            },
            { rootMargin: '350px 0px' }
        );
        proximityObserver.observe(section);

        return () => proximityObserver.disconnect();
    }, []);

    // 2. Playback controller: play when in view, pause when scrolled away
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || !shouldLoad || typeof IntersectionObserver === 'undefined') return;

        const playbackObserver = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.current;
                if (!video) return;

                if (entry.isIntersecting) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch((e) => {
                            if (e.name !== 'AbortError') {
                                console.warn('[CinematicFeaturedSection] play notice:', e.message);
                            }
                        });
                    }
                } else {
                    video.pause();
                    setAriaVisible(false);
                }
            },
            { threshold: 0.15 }
        );
        playbackObserver.observe(section);

        return () => playbackObserver.disconnect();
    }, [shouldLoad]);

    // 3. Exact 0.6s ARIA Title sync with actual video playback time
    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        const time = video.currentTime;
        if (time >= 0.6) {
            setAriaVisible(true);
        } else {
            // Video wrapped around / restarted loop
            setAriaVisible(false);
            setAriaKey(k => k + 1);
        }
    }, []);

    const handleSeeked = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.currentTime < 0.6) {
            setAriaVisible(false);
            setAriaKey(k => k + 1);
        }
    }, []);

    const handleVideoPlaying = useCallback(() => {
        setIsReady(true);
    }, []);

    const handleVideoError = useCallback(() => {
        setHasError(true);
    }, []);

    const posterUrl = "https://res.cloudinary.com/dqvclzcod/video/upload/f_auto,q_auto,so_0/GR_Final_jy5ycc.jpg";
    const videoUrl = "https://res.cloudinary.com/dqvclzcod/video/upload/f_auto,q_auto/GR_Final_jy5ycc.mp4";

    return (
        <section
            className="home-white-section cloudinary-feat-section"
            aria-label="Featured Cinematic Video"
            ref={sectionRef}
        >
            <div className="home-video-bg-wrapper">
                {/* Lightweight poster / first-frame preview: shows instantly, crossfades when video begins */}
                <img
                    src={posterUrl}
                    alt="Cinematic Video Preview"
                    className="home-video-bg-poster"
                    style={{
                        opacity: isReady && !hasError ? 0 : 1,
                        pointerEvents: 'none'
                    }}
                    loading="eager"
                    decoding="async"
                />

                {!hasError && (
                    <video
                        ref={videoRef}
                        src={shouldLoad ? videoUrl : undefined}
                        poster={posterUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline="true"
                        className="home-video-bg-video"
                        preload={shouldLoad ? "auto" : "none"}
                        onPlaying={handleVideoPlaying}
                        onCanPlayThrough={handleVideoPlaying}
                        onTimeUpdate={handleTimeUpdate}
                        onSeeked={handleSeeked}
                        onError={handleVideoError}
                    />
                )}
            </div>

            {/* Video Overlays */}
            <div className="video-vignette-top"></div>
            <div className="video-vignette-bottom"></div>

            {/* Cinematic ARIA title — appears at exactly 0.6 s after video starts */}
            <div
                key={ariaKey}
                className={`cloudinary-aria-title${ariaVisible ? ' cloudinary-aria-title--visible' : ''}`}
                aria-hidden="true"
            >
                <span className="cloudinary-aria-word">ARI<span className="reversed-a">A</span></span>
            </div>
        </section>
    );
});
CinematicFeaturedSection.displayName = 'CinematicFeaturedSection';

// Section 2: Bunny.net Video Showcase Section with lazy viewport loading
const BunnyShowcaseSection = React.memo(() => {
    const sectionRef = useRef(null);
    const iframeRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    // 1. Proximity observer: start preparing iframe when user approaches (~400px before arrival)
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || typeof IntersectionObserver === 'undefined') {
            setShouldLoad(true);
            return;
        }

        const proximityObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    proximityObserver.disconnect();
                }
            },
            { rootMargin: '400px 0px' }
        );
        proximityObserver.observe(section);

        return () => proximityObserver.disconnect();
    }, []);

    // 2. Playback controller: send play/pause commands based on viewport visibility
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || !shouldLoad || typeof IntersectionObserver === 'undefined') return;

        const sendCommand = (method, value) => {
            try {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                        JSON.stringify({
                            context: 'player.js',
                            version: '0.0.11',
                            method: method,
                            value: value
                        }),
                        '*'
                    );
                }
            } catch (_) {}
        };

        const playbackObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sendCommand('mute', '');
                    sendCommand('play', '');
                } else {
                    sendCommand('pause', '');
                }
            },
            { threshold: 0.15 }
        );
        playbackObserver.observe(section);

        return () => playbackObserver.disconnect();
    }, [shouldLoad]);

    const handleIframeLoad = useCallback(() => {
        setIsIframeLoaded(true);
        try {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({
                        context: 'player.js',
                        version: '0.0.11',
                        method: 'mute',
                        value: ''
                    }),
                    '*'
                );
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({
                        context: 'player.js',
                        version: '0.0.11',
                        method: 'play',
                        value: ''
                    }),
                    '*'
                );
            }
        } catch (_) {}
    }, []);

    return (
        <section className="home-white-section" ref={sectionRef} aria-label="Cinematic Teaser">
            <div className="home-video-bg-wrapper">
                {shouldLoad && (
                    <iframe
                        ref={iframeRef}
                        src="https://player.mediadelivery.net/embed/763964/9bb34416-21bc-41f3-80b7-2b1225696c5f?autoplay=true&loop=true&muted=true&preload=false&responsive=true"
                        loading="lazy"
                        className="home-video-bg-iframe"
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                        allowFullScreen={true}
                        tabIndex="-1"
                        title="Cinematic Background Video"
                        onLoad={handleIframeLoad}
                        style={{
                            opacity: isIframeLoaded ? 1 : 0,
                            transition: 'opacity 0.6s ease'
                        }}
                    />
                )}
            </div>

            {/* Video Overlays */}
            <div className="video-vignette-top"></div>
            <div className="video-vignette-bottom"></div>

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
                                if (window.lenis) {
                                    window.lenis.scrollTo('#footer', { duration: 1.5 });
                                } else {
                                    const footer = document.getElementById('footer');
                                    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                                }
                                setTimeout(() => {
                                    const magicMenu = document.querySelector('.magic-menu');
                                    if (magicMenu) {
                                        magicMenu.classList.add('force-open');
                                        setTimeout(() => magicMenu.classList.remove('force-open'), 3000);
                                    }
                                }, 800);
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
    );
});
BunnyShowcaseSection.displayName = 'BunnyShowcaseSection';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(600);

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






    return (
        <div className="home-container">
            {/* Section 1: Hero Visual Stories */}
            <section className="home-hero-visual-story" id="hero-intro">
                <div
                    className="visual-hero-bg"
                    style={{ backgroundImage: `url(${imgHeroStory})` }}
                ></div>
                <div className="visual-hero-overlay-vignette"></div>
                <div className="visual-hero-overlay-top"></div>
                <div className="visual-hero-overlay-bottom"></div>

                <div className="visual-hero-container">
                    <div className="visual-hero-content">
                        <span className="visual-hero-eyebrow">CINEMATIC • PHOTOGRAPHY • STORYTELLING</span>
                        <h1 className="visual-hero-title">
                            <span className="visual-hero-title-main">We Create</span>
                            <span className="visual-hero-title-italic">Visual Stories</span>
                        </h1>
                        <p className="visual-hero-desc">
                            A creative studio focused on cinematic photography and visual storytelling, turning real moments into lasting impressions.
                        </p>
                        <div className="visual-hero-cta-row">
                            <Link to="/portfolio" className="btn-visual-primary">
                                <span>View Projects</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <a
                                href="#footer"
                                className="btn-visual-secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (window.lenis) {
                                        window.lenis.scrollTo('#footer', { duration: 1.5 });
                                    } else {
                                        const footer = document.getElementById('footer');
                                        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    setTimeout(() => {
                                        const magicMenu = document.querySelector('.magic-menu');
                                        if (magicMenu) {
                                            magicMenu.classList.add('force-open');
                                            setTimeout(() => magicMenu.classList.remove('force-open'), 3000);
                                        }
                                    }, 800);
                                }}
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>

                <div className="visual-hero-pagination">
                    <span className="pagination-num active">01</span>
                    <div className="pagination-line">
                        <div className="pagination-indicator"></div>
                    </div>
                    <span className="pagination-num">04</span>
                </div>
            </section>

            {/* Section 1.5: Featured Cinematic Video Showcase */}
            <CinematicFeaturedSection />

            {/* Section 2: Video Showcase Section */}
            <BunnyShowcaseSection />


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