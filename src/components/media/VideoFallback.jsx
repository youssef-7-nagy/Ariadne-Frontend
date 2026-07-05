import React, { useState, useRef, useEffect } from 'react';

// Fallback to show if video entirely fails to load
const PLACEHOLDER_IMG = 'https://placehold.co/800x450/111111/333333?text=Video+Unavailable';

export const VideoFallback = ({ 
    src, 
    poster, 
    autoPlay = false, 
    controls = true, 
    className, 
    style,
    crossOrigin = "anonymous",
    onPlay,
    onPause
}) => {
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    // If autoPlay is set and not controlled externally
    useEffect(() => {
        if (autoPlay && videoRef.current && !hasError) {
            videoRef.current.play().catch(e => {
                console.warn("[VideoFallback] Autoplay blocked or interrupted:", e);
            });
        }
    }, [autoPlay, hasError]);

    if (!src || hasError) {
        // Fallback to poster or generic placeholder
        return (
            <img 
                src={poster || PLACEHOLDER_IMG} 
                className={className} 
                style={style} 
                alt="Video fallback"
            />
        );
    }

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls={controls}
            className={className}
            style={style}
            crossOrigin={crossOrigin}
            onPlay={onPlay}
            onPause={onPause}
            preload="metadata"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => {
                console.warn(`[VideoFallback] Failed to load video: ${src}`, e);
                setHasError(true);
            }}
        />
    );
};
