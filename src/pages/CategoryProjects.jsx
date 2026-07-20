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
                <div className="container text-center py-5">
                    <h2>Loading Projects...</h2>
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
                <p className="portfolio-subtitle">{category.description}</p>
                
                {projects.length === 0 ? (
                    <p className="text-center mt-5">No projects found in this category yet.</p>
                ) : (
                    <div className="expanding-gallery mt-4">
                        {projects.map(project => {
                            const coverMedia = project.media.find(m => m.isFeatured) || project.media[0];
                            const fallbackUrl = resolveUrl(coverMedia?.thumbnailUrl || coverMedia?.url);
                            const coverUrl = project.coverImage ? resolveUrl(project.coverImage) : fallbackUrl;
                            
                            return (
                                <Link to={`/portfolio/project/${project.slug}`} key={project._id} className="gallery-panel" style={{ backgroundImage: `url(${coverUrl})`, textDecoration: 'none' }}>
                                    <div className="panel-content">
                                        <h3>{project.title}</h3>
                                        {project.clientName && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '5px 0 0 0' }}>{project.clientName}</p>}
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
