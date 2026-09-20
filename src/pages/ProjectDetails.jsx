import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveMedia } from '../utils/mediaResolver';
import { ImageFallback } from '../components/media/ImageFallback';
import { VideoFallback } from '../components/media/VideoFallback';
import OriginImageGallery from '../components/OriginImageGallery';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import './Portfolio.css';

import { API_URL } from '../utils/apiUrl';


const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};



/**
 * Extract a YouTube video ID from common YouTube URL formats.
 * Returns the video ID string or null if not a YouTube URL.
 */
const extractYoutubeVideoId = (url) => {
    if (!url) return null;
    const str = String(url).trim();

    // youtube.com/watch?v=VIDEO_ID
    if (str.includes('youtube.com/watch')) {
        const match = str.match(/[?&]v=([^&#]+)/);
        return match ? match[1] : null;
    }
    // youtu.be/VIDEO_ID
    if (str.includes('youtu.be/')) {
        const id = str.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0]?.split('#')[0];
        return id || null;
    }
    // youtube.com/embed/VIDEO_ID
    if (str.includes('youtube.com/embed/')) {
        const id = str.split('embed/')[1]?.split('?')[0]?.split('/')[0]?.split('#')[0];
        return id || null;
    }
    // youtube.com/shorts/VIDEO_ID
    if (str.includes('youtube.com/shorts/')) {
        const id = str.split('shorts/')[1]?.split('?')[0]?.split('/')[0]?.split('#')[0];
        return id || null;
    }
    // youtube.com/live/VIDEO_ID
    if (str.includes('youtube.com/live/')) {
        const id = str.split('live/')[1]?.split('?')[0]?.split('/')[0]?.split('#')[0];
        return id || null;
    }
    return null;
};





const CustomVideoPlayer = ({ src, poster, fallbackPosters = [], isPortrait = false }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const iframeRef = React.useRef(null);

    // Use the smart media resolver
    const resolvedMedia = React.useMemo(() => resolveMedia(src), [src]);
    const finalSrc = resolvedMedia.src;
    const isIframe = resolvedMedia.isIframe;

    // Collect all candidate thumbnail URLs in priority order
    const candidatePosters = React.useMemo(() => {
        const list = [];
        if (poster) list.push(poster);
        if (fallbackPosters && fallbackPosters.length > 0) {
            fallbackPosters.forEach(p => {
                if (p && !list.includes(p)) list.push(p);
            });
        }
        if (resolvedMedia?.thumbnail && !list.includes(resolvedMedia.thumbnail)) {
            list.push(resolvedMedia.thumbnail);
        }
        if (resolvedMedia?.fallbackThumbnail && !list.includes(resolvedMedia.fallbackThumbnail)) {
            list.push(resolvedMedia.fallbackThumbnail);
        }
        return list;
    }, [poster, fallbackPosters, resolvedMedia]);

    const [posterIndex, setPosterIndex] = React.useState(0);
    const hasAllPostersFailed = candidatePosters.length === 0 || posterIndex >= candidatePosters.length;

    const handlePosterError = () => {
        setPosterIndex(prev => prev + 1);
    };

    const currentPoster = candidatePosters[posterIndex];

    const handlePlayClick = (e) => {
        if (e) e.stopPropagation();
        setIsPlaying(true);
    };

    const handleIframeLoad = () => {
        try {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                iframeRef.current.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
        } catch (e) {
            // cross-origin fail-safe
        }
    };

    return (
        <div className={`pd-video-wrapper ${isPortrait ? 'pd-video-portrait' : ''}`}>
            {!isPlaying ? (
                <div
                    className="pd-video-poster-container"
                    onClick={handlePlayClick}
                    onTouchEnd={handlePlayClick}
                >
                    {currentPoster && !hasAllPostersFailed ? (
                        <img
                            src={currentPoster}
                            className="pd-video-poster-img"
                            alt="Video thumbnail"
                            onError={handlePosterError}
                        />
                    ) : (
                        <div className="pd-video-poster-placeholder">
                            <span className="pd-video-poster-fallback-text">Click to Play</span>
                        </div>
                    )}
                    <button className="pd-play-overlay-btn" aria-label="Play video" onClick={handlePlayClick}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            ) : isIframe ? (
                <iframe
                    ref={iframeRef}
                    src={finalSrc}
                    onLoad={handleIframeLoad}
                    className="pd-video-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    playsInline
                />
            ) : (
                <VideoFallback
                    src={finalSrc}
                    poster={currentPoster}
                    controls={true}
                    autoPlay={true}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{ display: "block", width: "100%", height: "100%" }}
                />
            )}
        </div>
    );
};

const ProjectDetails = () => {
    const { projectSlug } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/portfolio/project/${projectSlug}`);
                if (response.data.success) {
                    setProject(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch project details", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectSlug]);

    if (isLoading) {
        return (
            <div className="portfolio-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="portfolio-container">
                <div className="container text-center py-5">
                    <h2>Project not found</h2>
                    <Link to="/packages" className="btn btn-primary mt-3">Back to Portfolio</Link>
                </div>
            </div>
        );
    }

    const videoMedia = project.media?.find(m => m.type === 'video');
    const embedMedia = project.media?.find(m => m.type === 'embed');
    const imageMedia = project.media?.find(m => m.type === 'image');

    const checkIsPortrait = (mediaUrl) => {
        if (mediaUrl && String(mediaUrl).includes('youtube.com/shorts/')) {
            return true;
        }
        return !!project?.isPortrait;
    };

    const isPortraitVideo = checkIsPortrait(videoMedia?.url || embedMedia?.url || project.externalLink);

    const renderMainMedia = () => {
        const mainImagePoster = imageMedia ? resolveUrl(imageMedia.url) : undefined;
        const coverPoster = project.coverImage ? resolveUrl(project.coverImage) : undefined;
        const fallbacks = [mainImagePoster, coverPoster].filter(Boolean);

        if (videoMedia) {
            const posterToUse = videoMedia.thumbnailUrl ? resolveUrl(videoMedia.thumbnailUrl) : (mainImagePoster || coverPoster);
            return (
                <div className={`pd-media-block ${isPortraitVideo ? 'pd-media-block-portrait' : ''}`}>
                    <span className="pd-media-badge">🎬 Video</span>
                    <CustomVideoPlayer
                        src={resolveUrl(videoMedia.url)}
                        poster={posterToUse}
                        fallbackPosters={fallbacks}
                        isPortrait={isPortraitVideo}
                    />
                </div>
            );
        }
        if (embedMedia) {
            const posterToUse = embedMedia.thumbnailUrl ? resolveUrl(embedMedia.thumbnailUrl) : (mainImagePoster || coverPoster);
            return (
                <div className={`pd-media-block ${isPortraitVideo ? 'pd-media-block-portrait' : ''}`}>
                    <span className="pd-media-badge">🎬 Video</span>
                    <CustomVideoPlayer
                        src={resolveUrl(embedMedia.url)}
                        poster={posterToUse}
                        fallbackPosters={fallbacks}
                        isPortrait={isPortraitVideo}
                    />
                </div>
            );
        }
        if (project.externalLink) {
            const resolved = resolveMedia(project.externalLink);
            const isEmbeddableVideo = resolved.isIframe || ['youtube', 'vimeo', 'bunny', 'cloudinary_video', 'local_video', 'external_video'].includes(resolved.type);

            if (isEmbeddableVideo) {
                return (
                    <div className={`pd-media-block ${isPortraitVideo ? 'pd-media-block-portrait' : ''}`}>
                        <span className="pd-media-badge">🎬 Video</span>
                        <CustomVideoPlayer
                            src={project.externalLink}
                            poster={mainImagePoster || coverPoster}
                            fallbackPosters={fallbacks}
                            isPortrait={isPortraitVideo}
                        />
                    </div>
                );
            }

            return (
                <div className="pd-media-block" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0a0a0a', borderRadius: '12px' }}>
                    <span className="pd-media-badge">🔗 External Link</span>
                    <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Watch on External Platform</h3>
                    <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="pd-external-link-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
                        <span className="pd-btn-text">Open Full Video</span>
                        <span className="pd-btn-arrow">
                            <svg className="pd-external-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </span>
                    </a>
                </div>
            );
        }
        if (imageMedia) {
            return (
                <div className="pd-media-block">
                    <span className="pd-media-badge">🖼️ Photo</span>
                    <ImageFallback
                        src={resolveUrl(imageMedia.url)}
                        alt={imageMedia.altText || project.title}
                        className="pd-image"
                    />
                </div>
            );
        }
        /* Fallback: show cover image if no media exists */
        if (project.coverImage) {
            return (
                <div className="pd-media-block">
                    <span className="pd-media-badge">🖼️ Cover</span>
                    <ImageFallback
                        src={resolveUrl(project.coverImage)}
                        alt={project.title}
                        className="pd-image"
                    />
                </div>
            );
        }
        return null;
    };

    const remainingMedia = project.media?.filter(m => m !== videoMedia && m !== embedMedia && m !== imageMedia) || [];

    /**
     * Resolve the external video URL for the "Watch the full video on YouTube" button.
     * Directs client directly to YouTube in a new tab.
     */
    const getExternalVideoUrl = () => {
        const raw = project.externalLink || project.youtubeUrl;
        if (raw) {
            const ytId = extractYoutubeVideoId(raw);
            if (ytId) return `https://www.youtube.com/watch?v=${ytId}`;
            return raw;
        }
        return null;
    };

    const externalVideoUrl = getExternalVideoUrl();

    return (
        <div className="project-details-container">
            <div className="pd-wrapper">

                {/* Back link */}
                <Link to={`/portfolio/${project.category?.slug || ''}`} className="pd-back">
                    <div className="pd-back-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                        </svg>
                    </div>
                    <p className="pd-back-text">Back to {project.category?.name || 'Portfolio'}</p>
                </Link>

                <div className="pd-grid-layout">
                    {/* Left Column: Text Information */}
                    <div className="pd-info-column">
                        {/* Hero Header (Title & Meta) */}
                        <div className="pd-header">
                            <h1 className="pd-title">{project.title}</h1>

                            {/* Meta pills (Client, Date, Category) */}
                            <div className="pd-meta">
                                {project.clientName && (
                                    <span className="pd-pill pd-client-pill">
                                        <span className="pd-pill-label">Client</span>
                                        <Link
                                            to={`/portfolio/client/${encodeURIComponent(project.clientName)}`}
                                            className="pd-pill-link pd-client-link"
                                            title={`View all projects for ${project.clientName}`}
                                        >
                                            {project.clientName}
                                            <svg className="pd-client-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </Link>
                                    </span>
                                )}
                                {project.date && (
                                    <span className="pd-pill">
                                        <span className="pd-pill-label">Date</span>
                                        {new Date(project.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                )}
                                {project.category?.name && (
                                    <span className="pd-pill">
                                        <span className="pd-pill-label">Category</span>
                                        {project.category.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Project Context (Description & Tags) */}
                        <div className="pd-context">
                            <p className="pd-description">{project.description}</p>

                            {/* Tags moved under description */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="pd-tags" style={{ marginTop: '2rem' }}>
                                    {project.tags.map(tag => (
                                        <span key={tag} className="pd-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Featured Media */}
                    <div className="pd-media-column">
                        {project.mediaType === 'gallery' ? (
                            /* ── Gallery mode: Animated OriginImageGallery ── */
                            (() => {
                                const galleryImages = (project.media || [])
                                    .filter(m => m.type === 'image')
                                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                    .map(m => resolveUrl(m.url));
                                return galleryImages.length > 0 ? (
                                    <OriginImageGallery images={galleryImages} title={project.title} />
                                ) : (
                                    <div className="pd-media-block" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0a0a0a', borderRadius: '12px' }}>
                                        <span style={{ color: '#64748b' }}>No gallery images yet.</span>
                                    </div>
                                );
                            })()
                        ) : (
                            /* ── Video/Trailer mode ── */
                            <>
                                {externalVideoUrl && (
                                    <div className="pd-yt-btn-wrapper">
                                        <a
                                            href={externalVideoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pd-yt-btn"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                            </svg>
                                            Watch the full video on YouTube
                                        </a>
                                    </div>
                                )}
                                {renderMainMedia()}
                            </>
                        )}
                    </div>
                </div>

                {/* Remaining Media Gallery */}
                {project.mediaType !== 'gallery' && remainingMedia.length > 0 && (
                    <>
                        <hr className="pd-divider" />
                        <div className="pd-gallery">
                            {remainingMedia.map((item, index) => (
                                <div key={index} className="pd-media-block">
                                    {item.type === 'video' ? (
                                        <>
                                            <span className="pd-media-badge">🎬 Video</span>
                                            <CustomVideoPlayer
                                                src={resolveUrl(item.url)}
                                                poster={item.thumbnailUrl ? resolveUrl(item.thumbnailUrl) : undefined}
                                                isPortrait={project.isPortrait}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="pd-media-badge">🖼️ Photo</span>
                                            <img
                                                src={resolveUrl(item.url)}
                                                alt={item.altText || project.title}
                                                className="pd-image"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default ProjectDetails;
