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

const MAX_GLOW_BLUR = 20;
const DURATION = 320;
const LEAVE_DELAY = 180;

const NS = "framer-animate-grid";

const CSS = `
.${NS}-card {
  position: relative;
  transition: transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), 
              border-color ${DURATION}ms ease,
              background ${DURATION}ms ease;
  will-change: transform, box-shadow;
  animation: ${NS}-entrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes ${NS}-entrance {
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Gentle organic floating wave when idle */
.${NS}-float {
  animation: ${NS}-entrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) both,
             ${NS}-breathing 4.5s ease-in-out infinite alternate;
  animation-delay: var(--enter-delay, 0s), var(--float-delay, 0s);
}

@keyframes ${NS}-breathing {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-4px);
  }
}

.${NS}-shadow {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 
              0 1px 2px rgba(0, 0, 0, 0.03), 
              inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* Glassmorphism shimmer streak across card on hover */
.${NS}-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(124, 58, 237, 0.09),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.${NS}-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.75) 50%,
    transparent 60%,
    transparent 100%
  );
  opacity: 0;
  transform: translateX(-100%);
  pointer-events: none;
  z-index: 2;
}

.${NS}-card:hover::before {
  opacity: 1;
}

.${NS}-card:hover::after {
  opacity: 1;
  animation: ${NS}-shimmer 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes ${NS}-shimmer {
  0% {
    transform: translateX(-120%) skewX(-15deg);
  }
  100% {
    transform: translateX(220%) skewX(-15deg);
  }
}

.${NS}-card img {
  opacity: 0.88;
  transition: transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), 
              opacity ${DURATION}ms ease, 
              filter ${DURATION}ms ease;
  position: relative;
  z-index: 3;
}

.${NS}-card:hover img {
  opacity: 1;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08));
}

/* Neighboring card subtle wave reaction */
.${NS}-small {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03);
  border-color: rgba(124, 58, 237, 0.18) !important;
}

/* Hovered card 3D lift & luminous glow */
.${NS}-big {
  transform: translateY(-8px) scale(1.06) translateZ(30px) !important;
  box-shadow: 0 22px 45px -10px rgba(124, 58, 237, 0.2), 
              0 10px 20px -5px rgba(0, 0, 0, 0.05), 
              0 0 0 1.5px rgba(124, 58, 237, 0.35) !important;
  border-color: rgba(124, 58, 237, 0.4) !important;
}

.${NS}-glow-big {
  animation: ${NS}-glow 2s ease-in-out infinite alternate;
}

@keyframes ${NS}-glow {
  0% {
    box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.18), 0 0 0 1.5px rgba(124, 58, 237, 0.3);
  }
  100% {
    box-shadow: 0 24px 48px -6px rgba(124, 58, 237, 0.28), 0 0 20px rgba(124, 58, 237, 0.2), 0 0 0 1.5px rgba(124, 58, 237, 0.5);
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
  const [mousePos, setMousePos] = useState({});
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

  const onMouseMove = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [i]: { x: `${x}px`, y: `${y}px` } }));
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
          const isKamena = logoSrc && logoSrc.includes("Kamena");

          const colIdx = i % cols;
          const rowIdx = Math.floor(i / cols);
          const enterDelay = `${i * 0.045}s`;
          const floatDelay = `${(colIdx * 0.35 + rowIdx * 0.5) % 3}s`;

          const currentMouse = mousePos[i] || { x: "50%", y: "50%" };

          return (
            <div
              key={i}
              onPointerEnter={() => onEnter(i)}
              onMouseMove={(e) => onMouseMove(e, i)}
              className={[
                `${NS}-card`,
                hovered === null && `${NS}-float`,
                shadow && `${NS}-shadow`,
                isBig && `${NS}-big`,
                isSmall && `${NS}-small`,
                glow && isBig && `${NS}-glow-big`,
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
                overflow: "hidden",
                zIndex: isBig ? count + 10 : isSmall ? count + 2 : i + 1,
                cursor: "pointer",
                "--enter-delay": enterDelay,
                "--float-delay": floatDelay,
                "--mouse-x": currentMouse.x,
                "--mouse-y": currentMouse.y,
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
                    transform: isKamena
                      ? isBig
                        ? "scale(1.9)"
                        : "scale(1.75)"
                      : isBig
                      ? "scale(1.08)"
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
