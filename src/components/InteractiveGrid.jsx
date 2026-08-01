import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULTS = {
  padding: "20px 0",
  columns: 5,
  rows: 4,
  gap: 12,
  rounded: 12,
  logoScale: 3.5,
  cardFill: "#ffffff",
  cardBorder: "rgba(0, 0, 0, 0.08)",
  shadow: true,
  cardShadow: "rgba(0, 0, 0, 0.06)",
  glow: false,
  glowStart: "rgba(255, 78, 0, 0.3)",
  glowEnd: "#ff4e00",
  glowIntensity: 40,
  perspective: 1400,
  rotateX: 0,
  rotateY: 0,
};

const MAX_GLOW_BLUR = 16;
const DURATION = 220;
const LEAVE_DELAY = 200;

const NS = "framer-animate-grid";

const CSS = `
.${NS}-card {
  transition: transform ${DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow ${DURATION}ms ease, border-color ${DURATION}ms ease;
}
.${NS}-shadow {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.${NS}-card img {
  opacity: 1;
  transition: transform ${DURATION}ms ease;
}

.${NS}-small {
  transform: scale(1.04) translate(-4px, -4px) translateZ(8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}
.${NS}-big {
  transform: scale(1.15) translate(-14px, -14px) translateZ(35px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 78, 0, 0.2);
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
        onPointerLeave={onLeave}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
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
                padding: "24px 16px",
                background: cardFill,
                border: `1px solid ${cardBorder}`,
                borderRadius: `${rounded}px`,
                boxSizing: "border-box",
                minWidth: 0,
                minHeight: 90,
                overflow: "visible",
                zIndex: isBig ? count + 1 : i + 1,
                cursor: "pointer",
              }}
            >
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt=""
                  draggable={false}
                  style={{
                    maxHeight: "55px",
                    maxWidth: `${logoPct}%`,
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                    userSelect: "none",
                    pointerEvents: "none",
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
