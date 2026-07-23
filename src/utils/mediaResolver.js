const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

export const resolveMedia = (rawUrl) => {
    if (!rawUrl) return { type: 'unknown', src: '', isIframe: false, thumbnail: '' };

    let url = String(rawUrl).trim();

    // Extract src from iframe HTML string if user pasted raw <iframe> tag
    if (url.includes('<iframe') || url.includes('src=')) {
        const srcMatch = url.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
            url = srcMatch[1];
        }
    }

    // 1. Local Uploads
    if (url.startsWith('/uploads/')) {
        const fullUrl = `${API_URL}${url}`;
        if (url.match(/\.(mp4|mov|avi|webm|mkv|m4v|hevc)$/i)) {
            return { type: 'local_video', src: fullUrl, isIframe: false };
        }
        return { type: 'local_image', src: fullUrl, isIframe: false };
    }

    // 2. Cloudinary Direct Media
    if (url.includes('res.cloudinary.com')) {
        if (url.match(/\.(mp4|mov|avi|webm|mkv|m4v|hevc)$/i) || url.includes('/video/upload/')) {
            return { type: 'cloudinary_video', src: url, isIframe: false };
        }
        return { type: 'cloudinary_image', src: url, isIframe: false };
    }

    // 3. Cloudinary Embeds (Transform to Direct MP4 to avoid Tracking Prevention)
    if (url.includes('player.cloudinary.com/embed/')) {
        try {
            const urlObj = new URL(url);
            const cloudName = urlObj.searchParams.get('cloud_name');
            const publicId = urlObj.searchParams.get('public_id');
            if (cloudName && publicId) {
                const directUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;
                return { type: 'cloudinary_video', src: directUrl, isIframe: false };
            }
        } catch (e) {
            console.error('Failed to parse Cloudinary Embed URL:', e);
        }
        return { type: 'cloudinary_embed', src: url, isIframe: true };
    }

    // 4. YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            const match = url.match(/[?&]v=([^&]+)/);
            if (match) videoId = match[1];
            else videoId = url.split('v=')[1]?.split('&')[0] || '';
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0] || '';
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0]?.split('/')[0] || '';
        } else if (url.includes('youtube.com/shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
        } else if (url.includes('youtube.com/live/')) {
            videoId = url.split('live/')[1]?.split('?')[0]?.split('/')[0] || '';
        }

        if (videoId) {
            return {
                type: 'youtube',
                src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=1`,
                isIframe: true,
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            };
        }
    }

    // 5. Vimeo
    if (url.includes('vimeo.com')) {
        let videoId = '';
        if (url.includes('player.vimeo.com/video/')) {
            videoId = url.split('video/')[1]?.split('?')[0]?.split('/')[0] || '';
        } else {
            videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0] || '';
        }
        if (videoId) {
            return {
                type: 'vimeo',
                src: `https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1&title=0&byline=0&portrait=0&badge=0`,
                isIframe: true
            };
        }
    }

    // 6. Bunny CDN Embeds
    if (url.includes('mediadelivery.net') || url.includes('video.bunnycdn.com')) {
        return {
            type: 'bunny',
            src: `${url}${url.includes('?') ? '&' : '?'}autoplay=true&playsinline=true`,
            isIframe: true
        };
    }

    // 7. General External Image/Video
    if (url.match(/\.(mp4|mov|avi|webm|mkv|m4v|hevc)$/i)) {
        return { type: 'external_video', src: url, isIframe: false };
    }
    
    return { type: 'external_image', src: url, isIframe: false };
};
