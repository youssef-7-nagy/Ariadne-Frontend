import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

// Fallback to show if video entirely fails to load and no poster provided
const PLACEHOLDER_IMG = 'https://placehold.co/800x450/111111/333333?text=Video+Unavailable';

export const VideoFallback = memo(({ 
    src, 
    poster, 
    autoPlay = false, 
    muted,
    loop = false,
    controls = true, 
    className, 
    style,
    crossOrigin,
    preload = "metadata",
    onPlay,
    onPause,
    onTimeUpdate
}) => {
    const [hasError, setHasError] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    // Auto-compute muted for autoplay safety on iOS/Android
    const isMuted = muted !== undefined ? muted : (autoPlay ? true : false);

    // Viewport intersection observer to avoid loading off-screen videos
    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '350px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Handle autoPlay safely without uncaught promise rejection
    useEffect(() => {
        if (autoPlay && isInView && videoRef.current && !hasError) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // Suppress harmless interruption error when user scrolls quickly or leaves
                    if (e.name !== 'AbortError') {
                        console.warn("[VideoFallback] Autoplay notice:", e.message || e);
                    }
                });
            }
        }
    }, [autoPlay, isInView, hasError]);

    const handleLoadedData = useCallback(() => {
        setIsVideoReady(true);
    }, []);

    const handleError = useCallback((e) => {
        console.warn(`[VideoFallback] Failed to load video: ${src}`, e);
        setHasError(true);
    }, [src]);

    if (!src || hasError) {
        return (
            <div 
                ref={containerRef}
                className={className}
                style={{ position: 'relative', overflow: 'hidden', ...style }}
            >
                <img 
                    src={poster || PLACEHOLDER_IMG} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt="Video preview"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className={className}
            style={{ position: 'relative', overflow: 'hidden', ...style }}
        >
            {/* Seamless poster layer: shows instantly until video data is buffered and ready */}
            {poster && (
                <img
                    src={poster}
                    alt="Video thumbnail"
                    loading="lazy"
                    decoding="async"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                        opacity: isVideoReady ? 0 : 1,
                        transition: 'opacity 0.5s ease-out',
                        pointerEvents: 'none'
                    }}
                />
            )}

            <video
                ref={videoRef}
                src={isInView ? src : undefined}
                poster={poster}
                controls={controls}
                autoPlay={autoPlay}
                muted={isMuted}
                loop={loop}
                playsInline={true}
                webkit-playsinline="true"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
                {...(crossOrigin ? { crossOrigin } : {})}
                onPlay={onPlay}
                onPause={onPause}
                onTimeUpdate={onTimeUpdate}
                onLoadedData={handleLoadedData}
                onPlaying={handleLoadedData}
                preload={isInView ? preload : "none"}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                onError={handleError}
            />
        </div>
    );
});

VideoFallback.displayName = 'VideoFallback';
