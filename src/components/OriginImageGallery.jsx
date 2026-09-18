import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';
import './OriginImageGallery.css';

/**
 * OriginImageGallery — An animated image gallery with an active center card flanked by
 * portrait preview cards on the left and right, featuring smooth sliding/morphing motion,
 * responsive mobile peek, touch gestures, and a fullscreen lightbox.
 */
const OriginImageGallery = ({
    images = [],
    title = '',
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const containerRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const total = images.length;

    const goTo = useCallback((targetIndex) => {
        if (total <= 1 || isAnimating) return;
        setIsAnimating(true);
        const next = ((targetIndex % total) + total) % total;
        setCurrentIndex(next);
        setTimeout(() => {
            setIsAnimating(false);
        }, 520);
    }, [total, isAnimating]);

    const handleNext = useCallback(() => {
        goTo(currentIndex + 1);
    }, [goTo, currentIndex]);

    const handlePrev = useCallback(() => {
        goTo(currentIndex - 1);
    }, [goTo, currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxOpen) {
                if (e.key === 'Escape') setLightboxOpen(false);
                if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % total);
                if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + total) % total);
                return;
            }
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, lightboxOpen, total]);

    // Touch swipe handling
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const deltaX = touchStartX.current - e.changedTouches[0].clientX;
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;

        // Horizontal dominance and threshold
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (!images || images.length === 0) {
        return null;
    }

    // Indices for flanking cards
    const prevIdx = (currentIndex - 1 + total) % total;
    const nextIdx = (currentIndex + 1) % total;
    const currentImg = images[currentIndex];
    const prevImg = images[prevIdx];
    const nextImg = images[nextIdx];

    return (
        <div className={`origingallery-wrapper ${className}`} ref={containerRef}>
            {/* Header / Info Row */}
            <div className="origingallery-header">
                <div className="origingallery-badge">
                    <span className="origingallery-badge-dot" />
                    <span className="origingallery-badge-text">
                        {title ? `${title} · Photos` : 'Photo Gallery'}
                    </span>
                </div>
                <div className="origingallery-counter">
                    <span className="current-num">{String(currentIndex + 1).padStart(2, '0')}</span>
                    <span className="separator">/</span>
                    <span className="total-num">{String(total).padStart(2, '0')}</span>
                </div>
            </div>

            {isMobile ? (
                /* Mobile Grid Layout */
                <div className="origingallery-mobile-grid">
                    {images.map((img, idx) => (
                        <div 
                            key={idx} 
                            className={`origingallery-mobile-item ${images.length === 1 ? 'single' : ''}`}
                            onClick={() => openLightbox(idx)}
                        >
                            <img src={img} alt={`Gallery item ${idx + 1}`} loading="lazy" />
                            <div className="origingallery-zoom-hint"><FiMaximize2 /></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                {/* Main Stage (Desktop Slider) */}
                <div
                    className="origingallery-stage"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                {/* Left Card (Previous) */}
                {total > 1 && (
                    <div
                        className="origingallery-card origingallery-card-side origingallery-card-left"
                        onClick={handlePrev}
                        role="button"
                        aria-label="Previous photo"
                    >
                        <div className="origingallery-card-inner">
                            <img
                                src={prevImg}
                                alt={`Previous preview ${prevIdx + 1}`}
                                loading="lazy"
                            />
                            <div className="origingallery-side-overlay" />
                        </div>
                    </div>
                )}

                {/* Center Card (Active) */}
                <div className="origingallery-card origingallery-card-center">
                    <div
                        className="origingallery-card-inner"
                        onClick={() => openLightbox(currentIndex)}
                        title="Click to view full photo"
                    >
                        <img
                            src={currentImg}
                            alt={`Photo ${currentIndex + 1}`}
                        />
                        <div className="origingallery-active-gradient" />
                        
                        {/* Zoom hint badge */}
                        <div className="origingallery-zoom-btn" aria-label="Expand image">
                            <FiMaximize2 />
                        </div>
                    </div>

                    {/* Navigation buttons on active card */}
                    {total > 1 && (
                        <>
                            <button
                                type="button"
                                className="origingallery-nav-btn origingallery-prev-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                aria-label="Previous photo"
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                type="button"
                                className="origingallery-nav-btn origingallery-next-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                aria-label="Next photo"
                            >
                                <FiChevronRight />
                            </button>
                        </>
                    )}
                </div>

                {/* Right Card (Next) */}
                {total > 1 && (
                    <div
                        className="origingallery-card origingallery-card-side origingallery-card-right"
                        onClick={handleNext}
                        role="button"
                        aria-label="Next photo"
                    >
                        <div className="origingallery-card-inner">
                            <img
                                src={nextImg}
                                alt={`Next preview ${nextIdx + 1}`}
                                loading="lazy"
                            />
                            <div className="origingallery-side-overlay" />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Dots & Quick Jump Strip */}
            {total > 1 && (
                <div className="origingallery-footer">
                    <div className="origingallery-dots" role="tablist" aria-label="Gallery photos">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`origingallery-dot ${i === currentIndex ? 'active' : ''}`}
                                onClick={() => goTo(i)}
                                aria-label={`Go to photo ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            </>
            )}

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="origingallery-lightbox" onClick={() => setLightboxOpen(false)}>
                    <button
                        type="button"
                        className="origingallery-lightbox-close"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close full view"
                    >
                        <FiX />
                    </button>

                    {total > 1 && (
                        <>
                            <button
                                type="button"
                                className="origingallery-lightbox-nav origingallery-lightbox-prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => (prev - 1 + total) % total);
                                }}
                                aria-label="Previous image"
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                type="button"
                                className="origingallery-lightbox-nav origingallery-lightbox-next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => (prev + 1) % total);
                                }}
                                aria-label="Next image"
                            >
                                <FiChevronRight />
                            </button>
                        </>
                    )}

                    <div className="origingallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[lightboxIndex]}
                            alt={`Fullscreen photo ${lightboxIndex + 1}`}
                        />
                        <div className="origingallery-lightbox-info">
                            <span>{lightboxIndex + 1} / {total}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OriginImageGallery;
