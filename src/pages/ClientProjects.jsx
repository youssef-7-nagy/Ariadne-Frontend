import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Portfolio.css';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};

/* ─── Cinematic Project Card Component ─── */
const ProjectCard = ({ project, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const coverMedia = project.media?.find(m => m.isFeatured) || project.media?.[0];
    const fallbackUrl = resolveUrl(coverMedia?.thumbnailUrl || coverMedia?.url);
    const coverUrl = project.coverImage ? resolveUrl(project.coverImage) : fallbackUrl;

    useEffect(() => {
        if (!coverUrl) return;
        const img = new Image();
        img.src = coverUrl;
        img.onload = () => setImgLoaded(true);
    }, [coverUrl]);

    return (
        <Link
            to={`/portfolio/project/${project.slug}`}
            className="pf-card-link"
            style={{ animationDelay: `${index * 0.07}s` }}
            aria-label={`View ${project.title}`}
        >
            <article className="pf-card" role="article">
                {/* Background Image with lazy loading transition */}
                <div
                    className={`pf-card-bg ${imgLoaded ? 'loaded' : ''}`}
                    style={{ backgroundImage: coverUrl ? `url(${coverUrl})` : 'none' }}
                />

                {/* Cinematic gradient overlay */}
                <div className="pf-card-gradient" />

                {/* Hover glow effect */}
                <div className="pf-card-glow" />

                {/* Noise texture for cinematic grain */}
                <div className="pf-card-noise" />

                {/* Content */}
                <div className="pf-card-content">
                    <div className="pf-card-category-line" />
                    {project.category?.name && (
                        <span style={{ color: '#bd9f67', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.45rem' }}>
                            {project.category.name}
                        </span>
                    )}
                    <h3 className="pf-card-name">{project.title}</h3>
                    {project.date && (
                        <p className="pf-card-desc" style={{ opacity: 0.85, fontSize: '0.8rem' }}>
                            {new Date(project.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>

                {/* Corner play icon */}
                <div className="pf-card-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
            </article>
        </Link>
    );
};

const ClientProjects = () => {
    const { clientName } = useParams();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const decodedName = decodeURIComponent(clientName);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/portfolio/client/${encodeURIComponent(decodedName)}`
                );
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch client projects', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [decodedName]);

    if (isLoading) {
        return (
            <div className="portfolio-container">
                <div className="pf-ambient pf-ambient-1" />
                <div className="pf-ambient pf-ambient-2" />
                <div className="pf-inner text-center" style={{ padding: '8rem 0' }}>
                    <h2 style={{ color: '#bd9f67', fontWeight: 500, letterSpacing: '0.05em' }}>Loading projects...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="portfolio-container">
            {/* Ambient background effects */}
            <div className="pf-ambient pf-ambient-1" />
            <div className="pf-ambient pf-ambient-2" />
            <div className="pf-ambient pf-ambient-3" />

            <div className="pf-inner">
                {/* Back Link with green Uiverse-style slider */}
                <Link to="/packages" className="pd-back">
                    <div className="pd-back-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                        </svg>
                    </div>
                    <p className="pd-back-text">Back to Portfolio</p>
                </Link>

                {/* Client header */}
                <header className="pf-header" style={{ textAlign: 'left', marginBottom: '3rem', animation: 'pfReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                    <p style={{ color: '#bd9f67', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Client Portfolio
                    </p>
                    <h1 className="portfolio-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                        {decodedName}
                    </h1>
                    <p className="portfolio-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                        {projects.length} project{projects.length !== 1 ? 's' : ''} completed
                    </p>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #bd9f67, transparent)', marginTop: '1.2rem' }} />
                </header>

                {projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                        <p style={{ fontSize: '1.2rem', color: '#a0aec0', marginBottom: '2.5rem' }}>
                            No published projects found for this client.
                        </p>
                        <Link to="/packages" className="pd-back" style={{ margin: '0 auto', paddingLeft: '4.5rem' }}>
                            <div className="pd-back-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                                    <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                                    <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                                </svg>
                            </div>
                            <p className="pd-back-text">Browse Portfolio</p>
                        </Link>
                    </div>
                ) : (
                    <div className="client-projects-grid">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProjects;

