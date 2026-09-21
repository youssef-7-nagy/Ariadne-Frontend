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
  transition: all ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, box-shadow;
}

.${NS}-shadow {
  box-shadow:
    0 2px 6px var(--ag-shadow),
    0 4px 12px var(--ag-shadow),
    0 8px 24px var(--ag-shadow);
}

.${NS}-card img {
  opacity: 0.75;
  transition: all ${DURATION}ms ease;
  shape-rendering: geometricPrecision;
}

.${NS}-card:hover img {
  opacity: 1;
}

.${NS}-small {
  transform: scale(1.05) translate(-5px, -5px) translateZ(0);
  border-color: rgba(124, 58, 237, 0.25) !important;
}

.${NS}-big {
  transform: scale(1.15) translate(-15px, -15px) translateZ(15px);
  border-color: rgba(124, 58, 237, 0.45) !important;
  box-shadow: 0 16px 36px rgba(124, 58, 237, 0.16), 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.${NS}-glow-big {
  animation: ${NS}-glow 1.5s ease-in-out infinite alternate;
}

.${NS}-glow-small {
  animation: ${NS}-glow-small 1.5s ease-in-out infinite alternate;
}

@keyframes ${NS}-glow {
  0%  { filter: drop-shadow(0 0 2px var(--ag-glow-start)); }
  to  { filter: drop-shadow(0 1px var(--ag-glow-blur) var(--ag-glow-end)); }
}

@keyframes ${NS}-glow-small {
  0%  { filter: drop-shadow(0 0 2px var(--ag-glow-start)); }
  to  { filter: drop-shadow(0 1px var(--ag-glow-blur-small) var(--ag-glow-start)); }
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
  .${NS}-card {
    padding: 14px 8px !important;
    min-height: 55px !important;
  }
}

@media (max-width: 480px) {
  .${NS}-grid-container {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 5px !important;
  }
  .${NS}-card {
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
    style,
  } = props;

  const urls = useMemo(() => {
    const list = (images ?? []).map(srcOf).filter(Boolean);
    return list.length ? list : [];
  }, [images]);

  const cols = Math.max(1, Math.round(columns));
  const rowCount = Math.max(1, Math.round(rows));
  const count = cols * rowCount;

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
          const isKamena = logoSrc && logoSrc.includes("Kamena");
          const isCairo = logoSrc && (logoSrc.includes("cairo.") || logoSrc.includes("cairo.jpeg"));
          const isSlightlyBigger = logoSrc && (logoSrc.includes("communitas") || logoSrc.includes("client4") || logoSrc.includes("carlos"));

          return (
            <div
              key={i}
              onPointerEnter={() => onEnter(i)}
              className={[
                `${NS}-card`,
                shadow && `${NS}-shadow`,
                isBig && `${NS}-big`,
                isSmall && `${NS}-small`,
                glow && isBig && `${NS}-glow-big`,
                glow && isSmall && `${NS}-glow-small`,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 12px",
                background: cardFill,
                border: `1px solid ${cardBorder}`,
                borderRadius: `${rounded}px`,
                boxSizing: "border-box",
                minWidth: 0,
                minHeight: "72px",
                overflow: "visible",
                zIndex: isBig ? count + 10 : isSmall ? count + 2 : i + 1,
                cursor: "pointer",
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
                    transform: isKamena
                      ? "scale(1.7)"
                      : isSlightlyBigger
                      ? "scale(1.4)"
                      : "scale(1)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
