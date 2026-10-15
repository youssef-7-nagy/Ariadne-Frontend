import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEnvelope, FaInstagram } from 'react-icons/fa';
import { X } from 'lucide-react';
import contactInfo from '../config/contactInfo';
import cameraImg from '../assets/canon-camera.png';
import './ContactWidget.css';

/**
 * Floating Contact Widget – Cinematic Camera Object
 * Inspired by professional Canon EOS R-series camera.
 * The camera itself acts as the floating trigger button.
 * Clicking opens a refined contact panel emerging directly from the lens.
 */
const DRAG_THRESHOLD = 5; // px of movement before a mouse press becomes a drag
const TOUCH_DRAG_THRESHOLD = 10; // px of movement before a finger press becomes a drag

const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [placement, setPlacement] = useState({ below: false, left: false, shiftX: 0 });
  const widgetRef = useRef(null);
  const triggerRef = useRef(null);
  const shutterTimerRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pointerStateRef = useRef({
    isDown: false,
    pointerId: null,
    pointerType: 'mouse',
    startX: 0,
    startY: 0,
    startOX: 0,
    startOY: 0,
    hasDragged: false,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });
  const didDragRef = useRef(false);

  const snapTimerRef = useRef(null);

  const applyOffset = useCallback((x, y) => {
    offsetRef.current = { x, y };
    if (widgetRef.current) {
      widgetRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  /* Decide which side the panel should open to, ensuring it never overflows the viewport */
  const computePlacement = useCallback(() => {
    const el = triggerRef.current;
    const widget = widgetRef.current;
    if (!el || !widget) return;
    const rect = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv ? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    const vh = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight);

    // Determine target panel width based on viewport size matching CSS system
    const targetW =
      vw <= 340 ? 236 :
      vw <= 375 ? 254 :
      vw <= 414 ? 268 :
      vw <= 600 ? 280 :
      vw <= 820 ? 295 :
      vw <= 1024 ? 310 : 320;
    const panelW = Math.min(targetW, vw - 20);

    // Check vertical space: open below if near top or if landscape has more room below
    const isShortLandscape = vh < 520;
    const spaceAbove = rect.top;
    const spaceBelow = vh - rect.bottom;
    const below = isShortLandscape ? spaceBelow > spaceAbove : spaceAbove < 310;

    // Check horizontal space
    const leftEdgeDefault = rect.right - panelW;
    const rightEdgeLeftAligned = rect.left + panelW;

    let left = false;
    let shiftX = 0;

    if (leftEdgeDefault < 10) {
      if (rightEdgeLeftAligned <= vw - 10) {
        left = true;
        if (rect.left < 10) {
          shiftX = 10 - rect.left;
        }
      } else {
        // Centered on a small screen: clamp panel within screen bounds
        left = false;
        shiftX = 10 - leftEdgeDefault;
      }
    } else if (rect.right > vw - 10) {
      shiftX = (vw - 10) - rect.right;
    }

    setPlacement({ below, left, shiftX });
  }, []);

  /* Apple-style edge snapping: snap horizontally to nearest edge, clamp vertically */
  const snapToEdge = useCallback((animated = true) => {
    const trigger = triggerRef.current;
    const widget = widgetRef.current;
    if (!trigger || !widget) return;

    const rect = trigger.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv ? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    const vh = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight);
    const isMobile = vw <= 768;
    const edgeMarginX = isMobile ? 12 : 18;
    const edgeMarginY = isMobile ? 16 : 20;

    // Base position without current transform offset
    const currentOX = offsetRef.current.x;
    const currentOY = offsetRef.current.y;
    const baseLeft = rect.left - currentOX;
    const baseTop = rect.top - currentOY;

    // Left and right target offsets relative to unshifted base
    const snapLeftOffset = edgeMarginX - baseLeft;
    const snapRightOffset = (vw - edgeMarginX - rect.width) - baseLeft;

    // Determine nearest horizontal edge using center of the camera
    const centerX = rect.left + rect.width / 2;
    const targetX = centerX < vw / 2 ? snapLeftOffset : snapRightOffset;

    // Vertically clamp within viewport bounds
    const minYOffset = edgeMarginY - baseTop;
    const maxYOffset = (vh - edgeMarginY - rect.height) - baseTop;
    const targetY = Math.min(maxYOffset, Math.max(minYOffset, currentOY));

    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
    }

    if (animated) {
      widget.classList.add('contact-widget--snapping');
      applyOffset(targetX, targetY);
      snapTimerRef.current = setTimeout(() => {
        widget.classList.remove('contact-widget--snapping');
        snapTimerRef.current = null;
      }, 480);
    } else {
      widget.classList.remove('contact-widget--snapping');
      applyOffset(targetX, targetY);
    }
  }, [applyOffset]);

  const close = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
  }, []);

  const toggle = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    if (didDragRef.current) return;
    if (shutterTimerRef.current) clearTimeout(shutterTimerRef.current);
    setIsShutterActive(true);
    shutterTimerRef.current = setTimeout(() => setIsShutterActive(false), 260);
    setIsOpen((prev) => {
      if (!prev) computePlacement();
      return !prev;
    });
  }, [computePlacement]);

  const handleClick = useCallback((e) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    toggle(e);
  }, [toggle]);

  /* ── Dragging (pointer events: mouse + touch + pen) ── */
  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const trigger = triggerRef.current;
    const widget = widgetRef.current;
    if (!trigger || !widget) return;

    // If an edge snap animation is currently playing, immediately cancel and pin position
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
    }
    widget.classList.remove('contact-widget--snapping');

    const rect = trigger.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv ? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    const vh = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight);
    const isMobile = vw <= 768;
    const edgeMarginX = isMobile ? 10 : 16;
    const edgeMarginY = isMobile ? 14 : 16;
    const baseLeft = rect.left - offsetRef.current.x;
    const baseTop = rect.top - offsetRef.current.y;

    pointerStateRef.current = {
      isDown: true,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      startOX: offsetRef.current.x,
      startOY: offsetRef.current.y,
      hasDragged: false,
      minX: edgeMarginX - baseLeft,
      maxX: vw - edgeMarginX - rect.width - baseLeft,
      minY: edgeMarginY - baseTop,
      maxY: vh - edgeMarginY - rect.height - baseTop,
    };
    didDragRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e) => {
    const s = pointerStateRef.current;
    if (!s.isDown || s.pointerId !== e.pointerId) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.hasDragged) {
      const threshold = s.pointerType === 'touch' ? TOUCH_DRAG_THRESHOLD : DRAG_THRESHOLD;
      if (Math.hypot(dx, dy) < threshold) return;
      s.hasDragged = true;
      didDragRef.current = true;
      widgetRef.current?.classList.add('contact-widget--dragging');
      widgetRef.current?.classList.remove('contact-widget--snapping');
      setIsOpen(false);
      try {
        triggerRef.current?.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    const nextX = Math.min(s.maxX, Math.max(s.minX, s.startOX + dx));
    const nextY = Math.min(s.maxY, Math.max(s.minY, s.startOY + dy));
    applyOffset(nextX, nextY);
  }, [applyOffset]);

  const endDrag = useCallback((e) => {
    const s = pointerStateRef.current;
    if (!s.isDown || (e && s.pointerId !== e.pointerId)) return;
    s.isDown = false;
    try {
      if (e) triggerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    widgetRef.current?.classList.remove('contact-widget--dragging');
    if (s.hasDragged) {
      didDragRef.current = true;
      // Apple-style: smoothly snap to the nearest horizontal edge
      snapToEdge(true);
      setTimeout(() => {
        didDragRef.current = false;
      }, 220);
    } else {
      didDragRef.current = false;
    }
  }, [snapToEdge]);

  /* Attach window pointer listeners while keeping events strictly matched to pointerId */
  useEffect(() => {
    const onMove = (e) => handlePointerMove(e);
    const onEnd = (e) => endDrag(e);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onEnd, { passive: true });
    window.addEventListener('pointercancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
    };
  }, [handlePointerMove, endDrag]);

  /* Keep the camera snapped and inside viewport on resize, screen rotation, or orientation change */
  useEffect(() => {
    const onResize = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      if (isOpen) {
        computePlacement();
      }
      // Re-snap to nearest edge without abrupt jumps when viewport changes
      snapToEdge(false);
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResize);
      }
    };
  }, [isOpen, computePlacement, snapToEdge]);

  useEffect(() => () => {
    if (shutterTimerRef.current) clearTimeout(shutterTimerRef.current);
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
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
      {/* Floating close control – visible and active only in the open state */}
      {isOpen && (
        <button
          className="cw-remove-btn"
          onClick={close}
          aria-label="Close contact panel"
          title="Close"
          type="button"
        >
          <X size={12} strokeWidth={2.6} aria-hidden="true" />
        </button>
      )}

      {/* Trigger button – Realistic Cinema Camera (draggable) */}
      <button
        ref={triggerRef}
        className={`cw-trigger${isShutterActive ? ' cw-trigger--shutter' : ''}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
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
        className={`cw-panel${placement.below ? ' cw-panel--below' : ''}${placement.left ? ' cw-panel--left' : ''}`}
        style={placement.shiftX ? { '--cw-shift-x': `${placement.shiftX}px` } : undefined}
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
