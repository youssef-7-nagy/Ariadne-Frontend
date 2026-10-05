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

    // Clean swipe-only pointer gesture lifecycle for 3D Category Carousel:
    // 1. Touch start -> store startX, startY internally (cards stay completely STATIC)
    // 2. Touch move -> track deltaX, deltaY internally (NO DOM/transform/state change)
    // 3. Touch release -> determine swipe direction -> trigger exactly ONE switch -> 0.6s animation lock
    const pointerGestureRef = useRef({
        isDown: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
        hasCommitted: false,
    });

    const handlePointerDown = (e) => {
        if (!e.isPrimary) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.target.closest('.carousel-btn')) return;

        pointerGestureRef.current = {
            isDown: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            startTime: Date.now(),
            hasCommitted: false,
        };

        const onWindowPointerMove = (moveEvt) => {
            if (moveEvt.pointerId !== e.pointerId) return;
            // Record coordinates internally ONLY - NO state change, NO transform change.
            pointerGestureRef.current.currentX = moveEvt.clientX;
            pointerGestureRef.current.currentY = moveEvt.clientY;
        };

        const cleanupListeners = () => {
            window.removeEventListener('pointermove', onWindowPointerMove);
            window.removeEventListener('pointerup', onWindowPointerUp);
            window.removeEventListener('pointercancel', onWindowPointerCancel);
        };

        const onWindowPointerUp = (upEvt) => {
            if (upEvt.pointerId !== e.pointerId) return;
            cleanupListeners();
            handlePointerEnd(upEvt);
        };

        const onWindowPointerCancel = (cancelEvt) => {
            if (cancelEvt.pointerId !== e.pointerId) return;
            cleanupListeners();
            handlePointerCancel(cancelEvt);
        };

        window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
        window.addEventListener('pointerup', onWindowPointerUp, { passive: true });
        window.addEventListener('pointercancel', onWindowPointerCancel, { passive: true });
    };

    const handlePointerEnd = (e) => {
        const g = pointerGestureRef.current;
        if (!g.isDown || g.pointerId !== e.pointerId) return;

        g.isDown = false;

        const deltaX = e.clientX - g.startX;
        const deltaY = e.clientY - g.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const deltaTime = Date.now() - g.startTime;

        // Swipe evaluation:
        // Deliberate swipe: >= 40px horizontal movement
        // Quick flick: < 300ms with >= 25px horizontal movement
        // In all cases, horizontal movement must exceed vertical movement (preserves page scrolling)
        const isFlick = deltaTime < 300 && absX >= 25;
        const isDeliberateSwipe = absX >= 40;
        const isValidHorizontalSwipe = (isFlick || isDeliberateSwipe) && absX > absY;

        if (isValidHorizontalSwipe && !g.hasCommitted) {
            g.hasCommitted = true;

            // Suppress synthetic clicks from this swipe gesture
            hasSwipedRef.current = true;
            if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
            clickSuppressTimerRef.current = setTimeout(() => {
                hasSwipedRef.current = false;
            }, 500);

            // Execute ONE switch ONLY if not currently animating (animation lock)
            if (!isAnimatingRef.current) {
                // Swipe LEFT (deltaX < 0) -> Carousel switches ONE position LEFT / shows next card
                // Swipe RIGHT (deltaX > 0) -> Carousel switches ONE position RIGHT / shows previous card
                if (deltaX < 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
            }
        } else if (absX > 10 || absY > 10) {
            // Dragged slightly (>10px) but didn't meet swipe threshold:
            // Suppress accidental click navigation without moving carousel
            hasSwipedRef.current = true;
            if (clickSuppressTimerRef.current) clearTimeout(clickSuppressTimerRef.current);
            clickSuppressTimerRef.current = setTimeout(() => {
                hasSwipedRef.current = false;
            }, 300);
        }
    };

    const handlePointerCancel = (e) => {
        const g = pointerGestureRef.current;
        if (g.isDown && g.pointerId === e.pointerId) {
            g.isDown = false;
            g.hasCommitted = false;
        }
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
                        className="wrapper"
                        style={{ height: `${carouselHeight}px`, marginTop: '20px' }}
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
                                            if (normalizedActiveIndex !== index) {
                                                e.preventDefault();
                                                if (isAnimatingRef.current) return;
                                                isAnimatingRef.current = true;
                                                if (animTimerRef.current) clearTimeout(animTimerRef.current);
                                                animTimerRef.current = setTimeout(() => {
                                                    isAnimatingRef.current = false;
                                                }, 600);

                                                // Calculate shortest path rotation
                                                let diff = index - normalizedActiveIndex;
                                                const half = categories.length / 2;
                                                if (diff > half) diff -= categories.length;
                                                if (diff < -half) diff += categories.length;

                                                setActiveIndex(prev => prev + diff);
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