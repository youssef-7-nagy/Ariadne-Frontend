import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEnvelope, FaInstagram } from 'react-icons/fa';
import contactInfo from '../config/contactInfo';
import './ContactWidget.css';

/**
 * Floating Contact Widget – Cinema / Aperture-inspired
 * Renders a fixed bottom-right trigger that opens a compact contact panel.
 * Uses the shared contactInfo config to avoid data duplication.
 */
const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);
  const triggerRef = useRef(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

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

  /* Close on click outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  return (
    <div
      ref={widgetRef}
      className={`contact-widget${isOpen ? ' contact-widget--open' : ''}`}
      role="region"
      aria-label="Contact Us"
    >
      {/* Mobile backdrop */}
      <div className="cw-backdrop" onClick={close} aria-hidden="true" />

      {/* Trigger button – Cinematic Camera Object */}
      <button
        ref={triggerRef}
        className="cw-trigger"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="cw-panel"
        aria-label={isOpen ? 'Close contact panel' : 'Open contact panel'}
        type="button"
      >
        <div className="cw-camera-wrapper">
        <svg
          className="cw-camera-svg"
          viewBox="0 0 74 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Camera chassis gradients */}
            <linearGradient id="cw-body-grad" x1="0" y1="8" x2="0" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#132448" />
              <stop offset="28%" stopColor="#0d1933" />
              <stop offset="100%" stopColor="#040812" />
            </linearGradient>

            <linearGradient id="cw-topdeck-grad" x1="0" y1="8" x2="74" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#2b4fa8" />
              <stop offset="100%" stopColor="#172e6e" />
            </linearGradient>

            <linearGradient id="cw-shutter-grad" x1="0" y1="2" x2="0" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f3e5cf" />
              <stop offset="40%" stopColor="#d4b483" />
              <stop offset="100%" stopColor="#8d6e40" />
            </linearGradient>

            {/* Lens barrel & optical glass gradients */}
            <linearGradient id="cw-lens-rim" x1="18" y1="10" x2="56" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#243f7d" />
              <stop offset="50%" stopColor="#0a1426" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            <radialGradient id="cw-glass-grad" cx="37" cy="29" r="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#061226" />
              <stop offset="45%" stopColor="#040b17" />
              <stop offset="78%" stopColor="#0b1a38" />
              <stop offset="100%" stopColor="#020409" />
            </radialGradient>

            <linearGradient id="cw-glare-cyan" x1="27" y1="18" x2="43" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#a8b3a0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="cw-blade-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3168" />
              <stop offset="60%" stopColor="#0a1428" />
              <stop offset="100%" stopColor="#040812" />
            </linearGradient>

            {/* Subtle glow filter for tally / highlights */}
            <filter id="cw-tally-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── TOP DECK CONTROLS ── */}
          {/* Shutter button (tactile dial) */}
          <g className="cw-shutter-group">
            <rect x="15" y="4.5" width="12" height="3.5" rx="1.2" fill="#081020" stroke="rgba(212, 180, 131, 0.4)" strokeWidth="0.6" />
            <rect x="16.5" y="2" width="9" height="3.5" rx="1.5" fill="url(#cw-shutter-grad)" />
            {/* Shutter knurl groove */}
            <line x1="18.5" y1="3.2" x2="23.5" y2="3.2" stroke="#4a371c" strokeWidth="0.6" strokeLinecap="round" />
          </g>

          {/* Right mode dial */}
          <rect x="47" y="4.5" width="11" height="3.5" rx="1.2" fill="#081020" stroke="rgba(212, 180, 131, 0.3)" strokeWidth="0.6" />
          <line x1="50" y1="4.5" x2="50" y2="8" stroke="rgba(212, 180, 131, 0.5)" strokeWidth="0.6" />
          <line x1="55" y1="4.5" x2="55" y2="8" stroke="rgba(212, 180, 131, 0.5)" strokeWidth="0.6" />

          {/* ── CAMERA MAIN BODY ── */}
          <rect
            className="cw-body-chassis"
            x="4"
            y="7.5"
            width="66"
            height="42"
            rx="7"
            fill="url(#cw-body-grad)"
            stroke="rgba(212, 180, 131, 0.3)"
            strokeWidth="0.9"
          />

          {/* Top plate accent split */}
          <path
            d="M 4 17.5 L 70 17.5"
            stroke="rgba(212, 180, 131, 0.22)"
            strokeWidth="0.75"
          />

          {/* Top plate subtle highlight */}
          <path
            d="M 11 8.5 L 63 8.5"
            stroke="rgba(125, 211, 252, 0.25)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />

          {/* Viewfinder window (rangefinder optic) */}
          <g className="cw-viewfinder">
            <rect x="52.5" y="10.5" width="13" height="7.5" rx="1.8" fill="#040812" stroke="rgba(212, 180, 131, 0.45)" strokeWidth="0.6" />
            <rect x="54" y="11.7" width="10" height="5.1" rx="1" fill="#0a1b38" />
            {/* Viewfinder brightline frame */}
            <rect x="55.5" y="12.6" width="7" height="3.3" rx="0.5" fill="none" stroke="rgba(125, 211, 252, 0.7)" strokeWidth="0.5" />
            {/* Tiny glass glare */}
            <line x1="55" y1="12" x2="62" y2="12" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.5" strokeLinecap="round" />
          </g>

          {/* Tally / Recording indicator LED */}
          <g className="cw-tally-led">
            <circle cx="21" cy="13.5" r="2.8" fill="#050a14" stroke="rgba(212, 180, 131, 0.35)" strokeWidth="0.5" />
            <circle className="cw-tally-core" cx="21" cy="13.5" r="1.6" fill="#d4b483" filter="url(#cw-tally-glow)" />
          </g>

          {/* ── CINEMA LENS ASSEMBLY (CENTER: 37, 29) ── */}
          {/* Outer gear / knurled focus ring */}
          <circle
            className="cw-lens-outer-gear"
            cx="37"
            cy="29"
            r="19.5"
            fill="none"
            stroke="rgba(212, 180, 131, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="1.2 2"
          />

          {/* Lens barrel solid bezel */}
          <circle
            cx="37"
            cy="29"
            r="18"
            fill="url(#cw-lens-rim)"
            stroke="rgba(30, 58, 138, 0.8)"
            strokeWidth="0.8"
          />

          {/* Optical index ring */}
          <circle
            cx="37"
            cy="29"
            r="15.8"
            fill="#03060d"
            stroke="rgba(212, 180, 131, 0.4)"
            strokeWidth="0.6"
          />

          {/* Cinema lens engraved markings */}
          <text x="37" y="17.6" className="cw-lens-engraving" textAnchor="middle">ARIA</text>
          <text x="37" y="42.8" className="cw-lens-engraving-sub" textAnchor="middle">35mm</text>

          {/* Subtle index tick marks */}
          <line x1="21.5" y1="29" x2="23" y2="29" stroke="#d4b483" strokeWidth="0.75" />
          <line x1="51" y1="29" x2="52.5" y2="29" stroke="#d4b483" strokeWidth="0.75" />

          {/* Optical glass element */}
          <circle
            className="cw-lens-glass"
            cx="37"
            cy="29"
            r="12.5"
            fill="url(#cw-glass-grad)"
            stroke="rgba(125, 211, 252, 0.2)"
            strokeWidth="0.6"
          />

          {/* ── APERTURE MECHANISM (6 BLADES) ── */}
          <g className="cw-aperture-group">
            {/* Blade 1 (0°) */}
            <path
              d="M 47 24 C 45 22 41 24.5 39 25.5 L 36 21 C 41 20 45 21 47 24 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />
            {/* Blade 2 (60°) */}
            <path
              d="M 45 34 C 45 31.5 41.5 30 39.5 29.5 L 43 25 C 46 29 46 32 45 34 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />
            {/* Blade 3 (120°) */}
            <path
              d="M 37 39 C 35 38 34.5 34.5 34 32.5 L 39 31 C 39.5 36 38.5 38.5 37 39 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />
            {/* Blade 4 (180°) */}
            <path
              d="M 27 34 C 29 36 33 33.5 35 32.5 L 38 37 C 33 38 29 37 27 34 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />
            {/* Blade 5 (240°) */}
            <path
              d="M 29 24 C 29 26.5 32.5 28 34.5 28.5 L 31 33 C 28 29 28 26 29 24 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />
            {/* Blade 6 (300°) */}
            <path
              d="M 37 19 C 39 20 39.5 23.5 40 25.5 L 35 27 C 34.5 22 35.5 19.5 37 19 Z"
              fill="url(#cw-blade-grad)"
              stroke="rgba(212, 180, 131, 0.45)"
              strokeWidth="0.4"
            />

            {/* Central aperture pupil */}
            <circle
              className="cw-aperture-core"
              cx="37"
              cy="29"
              r="3.5"
              fill="#000000"
              stroke="rgba(212, 180, 131, 0.5)"
              strokeWidth="0.5"
            />
          </g>

          {/* Multi-coated optical glass glare / reflection arc */}
          <path
            className="cw-lens-glare"
            d="M 27 24 C 29 20 34 18 41 19 C 37 20 32 23 30 27 C 28 26.2 27.5 25 27 24 Z"
            fill="url(#cw-glare-cyan)"
          />

          {/* Secondary subtle lens reflection arc */}
          <ellipse
            cx="44"
            cy="36"
            rx="3"
            ry="1.5"
            transform="rotate(-30 44 36)"
            fill="rgba(168, 179, 160, 0.3)"
          />

          {/* ── CLOSE ICON / VIEWFINDER CROSSHAIR (SHOWN WHEN OPEN) ── */}
          <g className="cw-close-crosshair">
            <circle cx="37" cy="29" r="9" fill="rgba(6, 12, 26, 0.85)" stroke="#d4b483" strokeWidth="1" />
            <line x1="33" y1="25" x2="41" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="41" y1="25" x2="33" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
        </div>
      </button>

      {/* Contact panel */}
      <div
        id="cw-panel"
        className="cw-panel"
        role="dialog"
        aria-label="Contact options"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="cw-header">
          <h3 className="cw-header-title">Get in Touch</h3>
          <p className="cw-header-subtitle">Ariadne Productions</p>
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

        {/* Footer */}
        <div className="cw-footer">
          <p className="cw-footer-text">Visual Storytelling</p>
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;
