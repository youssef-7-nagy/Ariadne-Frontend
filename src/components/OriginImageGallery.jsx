import React from 'react';
import { FilmstripGallery } from '@/components/ui/filmstrip-gallery';

/**
 * OriginImageGallery — Bridge to the new 35mm FilmstripGallery component
 * with responsive portrait and landscape photo support.
 */
const OriginImageGallery = ({
    images = [],
    title = '',
    className = '',
    aspect = 'auto',
    ...rest
}) => {
    return (
        <FilmstripGallery
            images={images}
            title={title}
            aspect={aspect}
            className={className}
            {...rest}
        />
    );
};

export default OriginImageGallery;
