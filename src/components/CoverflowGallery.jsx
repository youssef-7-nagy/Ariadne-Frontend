import { useState, useEffect, useCallback, useRef } from "react";

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

function cssTransition(t) {
    const dur = t && typeof t.duration === "number" ? t.duration : 0.6;
    let ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    const e = t?.ease;
    if (Array.isArray(e) && e.length === 4) {
        ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
    } else if (typeof e === "string") {
        const map = { linear: "linear", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out" };
        ease = map[e] || "ease";
    }
    return { dur, ease };
}

/**
 * CoverflowGallery — fully responsive 3D coverflow
 * Scales fluidly from 320px mobile to wide desktop.
 * Supports touch swipe on mobile.
 *
 * Props:
 *   slides        — array of { image: string, name: string, role: string }
 *   baseCardWidth — design-time card width (scales proportionally)
 *   baseCardHeight— design-time card height
 *   radius        — 0-20 roundness
 *   tilt          — Y-axis tilt of side cards (deg)
 *   sideTilt      — Z-axis tilt of side cards (deg)
 *   gap           — horizontal spacing multiplier
 *   opacity       — inactive card visibility 0-100
 *   autoplay      — boolean
 *   autoplayDirection — "leftToRight" | "rightToLeft"
 *   transition    — { duration, delay, ease }
 *   showTitle     — show name/role overlay
 */
export default function CoverflowGallery({
    slides,
    baseCardWidth = 400,
    baseCardHeight = 440,
    radius = 4,
    tilt = 12,
    sideTilt = 8,
    gap = 8,
    opacity = 55,
    autoplay = false,
    autoplayDirection = "rightToLeft",
    transition = { type: "tween", duration: 0.6, delay: 2.5, ease: [0.22, 1, 0.36, 1] },
    showTitle = true,
    theme = "dark",
}) {
    const list = slides && slides.length ? slides : [];
    const n = list.length;
    const [active, setActive] = useState(0);

    // ─── Container measurement for responsive scaling ──────────────────
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(800);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        ro.observe(el);
        setContainerWidth(el.offsetWidth);
        return () => ro.disconnect();
    }, []);

    // Compute fluid card dimensions based on container width
    const isMobile = containerWidth < 600;
    const isSmallMobile = containerWidth < 400;

    let cardWidth, cardHeight;
    if (isSmallMobile) {
        // Very small screens: almost full-width single card
        cardWidth = Math.round(containerWidth * 0.78);
        cardHeight = Math.round(cardWidth * (baseCardHeight / baseCardWidth));
    } else if (isMobile) {
        cardWidth = Math.round(containerWidth * 0.68);
        cardHeight = Math.round(cardWidth * (baseCardHeight / baseCardWidth));
    } else if (containerWidth < 900) {
        cardWidth = Math.round(containerWidth * 0.55);
        cardHeight = Math.round(cardWidth * (baseCardHeight / baseCardWidth));
    } else {
        cardWidth = baseCardWidth;
        cardHeight = baseCardHeight;
    }

    // On mobile: tighten gap, reduce depth effect
    const effectiveGap = isMobile ? Math.max(4, gap * 0.55) : gap;
    const effectiveTilt = isMobile ? Math.min(8, tilt * 0.65) : tilt;
    const effectiveSideTilt = isMobile ? Math.min(5, sideTilt * 0.65) : sideTilt;
    const effectiveDepth = isMobile ? DEPTH * 0.5 : DEPTH;
    // On mobile: only show 1 side card
    const maxVisible = isMobile ? 1 : MAX_VISIBLE;

    // ─── State ────────────────────────────────────────────────────────
    useEffect(() => {
        setActive((a) => Math.max(0, Math.min(n - 1, a)));
    }, [n]);

    const moveDur = transition?.duration ?? 0.6;
    const lockRef = useRef(false);

    const lock = useCallback(() => {
        lockRef.current = true;
        window.setTimeout(() => { lockRef.current = false; }, Math.max(50, moveDur * 1000));
    }, [moveDur]);

    const step = useCallback((dir) => {
        if (lockRef.current) return;
        lock();
        setActive((a) => (((a + dir) % n) + n) % n);
    }, [n, lock]);

    const handleCardClick = useCallback((i) => {
        if (autoplay || lockRef.current) return;
        lock();
        setActive((a) => (i === a ? (a + 1) % n : i));
    }, [autoplay, n, lock]);

    const delay = transition?.delay ?? 2.5;
    useEffect(() => {
        if (!autoplay || n < 2) return;
        const ms = Math.max(0.3, delay) * 1000;
        const dir = autoplayDirection === "leftToRight" ? -1 : 1;
        const id = window.setInterval(() => step(dir), ms);
        return () => window.clearInterval(id);
    }, [autoplay, autoplayDirection, delay, n, step]);

    // ─── Keyboard ─────────────────────────────────────────────────────
    const onKeyDown = useCallback((e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    }, [step]);

    // ─── Touch / Swipe ────────────────────────────────────────────────
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        // Only trigger if horizontal swipe is dominant and > 40px
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            step(dx < 0 ? 1 : -1);
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // ─── Derived styles ───────────────────────────────────────────────
    const { dur, ease } = cssTransition(transition);
    const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`;
    const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2);
    const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

    // Arrow size: smaller on mobile
    const arrowSize = isMobile ? 36 : 44;
    const arrowFontSize = isMobile ? 18 : 20;
    const arrowOffset = isMobile ? 8 : 24;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
            }}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* ─── 3D Stage ─── */}
            <div style={{
                position: "relative",
                width: "100%",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: `${PERSPECTIVE}px`,
                overflow: "hidden",
            }}>
                {/* Prev arrow */}
                <button
                    onClick={() => step(-1)}
                    aria-label="Previous"
                    style={{
                        position: "absolute",
                        left: arrowOffset,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                        border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255, 255, 255, 0.18)",
                        color: theme === "light" ? "#0f172a" : "#ffffff",
                        boxShadow: theme === "light" ? "0 4px 14px rgba(0, 0, 0, 0.08)" : "none",
                        width: arrowSize,
                        height: arrowSize,
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: arrowFontSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        transition: "all 0.25s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = theme === "light" ? "#ff4e00" : "rgba(255,255,255,0.22)";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.borderColor = "#ff4e00";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = theme === "light" ? "#0f172a" : "#ffffff";
                        e.currentTarget.style.borderColor = theme === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.18)";
                    }}
                >
                    ‹
                </button>

                {/* Cards wrapper */}
                <div style={{
                    position: "relative",
                    width: cardWidth,
                    height: cardHeight,
                    transformStyle: "preserve-3d",
                    flexShrink: 0,
                }}>
                    {list.map((slide, i) => {
                        let rel = i - active;
                        if (rel > n / 2) rel -= n;
                        if (rel < -n / 2) rel += n;
                        const ax = Math.abs(rel);
                        const visible = ax <= maxVisible;
                        const isActive = rel === 0;
                        const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
                        const tx = rel * (effectiveGap * 30);
                        const tz = -ax * effectiveDepth;
                        const ry = -rel * effectiveTilt;
                        const rz = rel * effectiveSideTilt;
                        const src = slide.image || "";

                        return (
                            <div
                                key={i}
                                onClick={() => handleCardClick(i)}
                                aria-label={slide.name}
                                aria-hidden={!visible}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: cardWidth,
                                    height: cardHeight,
                                    borderRadius: effectiveRadius,
                                    overflow: "hidden",
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "center center",
                                    transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                                    transition: transitionCss,
                                    opacity: visible ? 1 : 0,
                                    cursor: autoplay || isActive ? "default" : "pointer",
                                    pointerEvents: visible && !autoplay ? "auto" : "none",
                                    backgroundColor: theme === "light" ? "#ffffff" : "#1a1a1a",
                                    boxShadow: theme === "light"
                                        ? (isActive ? "0 28px 60px -15px rgba(0, 0, 0, 0.22), 0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "0 18px 40px -10px rgba(0, 0, 0, 0.14)")
                                        : "0 20px 50px rgba(0,0,0,0.5)",
                                    willChange: "transform, opacity",
                                }}
                            >
                                {src && (
                                    <img
                                        src={src}
                                        alt={slide.name || ""}
                                        draggable={false}
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            userSelect: "none",
                                            WebkitUserSelect: "none",
                                        }}
                                    />
                                )}

                                {showTitle && (
                                    <>
                                        {/* Bottom gradient for legibility */}
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.88) 100%)",
                                            pointerEvents: "none",
                                        }} />
                                        {/* Name + role */}
                                        <div style={{
                                            position: "absolute",
                                            bottom: isMobile ? 16 : 24,
                                            left: isMobile ? 14 : 22,
                                            right: isMobile ? 14 : 22,
                                            pointerEvents: "none",
                                        }}>
                                            <div style={{
                                                color: "#fff",
                                                fontSize: isMobile ? 16 : 22,
                                                fontWeight: 700,
                                                lineHeight: "1.15em",
                                                letterSpacing: "-0.02em",
                                                fontFamily: "'Montserrat', sans-serif",
                                                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                                            }}>
                                                {slide.name}
                                            </div>
                                            {slide.role && (
                                                <div style={{
                                                    color: "rgba(255,255,255,0.75)",
                                                    fontSize: isMobile ? 10 : 13,
                                                    fontWeight: 500,
                                                    marginTop: 3,
                                                    letterSpacing: "0.05em",
                                                    textTransform: "uppercase",
                                                    fontFamily: "'Inter', sans-serif",
                                                }}>
                                                    {slide.role}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Dim overlay */}
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "#000000",
                                    opacity: isActive ? 0 : dim,
                                    transition: `opacity ${dur}s ${ease}`,
                                    pointerEvents: "none",
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* Next arrow */}
                <button
                    onClick={() => step(1)}
                    aria-label="Next"
                    style={{
                        position: "absolute",
                        right: arrowOffset,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                        border: theme === "light" ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255, 255, 255, 0.18)",
                        color: theme === "light" ? "#0f172a" : "#ffffff",
                        boxShadow: theme === "light" ? "0 4px 14px rgba(0, 0, 0, 0.08)" : "none",
                        width: arrowSize,
                        height: arrowSize,
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: arrowFontSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        transition: "all 0.25s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = theme === "light" ? "#ff4e00" : "rgba(255,255,255,0.22)";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.borderColor = "#ff4e00";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = theme === "light" ? "#0f172a" : "#ffffff";
                        e.currentTarget.style.borderColor = theme === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.18)";
                    }}
                >
                    ›
                </button>
            </div>

            {/* ─── Dot indicators ─── */}
            <div style={{
                display: "flex",
                gap: 8,
                paddingTop: isMobile ? 16 : 20,
                paddingBottom: 4,
                justifyContent: "center",
                flexShrink: 0,
            }}>
                {list.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { lock(); setActive(i); }}
                        aria-label={`Go to slide ${i + 1}`}
                        style={{
                            width: i === active ? (isMobile ? 20 : 24) : (isMobile ? 6 : 8),
                            height: isMobile ? 6 : 8,
                            borderRadius: 4,
                            border: "none",
                            background: i === active ? "#ff4e00" : (theme === "light" ? "rgba(15, 23, 42, 0.2)" : "rgba(255,255,255,0.3)"),
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            padding: 0,
                            flexShrink: 0,
                            boxShadow: i === active ? "0 2px 8px rgba(255, 78, 0, 0.4)" : "none",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
