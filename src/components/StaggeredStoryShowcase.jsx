import React from 'react';
import './StaggeredStoryShowcase.css';

const StaggeredStoryShowcase = () => {
    return (
        <section className="staggered-showcase-section">
            <div className="staggered-section-header">
                <span className="staggered-eyebrow">EDITORIAL JOURNAL</span>
                <h2>Stories Behind <span>The Lens</span></h2>
                <p>A visual diary of quiet moments, raw landscapes, and cinematic storytelling from around the world.</p>
            </div>

            <div className="staggered-stage-wrapper">
                <div className="staggered-grid">

                    {/* Phone 1: Far Left - Orange Background Phone */}
                    <div className="mobile-phone-frame phone-1">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-orange">
                            <div className="phone-top-bg-img">
                                <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop" alt="Desert" />
                            </div>
                            <div className="phone-white-inset-card">
                                <div className="inset-img-pill">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" alt="Coastal Road" />
                                </div>
                                <span className="phone-meta-label">Featured story</span>
                                <h3>Wild Camping Along Tasmania's East Coast</h3>
                            </div>
                            <div className="phone-bottom-scroll">
                                <span>Scroll for more</span>
                                <span className="arrow-down">↓</span>
                            </div>
                        </div>
                    </div>

                    {/* Phone 2: Top Left - Dark Olive Phone */}
                    <div className="mobile-phone-frame phone-2">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-olive">
                            <div className="phone-curved-top-img">
                                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" alt="Landscape" />
                            </div>
                            <div className="phone-padded-content">
                                <div className="phone-dashed-divider"></div>
                                <h2>About</h2>
                                <p className="phone-bio-text">
                                    Hi, I'm Naiá — a slow traveler with a soft spot for train stations, street snacks, and places that don't make the guidebooks. The Roam Report is my way of remembering: the long walks, wrong turns, and all the quiet in-between moments that make a place feel real.
                                </p>
                                <p className="phone-footer-note">Currently roaming. Eventually home.</p>
                            </div>
                        </div>
                    </div>

                    {/* Phone 3: Center Main - Tall White Phone */}
                    <div className="mobile-phone-frame phone-3">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-white">
                            <div className="phone-main-header-img">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" alt="Tasmania Coast" />
                            </div>
                            <div className="phone-article-body">
                                <h2>Wild Camping Along Tasmania's East Coast</h2>
                                <div className="phone-article-meta">
                                    <span>📅 July 11, 2025</span>
                                    <span>📍 Australia</span>
                                </div>
                                <div className="phone-dashed-divider light"></div>
                                <p className="phone-article-text">
                                    The coast of Tasmania doesn't care where you came from. It just opens up—wild, wind-lashed, and utterly indifferent. I parked the camper by a cliff's edge one afternoon, unsure if I'd stay one night or three...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Phone 4: Bottom Center - Light Cream Phone */}
                    <div className="mobile-phone-frame phone-4">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-cream">
                            <div className="phone-padded-content">
                                <h3 className="phone-section-title">Latest travel stories</h3>
                                <div className="phone-oval-img">
                                    <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop" alt="Desert Drive" />
                                </div>
                                <span className="phone-date-tag">September 17, 2025</span>
                                <h4>Driving Across Monument Valley</h4>
                            </div>
                        </div>
                    </div>

                    {/* Phone 5: Top Right - Warm Beige Poster Phone */}
                    <div className="mobile-phone-frame phone-5">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-warm-beige">
                            <div className="phone-wavy-top-img">
                                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" alt="Trail" />
                            </div>
                            <div className="phone-poster-content">
                                <span className="phone-eyebrow-text">End of the trail</span>
                                <h1>Less rush.<br />More wonder.</h1>
                                <div className="phone-nav-row">
                                    <span>Home</span>
                                    <span>Articles</span>
                                    <span>About</span>
                                    <span>Contact</span>
                                </div>
                                <div className="phone-social-row">
                                    <span>📷</span>
                                    <span>📌</span>
                                    <span>▶</span>
                                    <span>𝕏</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone 6: Bottom Right - Light Blue Phone */}
                    <div className="mobile-phone-frame phone-6">
                        <div className="phone-camera-notch">
                            <span className="notch-lens"></span>
                            <span className="notch-speaker"></span>
                        </div>
                        <div className="glass-glare-shine"></div>
                        <div className="phone-screen phone-light-blue">
                            <div className="phone-top-pill-nav">
                                <span>Home</span>
                                <span>Articles</span>
                                <span className="active-nav">About</span>
                            </div>
                            <div className="phone-hero-title">
                                <h1>The Roam<br />Report</h1>
                            </div>
                            <div className="phone-illustration-art">
                                <div className="hand-drawn-icon">📷</div>
                                <div className="hand-drawn-sparkle">✨</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StaggeredStoryShowcase;
