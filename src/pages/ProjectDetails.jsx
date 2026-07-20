import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveMedia } from '../utils/mediaResolver';
import { ImageFallback } from '../components/media/ImageFallback';
import { VideoFallback } from '../components/media/VideoFallback';
import './Portfolio.css';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');


const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};

const CustomVideoPlayer = ({ src, poster }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    
    // Use the smart media resolver
    const resolvedMedia = resolveMedia(src);
    const finalSrc = resolvedMedia.src;
    const isIframe = resolvedMedia.isIframe;

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    return (
        <div className="pd-video-wrapper">
            {!isPlaying ? (
                <div onClick={handlePlayClick} style={{ cursor: "pointer", position: "relative", width: "100%", height: "100%" }}>
                    {poster ? (
                        <ImageFallback 
                            src={poster} 
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                            alt="Video thumbnail"
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", backgroundColor: "#111", minHeight: "300px" }}></div>
                    )}
                    <button className="pd-play-overlay-btn" aria-label="Play video">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            ) : isIframe ? (
                <iframe
                    src={finalSrc}
                    style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "450px",
                        border: "none",
                        display: "block"
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <VideoFallback
                    src={finalSrc}
                    poster={poster}
                    controls={isPlaying}
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
            <div className="portfolio-container">
                <div className="container text-center py-5">
                    <h2>Loading Project...</h2>
                </div>
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

    const renderMainMedia = () => {
        if (videoMedia) {
            return (
                <div className="pd-media-block">
                    <span className="pd-media-badge">🎬 Video</span>
                    <CustomVideoPlayer
                        src={resolveUrl(videoMedia.url)}
                        poster={videoMedia.thumbnailUrl ? resolveUrl(videoMedia.thumbnailUrl) : undefined}
                    />
                </div>
            );
        }
        if (embedMedia) {
            return (
                <div className="pd-media-block">
                    <span className="pd-media-badge">🎬 Video</span>
                    <CustomVideoPlayer
                        src={resolveUrl(embedMedia.url)}
                        poster={embedMedia.thumbnailUrl ? resolveUrl(embedMedia.thumbnailUrl) : undefined}
                    />
                </div>
            );
        }
        if (project.externalLink) {
            return (
                <div className="pd-media-block" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0a0a0a', borderRadius: '12px' }}>
                    <span className="pd-media-badge">🔗 External Video</span>
                    <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Watch on External Platform</h3>
                    <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="pd-external-link-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
                        <span className="pd-btn-text">Open Full Video</span>
                        <span className="pd-btn-arrow">
                            <svg className="pd-external-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
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
        return null;
    };

    const remainingMedia = project.media?.filter(m => m !== videoMedia && m !== embedMedia && m !== imageMedia) || [];

    const getYoutubeLink = () => {
        if (project.externalLink && (project.externalLink.includes('youtube') || project.externalLink.includes('youtu.be'))) {
            return project.externalLink;
        }
        if (embedMedia?.url && (embedMedia.url.includes('youtube') || embedMedia.url.includes('youtu.be'))) {
            // Convert embed URLs back to normal watch URLs for the button
            if (embedMedia.url.includes('/embed/')) {
                const videoId = embedMedia.url.split('/embed/')[1].split('?')[0];
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
            return embedMedia.url;
        }
        return null;
    };

    const youtubeLink = getYoutubeLink();

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
                    {/* The dynamic padding is handled by CSS to only apply on desktop (see .pd-info-column-desktop-padding) */}
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
                        {youtubeLink && (
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                                <a 
                                    href={youtubeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #d21313 0%, #a00d0d 100%)',
                                        color: '#fff',
                                        padding: '12px 24px',
                                        borderRadius: '30px',
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 15px rgba(210, 19, 19, 0.4)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        fontFamily: 'sans-serif'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(210, 19, 19, 0.6)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(210, 19, 19, 0.4)';
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                    Watch on YouTube
                                </a>
                            </div>
                        )}
                        {renderMainMedia()}
                    </div>
                </div>

                {/* Remaining Media Gallery */}
                {remainingMedia.length > 0 && (
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
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="pd-media-badge">🖼️ Photo</span>
                                            <img
                                                src={resolveUrl(item.url)}
                                                alt={item.altText || project.title}
                                                className="pd-image"
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

