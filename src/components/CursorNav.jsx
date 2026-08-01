import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CursorNav.css";

const DEFAULTS = {
  durationMs: 600,
  ease: "easeInOut",
  imageFit: "cover",
};

const easings = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function animateTo(start, end, duration, easeName, onUpdate, onDone) {
  const easeFn = easings[easeName] || easings.easeInOut;
  const startTime = performance.now();
  let rafId;
  function step(now) {
    const elapsed = now - startTime;
    const rawT = Math.min(elapsed / duration, 1);
    const t = easeFn(rawT);
    onUpdate(lerp(start, end, t));
    if (rawT < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onDone && onDone();
    }
  }
  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

const CursorNav = ({
  images = [],
  durationMs = DEFAULTS.durationMs,
  ease = DEFAULTS.ease,
  imageFit = DEFAULTS.imageFit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [cursorSide, setCursorSide] = useState("right");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [offset, setOffset] = useState(0); // -100 to 100 (percentage)
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const cancelAnim = useRef(null);

  const goTo = useCallback(
    (nextIndex) => {
      if (isAnimating || nextIndex === currentIndex) return;
      if (nextIndex < 0 || nextIndex >= images.length) return;

      if (cancelAnim.current) cancelAnim.current();

      setPrevIndex(currentIndex);
      setCurrentIndex(nextIndex);
      setIsAnimating(true);

      const direction = nextIndex > currentIndex ? 1 : -1;
      // Start from off-screen
      setOffset(direction * 100);

      // Small tick to allow state to propagate
      requestAnimationFrame(() => {
        cancelAnim.current = animateTo(
          direction * 100,
          0,
          durationMs,
          ease,
          (val) => setOffset(val),
          () => {
            setIsAnimating(false);
            setPrevIndex(null);
            setOffset(0);
          }
        );
      });
    },
    [isAnimating, currentIndex, images.length, durationMs, ease]
  );

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x: e.clientX, y: e.clientY });
    setCursorSide(x < rect.width / 2 ? "left" : "right");
  }, []);

  const handleClick = useCallback(() => {
    if (cursorSide === "right") {
      goTo(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    } else {
      goTo(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    }
  }, [cursorSide, currentIndex, images.length, goTo]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") goTo(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      if (e.key === "ArrowLeft") goTo(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    },
    [currentIndex, images.length, goTo]
  );

  useEffect(() => {
    return () => {
      if (cancelAnim.current) cancelAnim.current();
    };
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="cursor-nav-root"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image gallery"
      style={{ cursor: "none" }}
    >
      {/* Image layers */}
      <div className="cursor-nav-stage">
        {/* Previous image (fades out behind) */}
        {prevIndex !== null && (
          <div
            className="cursor-nav-slide cursor-nav-slide-prev"
            style={{ zIndex: 1 }}
          >
            <img
              src={images[prevIndex]}
              alt={`Gallery image ${prevIndex + 1}`}
              style={{ objectFit: imageFit }}
              draggable={false}
            />
          </div>
        )}

        {/* Current image (slides in) */}
        <div
          className="cursor-nav-slide cursor-nav-slide-current"
          style={{
            transform: `translateX(${offset}%)`,
            zIndex: 2,
            transition: isAnimating ? "none" : undefined,
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            style={{ objectFit: imageFit }}
            draggable={false}
          />
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="cursor-nav-dots" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`cursor-nav-dot${i === currentIndex ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="cursor-nav-counter">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Custom cursor */}
      {isHovering && (
        <div
          className="cursor-nav-cursor"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        >
          {cursorSide === "left" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default CursorNav;
