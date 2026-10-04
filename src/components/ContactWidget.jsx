import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEnvelope, FaInstagram } from 'react-icons/fa';
import { X } from 'lucide-react';
import contactInfo from '../config/contactInfo';
import cameraImg from '../assets/contact-camera.webp';
import './ContactWidget.css';

/**
 * Floating Contact Widget – Cinematic Camera Object
 * Inspired by professional Canon EOS R-series camera.
 * The camera itself acts as the floating trigger button.
 * Clicking opens a refined contact panel emerging directly from the lens.
 */
const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const widgetRef = useRef(null);
  const triggerRef = useRef(null);

  const toggle = useCallback(() => {
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 260);
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /* Close on Escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  /* Close on click or tap outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, close]);

  return (
    <div
      ref={widgetRef}
      className={`contact-widget${isOpen ? ' contact-widget--open' : ''}`}
      role="region"
      aria-label="Contact Us"
    >
      {/* Trigger button – Realistic Cinema Camera */}
      <button
        ref={triggerRef}
        className={`cw-trigger${isShutterActive ? ' cw-trigger--shutter' : ''}`}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="cw-panel"
        aria-label={isOpen ? 'Close contact panel' : 'Open contact panel'}
        type="button"
      >
        <div className="cw-camera-frame">
          <img
            src={cameraImg}
            alt="Ariadne Contact Camera"
            className="cw-camera-img"
            draggable={false}
            loading="eager"
            decoding="async"
          />

          {/* Optical multi-coated lens reflection highlight */}
          <div className="cw-lens-reflection" aria-hidden="true" />

          {/* Shutter pulse / optical aperture flare on click */}
          <div className="cw-lens-aperture-flash" aria-hidden="true" />

          {/* Subtle live tally indicator */}
          <div className="cw-tally-light" aria-hidden="true" />
        </div>
      </button>

      {/* Contact panel – Emerges from the camera lens */}
      <div
        id="cw-panel"
        className="cw-panel"
        role="dialog"
        aria-label="Contact Ariadne Productions"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="cw-header">
          <div className="cw-header-content">
            <span className="cw-header-badge">Ariadne Productions</span>
            <h3 className="cw-header-title">Get in Touch</h3>
          </div>
          <button
            className="cw-close-btn"
            onClick={close}
            aria-label="Close contact dialog"
            type="button"
            tabIndex={isOpen ? 0 : -1}
          >
            <X size={14} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        {/* Body – Contact links */}
        <div className="cw-body">
          {/* Email */}
          <a
            className="cw-link"
            href={`mailto:${contactInfo.email}`}
            aria-label={`Send email to ${contactInfo.email}`}
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="cw-link-icon cw-link-icon--email" aria-hidden="true">
              <FaEnvelope />
            </span>
            <span className="cw-link-info">
              <span className="cw-link-label">Email Us</span>
              <span className="cw-link-value">{contactInfo.email}</span>
            </span>
            <svg
              className="cw-link-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            className="cw-link"
            href={contactInfo.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit Instagram @${contactInfo.instagram.handle}`}
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="cw-link-icon cw-link-icon--instagram" aria-hidden="true">
              <FaInstagram />
            </span>
            <span className="cw-link-info">
              <span className="cw-link-label">Instagram</span>
              <span className="cw-link-value">@{contactInfo.instagram.handle}</span>
            </span>
            <svg
              className="cw-link-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>

        </div>

        {/* Footer info */}
        <div className="cw-footer">
          <p className="cw-footer-loc">📍 {contactInfo.location}</p>
          <p className="cw-footer-text">Cinematic Photography & Visual Arts</p>
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;
