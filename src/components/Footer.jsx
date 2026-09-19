import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaShareAlt,
    FaInstagram
} from 'react-icons/fa';
import './Footer.css';
import { notify } from '../utils/notify';

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleNewsletterSubmit = () => {
        const email = newsletterEmail.trim();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            notify.error('Please enter a valid email address.');
            return;
        }
        notify.success('Thank you for subscribing to Ariadne updates!');
        setNewsletterEmail('');
    };
    return (
        <footer id="footer" className="footer">
            <div className="footer-top">
                <div className="footer-container">
                    <div className="footer-grid">

                        {/* --- Brand Column --- */}
                        <div className="footer-col brand-col">
                            <div className="footer-logo">
                                <Link to="/" className="logo" style={{ textDecoration: 'none', justifyContent: 'flex-start' }}>
                                    <img
                                        src="/mylogo.png"
                                        alt="Ariadne Logo"
                                        className="logo-img"
                                    />
                                </Link>
                            </div>
                            <p className="footer-about-text">
                                Premium cinematography and visual storytelling agency. We capture your most precious moments and turn them into cinematic truths that leave a lasting impression.
                            </p>

                            {/* --- HOVER MAGIC SOCIAL MENU --- */}
                            <div className="magic-social-wrapper">
                                <ul className="magic-menu">
                                    <div className="magic-toggle">
                                        <FaShareAlt />
                                    </div>
                                    <li style={{ '--i': 1 }}>
                                        <a href="https://instagram.com/ariadneprd" className="instagram" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                    </li>
                                    <li style={{ '--i': 2 }}>
                                        <a href="mailto:Leonardo.hanna@ariadneg.com" className="gmail" target="_blank" rel="noreferrer" aria-label="Gmail"><FaEnvelope /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* --- Quick Links Column --- */}
                        <div className="footer-col links-col">
                            <h3 className="footer-heading">Quick Links</h3>
                            <ul className="footer-list">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/portfolio">Our Portfolio</Link></li>
                                <li><Link to="/profile">My Account</Link></li>
                                <li><Link to="/login">Join Us</Link></li>
                            </ul>
                        </div>

                        {/* --- Contact Column --- */}
                        <div className="footer-col contact-col">
                            <h3 className="footer-heading">Contact Us</h3>
                            <ul className="footer-contact-info">
                                <li>
                                    <FaMapMarkerAlt className="contact-icon" />
                                    <span>Zamalek, Cairo, Egypt</span>
                                </li>
                                <li>
                                    <FaPhoneAlt className="contact-icon" />
                                    <span>+20 109 609 6498</span>
                                </li>
                                <li>
                                    <FaEnvelope className="contact-icon" />
                                    <span>Leonardo.hanna@ariadneg.com</span>
                                </li>
                            </ul>

                            <h3 className="footer-heading mt-20">Working Hours</h3>
                            <p className="footer-hours">Monday - Sunday<br />8:00 AM - 8:00 PM</p>
                        </div>

                        {/* --- Newsletter Column --- */}
                        <div className="footer-col newsletter-col">
                            <div className="subscribe">
                                <p>SUBSCRIBE</p>
                                <input
                                    placeholder="Your e-mail"
                                    className="subscribe-input"
                                    name="email"
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleNewsletterSubmit(); }}
                                />
                                <br />
                                <div className="submit-btn" onClick={handleNewsletterSubmit}>SUBMIT</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- Footer Bottom --- */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="bottom-wrapper">
                        <p className="copyright-text">
                            &copy; {new Date().getFullYear()} Ariadne Visual Storytelling. All rights reserved.
                        </p>
                        <ul className="bottom-links">
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;