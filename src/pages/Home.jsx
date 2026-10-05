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
import HighlightsSection from '../components/HighlightsSection';


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
        }
    }, []);

    const handleSeeked = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.currentTime < 0.6) {
            setAriaVisible(false);
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
                className={`cloudinary-aria-title${ariaVisible ? ' cloudinary-aria-title--visible' : ''}`}
                aria-hidden="true"
            >
                <span className="cloudinary-aria-word">ARI<span className="reversed-a">A</span></span>
            </div>
        </section>
    );
});
CinematicFeaturedSection.displayName = 'CinematicFeaturedSection';

// Section 2: Video Showcase Section with Cloudinary video
const VideoShowcaseSection = React.memo(() => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    // 1. Proximity observer: start preparing video when user approaches (~400px before arrival)
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

    // 2. Playback controller: play/pause based on viewport visibility
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
                                console.warn('[VideoShowcaseSection] play notice:', e.message);
                            }
                        });
                    }
                } else {
                    video.pause();
                }
            },
            { threshold: 0.15 }
        );
        playbackObserver.observe(section);

        return () => playbackObserver.disconnect();
    }, [shouldLoad]);

    const handleVideoPlaying = useCallback(() => {
        setIsReady(true);
    }, []);

    const handleVideoError = useCallback(() => {
        setHasError(true);
    }, []);

    const posterUrl = "https://res.cloudinary.com/dqvclzcod/video/upload/f_auto,q_auto,so_0/Basha_E3temed_Teaser_rnogeb.jpg";
    const videoUrl = "https://res.cloudinary.com/dqvclzcod/video/upload/f_auto,q_auto/Basha_E3temed_Teaser_rnogeb.mp4";

    return (
        <section className="home-white-section" ref={sectionRef} aria-label="Cinematic Teaser">
            <div className="home-video-bg-wrapper">
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
                        onError={handleVideoError}
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
VideoShowcaseSection.displayName = 'VideoShowcaseSection';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(600);

    // Touch-device vs desktop detection:
    // On phones & tablets (iPhone, iPad, Android), all hover behavior is completely disabled.
    // Desktop mouse keeps existing hover interactions.
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
        // Desktop mouse vs touch screen detection
        const hasCoarse = window.matchMedia('(pointer: coarse)').matches;
        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (!hasTouch && !hasCoarse && hasHover) {
            setCanHover(true);
        }

        const onPointerMove = (e) => {
            if (e.pointerType === 'mouse') {
                setCanHover(prev => prev ? prev : true);
            }
        };

        const onTouchStart = () => {
            setCanHover(prev => prev ? false : prev);
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('touchstart', onTouchStart, { passive: true });

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('touchstart', onTouchStart);
        };
    }, []);

    // Animation locking to prevent gesture collision and transform corruption
    const isAnimatingRef = useRef(false);
    const animTimerRef = useRef(null);
    const hasSwipedRef = useRef(false);
    const clickSuppressTimerRef = useRef(null);

    const handlePrev = useCallback(() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => {
            isAnimatingRef.current = false;
        }, 600);

        setActiveIndex(prev => prev - 1);
    }, []);

    const handleNext = useCallback(() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => {
            isAnimatingRef.current = false;
        }, 600);

        setActiveIndex(prev => prev + 1);
    }, []);

    // Dedicated Touch Gesture Lifecycle for 3D Categories Carousel:
    // 1. Touch start -> record coordinates (cards remain 100% STATIC, NO live drag, NO transform change)
    // 2. Touch move -> monitor trajectory (if vertical > horizontal, allow page scroll; if horizontal, track delta)
    // 3. Touch release -> determine swipe direction -> switch ONE category -> 0.6s animation lock
    const touchGestureRef = useRef({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
        isSwiping: false,
        isScrolling: false,
    });

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        if (e.target.closest('.carousel-btn')) return;

        const touch = e.touches[0];
        touchGestureRef.current = {
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY,
            startTime: Date.now(),
            isSwiping: false,
            isScrolling: false,
        };
    };

    const handleTouchMove = (e) => {
        const g = touchGestureRef.current;
        if (!g.startTime || e.touches.length !== 1) return;

        const touch = e.touches[0];
        g.currentX = touch.clientX;
        g.currentY = touch.clientY;

        const deltaX = g.currentX - g.startX;
        const deltaY = g.currentY - g.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (!g.isSwiping && !g.isScrolling) {
            if (absY > absX && absY > 7) {
                // Vertical motion dominates -> preserve native browser page scroll
                g.isScrolling = true;
                return;
            }
            if (absX > absY && absX > 7) {
                // Horizontal motion dominates -> carousel swipe
                g.isSwiping = true;
            }
        }
        // Note: No live dragging of cards! The cards stay completely static while the finger is moving.
    };

    const handleTouchEnd = () => {
        const g = touchGestureRef.current;
        if (!g.startTime) return;

        const deltaX = g.currentX - g.startX;
        const deltaY = g.currentY - g.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const deltaTime = Date.now() - g.startTime;
        const wasScrolling = g.isScrolling;

        g.startTime = 0; // reset active touch

        if (wasScrolling) return;

        // Evaluation: Deliberate swipe >= 35px or quick flick < 300ms with >= 20px
        const isFlick = deltaTime < 300 && absX >= 20;
        const isDeliberateSwipe = absX >= 35;
        const isValidHorizontalSwipe = (isFlick || isDeliberateSwipe) && absX > absY;

        if (isValidHorizontalSwipe) {
            hasSwipedRef.current = true;
            if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
            clickSuppressTimerRef.current = setTimeout(() => {
                hasSwipedRef.current = false;
            }, 450);

            // Trigger ONE switch ONLY upon release
            if (!isAnimatingRef.current) {
                if (deltaX < 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
            }
        } else if (absX > 10 || absY > 10) {
            // Dragged slightly but didn't meet threshold -> suppress accidental click navigation
            hasSwipedRef.current = true;
            if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
            clickSuppressTimerRef.current = setTimeout(() => {
                hasSwipedRef.current = false;
            }, 300);
        }
    };

    const handleTouchCancel = () => {
        touchGestureRef.current.startTime = 0;
    };

    // Desktop mouse pointer gesture (for desktop mouse drag support)
    const mouseGestureRef = useRef({
        isDown: false,
        startX: 0,
        startY: 0,
    });

    const handlePointerDown = (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        if (e.target.closest('.carousel-btn')) return;

        mouseGestureRef.current = {
            isDown: true,
            startX: e.clientX,
            startY: e.clientY,
        };

        const onWindowPointerUp = (upEvt) => {
            window.removeEventListener('pointerup', onWindowPointerUp);
            const g = mouseGestureRef.current;
            if (!g.isDown) return;
            g.isDown = false;

            const deltaX = upEvt.clientX - g.startX;
            const deltaY = upEvt.clientY - g.startY;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX >= 40 && absX > absY) {
                hasSwipedRef.current = true;
                if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
                clickSuppressTimerRef.current = setTimeout(() => {
                    hasSwipedRef.current = false;
                }, 400);

                if (!isAnimatingRef.current) {
                    if (deltaX < 0) {
                        handleNext();
                    } else {
                        handlePrev();
                    }
                }
            }
        };

        window.addEventListener('pointerup', onWindowPointerUp, { once: true });
    };

    useEffect(() => {
        return () => {
            if (animTimerRef.current) clearTimeout(animTimerRef.current);
            if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
        };
    }, []);

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
            {/* Section 1.5: Featured Cinematic Video Showcase */}
            <CinematicFeaturedSection />

            {/* New Section: Highlights (3 image cards with brand logo) */}
            <HighlightsSection />



            {/* Section 2: Video Showcase Section */}
            <VideoShowcaseSection />


            {/* Section 5: Expanding Categories Gallery */}

            <section className="home-section categories-section">
                <div className="container text-center">
                    <h2 className="section-title">Our Expertise</h2>
                    <p className="section-subtitle">Explore the diverse range of visual storytelling categories we offer.</p>

                    <div
                        className={`wrapper ${canHover ? 'can-hover' : ''}`}
                        style={{ height: `${carouselHeight}px`, marginTop: '20px' }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                        onPointerDown={handlePointerDown}
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
                                        draggable={false}
                                        onDragStart={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                            if (hasSwipedRef.current) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                return;
                                            }
                                            // Only the active front card is clickable (to open its category portfolio).
                                            // Non-active cards in the 3D model do NOT rotate or jump when clicked.
                                            if (!isActive) {
                                                e.preventDefault();
                                                return;
                                            }
                                        }}
                                    >
                                        <div className="img" draggable={false} style={{ backgroundImage: `url("${bgImage}")` }}></div>
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