import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './ProjectGallery.css';

/**
 * Modern Thumbnail-Carousel / Gallery inspired by high-end photography portfolio branding.
 * - One large focused image in center (strictly object-fit: contain, zero cropping)
 * - Horizontal thumbnails underneath with active highlight and smooth auto-centering
 * - Previous / Next floating navigation buttons (disabled appropriately at ends)
 * - Floating dynamic counter badge (e.g. "1 / 12")
 * - Fullscreen Lightbox / Modal Viewer with keyboard (ESC, arrows) and touch swipe
 * - Touch swipe gestures for mobile / tablet
 */
export const ProjectGallery = ({
    images: rawImages = [],
    title = 'Project Gallery',
    className = '',
    style = {}
}) => {
    // Normalize images: accept array of strings (URLs) or objects
    const images = useMemo(() => {
        if (!Array.isArray(rawImages)) return [];
        return rawImages
            .map((item, idx) => {
                if (typeof item === 'string') {
                    return { src: item, alt: `${title} — Image ${idx + 1}` };
                }
                if (item && typeof item === 'object') {
                    const src = item.url || item.src || '';
                    if (!src) return null;
                    return {
                        src,
                        alt: item.alt || item.altText || `${title} — Image ${idx + 1}`,
                        caption: item.caption || ''
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [rawImages, title]);

    const total = images.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs
    const stageRef = useRef(null);
    const thumbnailsContainerRef = useRef(null);
    const thumbRefs = useRef([]);

    // Lightbox thumbnails ref
    const lbThumbsContainerRef = useRef(null);
    const lbThumbRefs = useRef([]);

    // Touch gesture tracking for main stage
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const touchStartTime = useRef(0);

    // Lightbox touch gesture tracking
    const lbTouchStartX = useRef(null);
    const lbTouchStartY = useRef(null);
    const lbTouchStartTime = useRef(0);

    // Reset index if images length changes
    useEffect(() => {
        if (activeIndex >= total && total > 0) {
            setActiveIndex(total - 1);
        }
    }, [total, activeIndex]);

    // Scroll active thumbnail smoothly into view strictly inside its container (never scroll window or body)
    useEffect(() => {
        const container = thumbnailsContainerRef.current;
        const activeThumb = thumbRefs.current[activeIndex];
        if (container && activeThumb) {
            const containerWidth = container.clientWidth;
            const thumbLeft = activeThumb.offsetLeft;
            const thumbWidth = activeThumb.offsetWidth;
            const targetScrollLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);

            container.scrollTo({
                left: Math.max(0, targetScrollLeft),
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    // Also smoothly center active thumbnail inside lightbox footer if open
    useEffect(() => {
        if (isLightboxOpen) {
            const container = lbThumbsContainerRef.current;
            const activeThumb = lbThumbRefs.current[activeIndex];
            if (container && activeThumb) {
                const containerWidth = container.clientWidth;
                const thumbLeft = activeThumb.offsetLeft;
                const thumbWidth = activeThumb.offsetWidth;
                const targetScrollLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);

                container.scrollTo({
                    left: Math.max(0, targetScrollLeft),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeIndex, isLightboxOpen]);

    const goTo = useCallback((nextIndex) => {
        if (nextIndex < 0 || nextIndex >= total || nextIndex === activeIndex) return;
        setIsAnimating(true);
        setActiveIndex(nextIndex);
        setTimeout(() => setIsAnimating(false), 200);
    }, [total, activeIndex]);

    const goPrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (activeIndex > 0) {
            goTo(activeIndex - 1);
        }
    }, [activeIndex, goTo]);

    const goNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (activeIndex < total - 1) {
            goTo(activeIndex + 1);
        }
    }, [activeIndex, total, goTo]);

    // Handle touch swipe on main stage
    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = touchStartX.current - endX;
        const deltaY = touchStartY.current - endY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const elapsed = Date.now() - touchStartTime.current;

        touchStartX.current = null;
        touchStartY.current = null;

        // Intentional swipe: deltaX dominant over vertical scroll
        if (absX > 35 && absX > absY * 1.2 && elapsed < 500) {
            if (deltaX > 0) {
                // Swipe Left -> Next Image
                goNext();
            } else {
                // Swipe Right -> Prev Image
                goPrev();
            }
        }
    };

    // Keyboard navigation when stage is focused or inside lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isLightboxOpen) {
                if (e.key === 'Escape') {
                    setIsLightboxOpen(false);
                } else if (e.key === 'ArrowLeft') {
                    if (activeIndex > 0) goTo(activeIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    if (activeIndex < total - 1) goTo(activeIndex + 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, activeIndex, total, goTo]);

    // Lock body scroll when Lightbox is active
    useEffect(() => {
        if (isLightboxOpen) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        }
    }, [isLightboxOpen]);

    if (total === 0) {
        return (
            <div className={`project-gallery ${className}`} style={style}>
                <div className="pg-main-stage" style={{ cursor: 'default' }}>
                    <span style={{ color: '#717886', fontSize: '0.95rem' }}>No gallery images available</span>
                </div>
            </div>
        );
    }

    const currentImage = images[activeIndex];

    return (
        <div className={`project-gallery ${className}`} style={style}>
            {/* ─── Main Image Stage Container ─── */}
            <div
                className="pg-main-stage"
                ref={stageRef}
                onClick={() => setIsLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                tabIndex={0}
                role="region"
                aria-label={`${title} image carousel`}
            >
                {/* Main Image strictly with object-fit: contain */}
                <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className={`pg-main-image ${isAnimating ? 'pg-animating' : ''}`}
                    loading="eager"
                    decoding="async"
                />

                {/* Subtle Expand Fullscreen Hint in Top Right */}
                <div className="pg-expand-hint" title="View Fullscreen" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                </div>

                {/* Previous Button */}
                {total > 1 && (
                    <button
                        type="button"
                        className="pg-nav-btn pg-nav-prev"
                        onClick={goPrev}
                        disabled={activeIndex === 0}
                        aria-label="Previous image"
                        title="Previous image"
                    >
                        <svg className="pg-nav-icon" viewBox="0 0 24 24">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                )}

                {/* Next Button */}
                {total > 1 && (
                    <button
                        type="button"
                        className="pg-nav-btn pg-nav-next"
                        onClick={goNext}
                        disabled={activeIndex === total - 1}
                        aria-label="Next image"
                        title="Next image"
                    >
                        <svg className="pg-nav-icon" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}

                {/* Image Counter Pill: 1 / 12 */}
                <div className="pg-counter-pill" aria-live="polite">
                    {activeIndex + 1} / {total}
                </div>
            </div>

            {/* ─── Horizontal Thumbnails Underneath ─── */}
            {total > 1 && (
                <div
                    className="pg-thumbnails-strip"
                    ref={thumbnailsContainerRef}
                    role="tablist"
                    aria-label="Image thumbnails"
                >
                    {images.map((img, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={idx}
                                ref={(el) => (thumbRefs.current[idx] = el)}
                                type="button"
                                className={`pg-thumb-btn ${isActive ? 'pg-thumb-active' : ''}`}
                                onClick={() => goTo(idx)}
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`View photo ${idx + 1}`}
                            >
                                <img
                                    src={img.src}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="pg-thumb-image"
                                    loading="lazy"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ─── Fullscreen Lightbox / Modal Viewer ─── */}
            {isLightboxOpen && createPortal(
                <div
                    className="pg-lightbox-overlay"
                    onClick={() => setIsLightboxOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Fullscreen image gallery"
                >
                    {/* Header */}
                    <div className="pg-lb-header" onClick={(e) => e.stopPropagation()}>
                        <div className="pg-lb-title-group">
                            <h3 className="pg-lb-title">{title}</h3>
                            <span className="pg-lb-counter">
                                {activeIndex + 1} / {total}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="pg-lb-close-btn"
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close fullscreen view"
                            title="Close (Esc)"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Main Stage */}
                    <div
                        className="pg-lb-stage"
                        onTouchStart={(e) => {
                            if (e.touches.length !== 1) return;
                            lbTouchStartX.current = e.touches[0].clientX;
                            lbTouchStartY.current = e.touches[0].clientY;
                            lbTouchStartTime.current = Date.now();
                        }}
                        onTouchEnd={(e) => {
                            if (lbTouchStartX.current === null || lbTouchStartY.current === null) return;
                            const endX = e.changedTouches[0].clientX;
                            const endY = e.changedTouches[0].clientY;
                            const deltaX = lbTouchStartX.current - endX;
                            const deltaY = lbTouchStartY.current - endY;
                            const absX = Math.abs(deltaX);
                            const absY = Math.abs(deltaY);
                            const elapsed = Date.now() - lbTouchStartTime.current;

                            lbTouchStartX.current = null;
                            lbTouchStartY.current = null;

                            if (absX > 35 && absX > absY * 1.2 && elapsed < 500) {
                                if (deltaX > 0 && activeIndex < total - 1) {
                                    goTo(activeIndex + 1);
                                } else if (deltaX < 0 && activeIndex > 0) {
                                    goTo(activeIndex - 1);
                                }
                            }
                        }}
                    >
                        {total > 1 && (
                            <button
                                type="button"
                                className="pg-lb-nav-btn pg-lb-nav-prev"
                                onClick={goPrev}
                                disabled={activeIndex === 0}
                                aria-label="Previous image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                        )}

                        <img
                            src={currentImage.src}
                            alt={currentImage.alt}
                            className="pg-lb-image"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {total > 1 && (
                            <button
                                type="button"
                                className="pg-lb-nav-btn pg-lb-nav-next"
                                onClick={goNext}
                                disabled={activeIndex === total - 1}
                                aria-label="Next image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Footer / Mini Thumbnails */}
                    {total > 1 && (
                        <div className="pg-lb-footer" onClick={(e) => e.stopPropagation()}>
                            <div className="pg-lb-thumbs" ref={lbThumbsContainerRef}>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        ref={(el) => (lbThumbRefs.current[idx] = el)}
                                        type="button"
                                        className={`pg-lb-thumb ${idx === activeIndex ? 'pg-lb-thumb-active' : ''}`}
                                        onClick={() => goTo(idx)}
                                        aria-label={`Go to image ${idx + 1}`}
                                    >
                                        <img src={img.src} alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProjectGallery;
