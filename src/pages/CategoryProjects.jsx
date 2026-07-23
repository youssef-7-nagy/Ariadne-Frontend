import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Portfolio.css';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_URL}${src}`;
};

/* ─── Camera icon for placeholder ─── */
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

/* ─── Project Card Image with graceful fallback ─── */
const ProjectCardImage = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const handleLoad = useCallback(() => setLoaded(true), []);
    const handleError = useCallback(() => setErrored(true), []);

    if (!src || errored) {
        return (
            <div className="project-card-placeholder">
                <CameraIcon />
                <span>Preview</span>
            </div>
        );
    }

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={`project-card-img${loaded ? ' loaded' : ''}`}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                decoding="async"
            />
            <div className="project-card-img-overlay" />
        </>
    );
};

/* ─── Skeleton Card ─── */
const SkeletonCard = ({ delay = 0 }) => (
    <div className="project-card-skeleton" style={{ animationDelay: `${delay}s`, position: 'relative' }}>
        <div className="skel-img" />
        <div className="skel-body">
            <div className="skel-line short" />
            <div className="skel-line medium" />
            <div className="skel-line long" />
        </div>
        <div className="skel-shimmer" />
    </div>
);

const CategoryProjects = () => {
    const { categorySlug } = useParams();
    const [projects, setProjects] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/portfolio/projects/${categorySlug}`);
                if (response.data.success) {
                    setProjects(response.data.data);
                    setCategory(response.data.category);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [categorySlug]);

    if (isLoading) {
        return (
            <div className="portfolio-container">
                <div className="container">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="skel-line medium" style={{ height: 28, background: 'rgba(0,0,0,0.06)', borderRadius: 6, marginBottom: 12 }} />
                        <div className="skel-line long" style={{ height: 14, background: 'rgba(0,0,0,0.04)', borderRadius: 4 }} />
                    </div>
                    <div className="project-card-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="portfolio-container">
                <div className="container text-center py-5">
                    <h2>Category not found</h2>
                    <Link to="/packages" className="btn btn-primary mt-3">Back to Portfolio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="portfolio-container">
            <div className="container">
                <Link to="/packages" className="back-link">← Back to Portfolio</Link>
                <h1 className="portfolio-title">{category.name}</h1>
                {category.description && (
                    <p className="portfolio-subtitle">{category.description}</p>
                )}
                
                {projects.length === 0 ? (
                    <div className="pf-empty">
                        <CameraIcon />
                        <h3 className="pf-empty-title">No Projects Yet</h3>
                        <p className="pf-empty-desc">Projects in this category will appear here.</p>
                    </div>
                ) : (
                    <div className="project-card-grid">
                        {projects.map((project, index) => {
                            const coverUrl = project.coverImage
                                ? resolveUrl(project.coverImage)
                                : null;

                            return (
                                <Link
                                    to={`/portfolio/project/${project.slug}`}
                                    key={project._id}
                                    className="project-card"
                                    style={{ animationDelay: `${index * 0.06}s`, animation: 'pfCardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                                >
                                    {/* Image */}
                                    <div className="project-card-img-wrapper">
                                        <ProjectCardImage src={coverUrl} alt={project.title} />
                                    </div>

                                    {/* Body */}
                                    <div className="project-card-body">
                                        {/* Category Badge */}
                                        {category?.name && (
                                            <span className="project-card-badge">{category.name}</span>
                                        )}

                                        {/* Title */}
                                        <h3 className="project-card-title">{project.title}</h3>

                                        {/* Client Name */}
                                        {project.clientName && (
                                            <p className="project-card-client">by {project.clientName}</p>
                                        )}

                                        {/* Description */}
                                        {project.description && (
                                            <p className="project-card-desc">{project.description}</p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProjects;
