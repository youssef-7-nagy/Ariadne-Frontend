import React from 'react';
import { ProjectGallery } from '@/components/ui/ProjectGallery';

/**
 * OriginImageGallery — Bridge to the modern ProjectGallery component
 * with responsive portrait and landscape photo support.
 */
const OriginImageGallery = ({
    images = [],
    title = '',
    className = '',
    ...rest
}) => {
    return (
        <ProjectGallery
            images={images}
            title={title}
            className={className}
            {...rest}
        />
    );
};

export default OriginImageGallery;

