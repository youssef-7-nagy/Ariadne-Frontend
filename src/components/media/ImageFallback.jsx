import React, { useState } from 'react';
import { getResponsiveSrcSet, getDefaultSizes } from '../../utils/responsiveImage';

// Fallback placeholder to show when an image fails to load
const PLACEHOLDER_IMG = 'https://placehold.co/800x450/111111/333333?text=Image+Unavailable';

export const ImageFallback = ({ 
    src, 
    alt = "Media", 
    className, 
    style, 
    crossOrigin, 
    srcSet: explicitSrcSet,
    sizes: explicitSizes,
    layout = 'card',
    loading = 'lazy',
    decoding = 'async',
    ...restProps
}) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <img 
                src={PLACEHOLDER_IMG} 
                className={className} 
                style={style} 
                alt="Placeholder"
                loading={loading}
                decoding={decoding}
                {...restProps}
            />
        );
    }

    const calculatedSrcSet = explicitSrcSet || getResponsiveSrcSet(src);
    const calculatedSizes = explicitSizes || (calculatedSrcSet ? getDefaultSizes(layout) : undefined);

    return (
        <img
            src={src}
            {...(calculatedSrcSet ? { srcSet: calculatedSrcSet } : {})}
            {...(calculatedSizes ? { sizes: calculatedSizes } : {})}
            alt={alt}
            className={className}
            style={style}
            loading={loading}
            decoding={decoding}
            {...(crossOrigin ? { crossOrigin } : {})}
            onError={() => {
                console.warn(`[ImageFallback] Failed to load image: ${src}`);
                setHasError(true);
            }}
            {...restProps}
        />
    );
};
