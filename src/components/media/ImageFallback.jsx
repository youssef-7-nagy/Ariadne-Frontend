import React, { useState } from 'react';

// Fallback placeholder to show when an image fails to load
const PLACEHOLDER_IMG = 'https://placehold.co/800x450/111111/333333?text=Image+Unavailable';

export const ImageFallback = ({ src, alt = "Media", className, style, crossOrigin = "anonymous" }) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <img 
                src={PLACEHOLDER_IMG} 
                className={className} 
                style={style} 
                alt="Placeholder"
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            crossOrigin={crossOrigin}
            onError={(e) => {
                console.warn(`[ImageFallback] Failed to load image: ${src}`);
                setHasError(true);
            }}
        />
    );
};
