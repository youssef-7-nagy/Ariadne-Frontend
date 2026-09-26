/**
 * Responsive Image Pipeline Utility for Ariadne
 * Generates multi-resolution srcset attributes for Sharp-optimized WebP files.
 */

export const getResponsiveSrcSet = (src) => {
  if (!src || typeof src !== 'string') return '';

  // Check if it's an optimized upload from our Sharp pipeline
  const match = src.match(/^(.*\/uploads\/opt_[^.]+)(\.webp)$/i);
  if (!match) return '';

  const prefix = match[1];
  const ext = match[2];

  // Prevent double nesting if the src already has a resolution suffix
  if (prefix.endsWith('_600w') || prefix.endsWith('_1200w') || prefix.endsWith('_2400w')) {
    return '';
  }

  const thumbUrl = `${prefix}_600w${ext}`;
  const mediumUrl = `${prefix}_1200w${ext}`;
  const retinaUrl = `${prefix}_2400w${ext}`;
  const masterUrl = src;

  return `${thumbUrl} 600w, ${mediumUrl} 1200w, ${retinaUrl} 2400w, ${masterUrl} 3840w`;
};

/**
 * Standard responsive sizes attribute tailored for high-end portfolio cards and hero viewports.
 */
export const getDefaultSizes = (layout = 'card') => {
  switch (layout) {
    case 'hero':
      return '100vw';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 65vw';
    case 'card':
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
};
