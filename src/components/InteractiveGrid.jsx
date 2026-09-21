import React, { useEffect, useMemo, useRef, useState } from "react";

const DEFAULTS = {
  padding: "20px 0",
  columns: 7,
  rows: 4,
  gap: 8,
  rounded: 10,
  logoScale: 4,
  cardFill: "#ffffff",
  cardBorder: "rgba(0, 0, 0, 0.08)",
  shadow: true,
  cardShadow: "rgba(0, 0, 0, 0.04)",
  glow: true,
  glowStart: "rgba(124, 58, 237, 0.25)",
  glowEnd: "#7c3aed",
  glowIntensity: 40,
  perspective: 1600,
  rotateX: 0,
  rotateY: 0,
};

const MAX_GLOW_BLUR = 16;
const DURATION = 200;
const LEAVE_DELAY = 200;

const NS = "framer-animate-grid";

const CSS = `
.${NS}-card {
  transition: transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, box-shadow;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
}

.${NS}-card::before {
  content: "";
  position: absolute;
  display: block;
  width: 140px;
  height: 350px;
  transform: rotate(0deg) translateY(50%);
  background: linear-gradient(90deg, #ff2288, transparent);
  animation: rotation_9018 3000ms infinite linear;
  animation-play-state: running;
  z-index: 0;
  pointer-events: none;
}

.${NS}-card::after {
  content: "";
  position: absolute;
  display: block;
  width: 140px;
  height: 350px;
  transform: rotate(0deg) translateY(-50%);
  background: linear-gradient(90deg, transparent, #2268ff);
  animation: rotation_9019 3000ms infinite linear;
  animation-play-state: running;
  z-index: 0;
  pointer-events: none;
}

@keyframes rotation_9018 {
  0% {
    transform: rotate(0deg) translateY(50%);
  }
  100% {
    transform: rotate(360deg) translateY(50%);
  }
}

@keyframes rotation_9019 {
  0% {
    transform: rotate(0deg) translateY(-50%);
  }
  100% {
    transform: rotate(360deg) translateY(-50%);
  }
}

.${NS}-card-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.${NS}-card img {
  opacity: 0.85;
  transition: all ${DURATION}ms ease;
  shape-rendering: geometricPrecision;
}

.${NS}-card:hover img {
  opacity: 1;
}

.${NS}-small {
  transform: scale(1.05) translate(-5px, -5px) translateZ(0);
}

.${NS}-big {
  transform: scale(1.15) translate(-15px, -15px) translateZ(15px);
  box-shadow: 0 16px 36px rgba(124, 58, 237, 0.16), 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

@media (max-width: 1024px) {
  .${NS}-grid-container {
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 768px) {
  .${NS}-grid-container {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 6px !important;
  }
  .${NS}-card-content {
    padding: 14px 8px !important;
    min-height: 55px !important;
  }
}

@media (max-width: 480px) {
  .${NS}-grid-container {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 5px !important;
  }
  .${NS}-card-content {
    padding: 10px 6px !important;
    min-height: 48px !important;
  }
}
`;

const srcOf = (image) => (typeof image === "string" ? image : image?.src ?? "");

export default function InteractiveGrid(props) {
  const {
    images = [],
    padding = DEFAULTS.padding,
    columns = DEFAULTS.columns,
    rows = DEFAULTS.rows,
    gap = DEFAULTS.gap,
    rounded = DEFAULTS.rounded,
    logoScale = DEFAULTS.logoScale,
    cardFill = DEFAULTS.cardFill,
    cardBorder = DEFAULTS.cardBorder,
    shadow = DEFAULTS.shadow,
    cardShadow = DEFAULTS.cardShadow,
    glow = DEFAULTS.glow,
    glowStart = DEFAULTS.glowStart,
    glowEnd = DEFAULTS.glowEnd,
    glowIntensity = DEFAULTS.glowIntensity,
    perspective = DEFAULTS.perspective,
    rotateX = DEFAULTS.rotateX,
    rotateY = DEFAULTS.rotateY,
    repeat = true,
    style,
  } = props;

  const urls = useMemo(() => {
    const list = (images ?? []).map(srcOf).filter(Boolean);
    return list.length ? list : [];
  }, [images]);

  const cols = Math.max(1, Math.round(columns));
  const rowCount = Math.max(1, Math.round(rows));
  const count = repeat ? cols * rowCount : urls.length;

  const [hovered, setHovered] = useState(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const neighbours = useMemo(() => {
    if (hovered === null) return [];
    const out = [];
    if (hovered % cols !== 0) out.push(hovered - 1);
    if (hovered % cols !== cols - 1) out.push(hovered + 1);
    out.push(hovered - cols);
    out.push(hovered + cols);
    return out.filter((n) => n >= 0 && n < count);
  }, [hovered, cols, count]);

  const onEnter = (i) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(i);
  };

  const onLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovered(null), LEAVE_DELAY);
  };

  const glowBlur =
    (Math.min(100, Math.max(0, glowIntensity)) / 100) * MAX_GLOW_BLUR;

  const logoPct = Math.min(10, Math.max(1, Math.round(logoScale))) * 20;

  if (!urls.length) return null;

  return (
    <div
      style={{
        ...style,
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding,
        boxSizing: "border-box",
        "--ag-shadow": cardShadow,
        "--ag-glow-start": glowStart,
        "--ag-glow-end": glowEnd,
        "--ag-glow-blur": `${glowBlur.toFixed(1)}px`,
        "--ag-glow-blur-small": `${(glowBlur / 2).toFixed(1)}px`,
      }}
    >
      <style>{CSS}</style>
      <div
        className={`${NS}-grid-container`}
        onPointerLeave={onLeave}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          width: "100%",
          transform: `perspective(${perspective}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const isBig = hovered === i;
          const isSmall = !isBig && neighbours.includes(i);
          const logoSrc = urls[i % urls.length];
          const isBigger = logoSrc && (logoSrc.includes("communitas") || logoSrc.includes("carlos") || logoSrc.includes("Insa") || logoSrc.includes("client4"));
          const isMedium = logoSrc && (logoSrc.includes("DLS") || logoSrc.includes("Kamena"));
          const isCairo = logoSrc && (logoSrc.includes("cairo.") || logoSrc.includes("cairo.jpeg"));

          return (
            <div
              key={i}
              className={[
                `${NS}-card`,
                shadow && `${NS}-shadow`,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                background: "rgba(0, 0, 0, 0.03)",
                borderRadius: `${rounded}px`,
                boxSizing: "border-box",
                minWidth: 0,
                minHeight: "76px",
                overflow: "hidden",
                zIndex: isBig ? count + 10 : isSmall ? count + 2 : i + 1,
                cursor: "pointer",
              }}
            >
              <div
                className={`${NS}-card-content`}
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 12px",
                  background: cardFill,
                  borderRadius: `${Math.max(0, rounded - 2)}px`,
                  boxSizing: "border-box",
                  minHeight: "72px",
                }}
              >
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt=""
                    draggable={false}
                    style={{
                      maxHeight: "46px",
                      maxWidth: "85%",
                      width: `${logoPct}%`,
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: isCairo ? "6px" : "0",
                      display: "block",
                      margin: "0 auto",
                      userSelect: "none",
                      pointerEvents: "none",
                      transform: isBigger
                        ? "scale(1.7)"
                        : (isMedium || isCairo)
                        ? "scale(1.3)"
                        : "scale(1)",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
