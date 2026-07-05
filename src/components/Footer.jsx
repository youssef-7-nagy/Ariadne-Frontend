import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaShareAlt,
    FaGithub
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
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
                                        <a href="https://facebook.com" className="facebook" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                                    </li>
                                    <li style={{ '--i': 2 }}>
                                        <a href="https://instagram.com" className="instagram" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                    </li>
                                    <li style={{ '--i': 3 }}>
                                        <a href="https://github.com" className="github" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
                                    </li>
                                    <li style={{ '--i': 4 }}>
                                        <a href="https://twitter.com" className="twitter" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
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
                                <li><Link to="/packages">Our Portfolio</Link></li>
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
                                    <span>123 Sparkle Drive, Auto City, NY 10001</span>
                                </li>
                                <li>
                                    <FaPhoneAlt className="contact-icon" />
                                    <span>(414) 857 - 0107</span>
                                </li>
                                <li>
                                    <FaEnvelope className="contact-icon" />
                                    <span>leonardor.hanna@gmail.com</span>
                                </li>
                            </ul>

                            <h3 className="footer-heading mt-20">Working Hours</h3>
                            <p className="footer-hours">Monday - Sunday<br />8:00 AM - 8:00 PM</p>
                        </div>

                        {/* --- Newsletter Column --- */}
                        <div className="footer-col newsletter-col">
                            <div className="subscribe">
                                <p>SUBSCRIBE</p>
                                <input placeholder="Your e-mail" className="subscribe-input" name="email" type="email" />
                                <br />
                                <div className="submit-btn">SUBMIT</div>
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