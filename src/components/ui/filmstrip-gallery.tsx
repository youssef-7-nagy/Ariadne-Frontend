"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import "./filmstrip-gallery.css"

export interface FilmstripImage {
  src: string
  /** Real alt text: what is in the picture. */
  alt?: string
  /** Shown under the strip for the frame in the gate, and under the print. */
  caption?: string
}

export type FilmstripImageInput = FilmstripImage | string

export interface FilmstripGalleryProps extends Omit<React.ComponentProps<"section">, "children"> {
  images: FilmstripImageInput[]
  /** Frame in the gate at first paint. */
  defaultIndex?: number
  /** Controlled frame in the gate. */
  index?: number
  /** Called once per settled change. */
  onIndexChange?: (index: number) => void
  /** Text printed along the edge of the strip. */
  film?: string
  /** Colour of the film base. */
  stripColor?: string
  /** Colour of the edge printing and gate light. */
  inkColor?: string
  /** Show the caption and counter under the strip. */
  showCaption?: boolean
  /** Previous / next buttons. */
  showControls?: boolean
  /** Open the print (a native dialog) when the frame in the gate is clicked. */
  lightbox?: boolean
  /** Title for fallback alts/captions */
  title?: string
}

function useReducedMotion() {
  const subscribe = React.useCallback((notify: () => void) => {
    if (typeof window === "undefined") return () => {}
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    mq.addEventListener("change", notify)
    return () => mq.removeEventListener("change", notify)
  }, [])
  return React.useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  )
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

const STYLE_ID = "filmstrip-gallery-keyframes"
const KEYFRAMES = `@keyframes fsg-develop{from{opacity:1}to{opacity:0}}`

function useKeyframes() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return
    const style = document.createElement("style")
    style.id = STYLE_ID
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
  }, [])
}

/** Sprocket holes: an SVG pattern of rounded rectangles showing the page through the film strip. */
function Perforation({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("fsg-perforation", className)}
      height="16"
      style={{ height: "16px", minHeight: "16px", maxHeight: "16px", display: "block", width: "100%" }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="22" height="16" patternUnits="userSpaceOnUse">
          <rect
            x="5"
            y="4"
            width="12"
            height="8"
            rx="2"
            fill="var(--fsg-sprocket, var(--color-background, var(--bg-primary, #04101d)))"
            stroke="var(--fsg-ink, #ebdcb0)"
            strokeOpacity="0.32"
          />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * Filmstrip Gallery — A focused cinematic 3D carousel with active center hero image,
 * partial previous/next peeking frames, original photo colors, uncropped responsive layout,
 * and 35mm filmstrip borders.
 */
export function FilmstripGallery({
  images: rawImages = [],
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  film = "35MM · ISO 400 · 36 EXP",
  stripColor = "#231f1c",
  inkColor = "#ebdcb0",
  develop = true,
  showCaption = true,
  showControls = true,
  lightbox = true,
  title = "Project",
  className,
  style,
  "aria-label": ariaLabel = "Filmstrip gallery",
  ...rest
}: FilmstripGalleryProps) {
  useKeyframes()
  const reduce = useReducedMotion()
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")

  // Normalize images: accept string[] or FilmstripImage[]
  const images: FilmstripImage[] = React.useMemo(() => {
    return (rawImages || []).map((img, i) => {
      if (typeof img === "string") {
        return {
          src: img,
          alt: `${title} photo ${i + 1}`,
          caption: `${title} — Frame ${String(i + 1).padStart(2, "0")}`,
        }
      }
      return {
        ...img,
        alt: img.alt || `${title} photo ${i + 1}`,
        caption: img.caption || `${title} — Frame ${String(i + 1).padStart(2, "0")}`,
      }
    })
  }, [rawImages, title])

  const count = images.length
  const last = Math.max(0, count - 1)
  const [internalIndex, setInternalIndex] = React.useState(clamp(defaultIndex, 0, last))
  const active = clamp(controlledIndex ?? internalIndex, 0, last)
  const activeRef = React.useRef(active)
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [printIndex, setPrintIndex] = React.useState(active)
  const [printSeq, setPrintSeq] = React.useState(0)
  const [imgFallbacks, setImgFallbacks] = React.useState<Record<number, string>>({})

  // Touch gesture tracking for main filmstrip
  const touchStartX = React.useRef<number | null>(null)
  const touchStartY = React.useRef<number | null>(null)
  const touchStartTime = React.useRef<number>(0)
  const swipedRecentlyRef = React.useRef<boolean>(false)
  const swipeCooldownRef = React.useRef<number>(0)

  // Lightbox touch gesture tracking
  const lbTouchStartX = React.useRef<number | null>(null)
  const lbTouchStartY = React.useRef<number | null>(null)
  const lbTouchStartTime = React.useRef<number>(0)

  const onIndexChangeRef = React.useRef(onIndexChange)
  React.useLayoutEffect(() => {
    onIndexChangeRef.current = onIndexChange
    activeRef.current = active
  })

  const goTo = React.useCallback(
    (next: number) => {
      const target = clamp(next, 0, last)
      if (controlledIndex === undefined) setInternalIndex(target)
      if (activeRef.current !== target) {
        activeRef.current = target
        onIndexChangeRef.current?.(target)
      }
    },
    [controlledIndex, last]
  )

  const step = React.useCallback(
    (delta: number) => {
      goTo(active + delta)
    },
    [active, goTo]
  )

  // Keyboard navigation
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      step(1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      step(-1)
    }
  }

  // Native touch / swipe handling for main filmstrip
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchStartX.current = null
      touchStartY.current = null
      return
    }
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = touchStartX.current - endX
    const deltaY = touchStartY.current - endY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    const elapsed = Date.now() - touchStartTime.current

    touchStartX.current = null
    touchStartY.current = null

    // Determine if gesture is an intentional horizontal swipe
    const isFlick = elapsed < 300 && absX > 25
    const isSwipe = absX >= 35 || isFlick

    // Horizontal movement must be dominant over vertical movement (allows smooth vertical page scrolling)
    if (isSwipe && absX > absY * 1.15) {
      const now = Date.now()
      if (now - swipeCooldownRef.current > 200) {
        swipeCooldownRef.current = now
        swipedRecentlyRef.current = true
        setTimeout(() => {
          swipedRecentlyRef.current = false
        }, 300)

        // finger moves RIGHT -> LEFT (deltaX > 0): advance to NEXT image
        // finger moves LEFT -> RIGHT (deltaX < 0): go to PREVIOUS image
        if (deltaX > 0) {
          step(1)
        } else {
          step(-1)
        }
      }
    }
  }

  const onTouchCancel = () => {
    touchStartX.current = null
    touchStartY.current = null
  }

  // Pointer events support (specifically for touch and pen pointers; mouse is ignored to keep desktop 100% unchanged)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    touchStartTime.current = Date.now()
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = touchStartX.current - e.clientX
    const deltaY = touchStartY.current - e.clientY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    const elapsed = Date.now() - touchStartTime.current

    touchStartX.current = null
    touchStartY.current = null

    const isFlick = elapsed < 300 && absX > 25
    const isSwipe = absX >= 35 || isFlick

    if (isSwipe && absX > absY * 1.15) {
      const now = Date.now()
      if (now - swipeCooldownRef.current > 200) {
        swipeCooldownRef.current = now
        swipedRecentlyRef.current = true
        setTimeout(() => {
          swipedRecentlyRef.current = false
        }, 300)

        if (deltaX > 0) {
          step(1)
        } else {
          step(-1)
        }
      }
    }
  }

  const onPointerCancel = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    touchStartX.current = null
    touchStartY.current = null
  }

  // Lightbox touch handlers
  const onLbTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      lbTouchStartX.current = null
      lbTouchStartY.current = null
      return
    }
    lbTouchStartX.current = e.touches[0].clientX
    lbTouchStartY.current = e.touches[0].clientY
    lbTouchStartTime.current = Date.now()
  }

  const onLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStartX.current === null || lbTouchStartY.current === null) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = lbTouchStartX.current - endX
    const deltaY = lbTouchStartY.current - endY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    const elapsed = Date.now() - lbTouchStartTime.current

    lbTouchStartX.current = null
    lbTouchStartY.current = null

    const isFlick = elapsed < 300 && absX > 25
    const isSwipe = absX >= 35 || isFlick

    if (isSwipe && absX > absY * 1.15) {
      if (deltaX > 0 && printIndex < last) {
        showPrint(printIndex + 1)
      } else if (deltaX < 0 && printIndex > 0) {
        showPrint(printIndex - 1)
      }
    }
  }

  const onLbTouchCancel = () => {
    lbTouchStartX.current = null
    lbTouchStartY.current = null
  }

  const onLbPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    lbTouchStartX.current = e.clientX
    lbTouchStartY.current = e.clientY
    lbTouchStartTime.current = Date.now()
  }

  const onLbPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    if (lbTouchStartX.current === null || lbTouchStartY.current === null) return
    const deltaX = lbTouchStartX.current - e.clientX
    const deltaY = lbTouchStartY.current - e.clientY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    const elapsed = Date.now() - lbTouchStartTime.current

    lbTouchStartX.current = null
    lbTouchStartY.current = null

    const isFlick = elapsed < 300 && absX > 25
    const isSwipe = absX >= 35 || isFlick

    if (isSwipe && absX > absY * 1.15) {
      if (deltaX > 0 && printIndex < last) {
        showPrint(printIndex + 1)
      } else if (deltaX < 0 && printIndex > 0) {
        showPrint(printIndex - 1)
      }
    }
  }

  const onLbPointerCancel = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    lbTouchStartX.current = null
    lbTouchStartY.current = null
  }

  // Lightbox Modal
  const showPrint = (i: number) => {
    setPrintIndex(clamp(i, 0, last))
    setPrintSeq((n) => n + 1)
  }

  const openPrint = (i: number) => {
    if (!lightbox) return
    showPrint(i)
    setOpen(true)
  }

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const onDialogKey = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight" && printIndex < last) showPrint(printIndex + 1)
    if (event.key === "ArrowLeft" && printIndex > 0) showPrint(printIndex - 1)
  }

  const closePrint = () => {
    setOpen(false)
    goTo(printIndex)
  }

  const current = images[active]
  const print = images[printIndex] ?? current

  if (!images || images.length === 0) {
    return (
      <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#64748b" }}>
        No photos to display in gallery.
      </div>
    )
  }

  return (
    <section
      data-slot="filmstrip-gallery"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn("filmstrip-gallery-root relative w-full outline-none", className)}
      style={{ "--fsg-strip": stripColor, "--fsg-ink": inkColor, ...style } as React.CSSProperties}
      {...rest}
    >
      {/* 35mm Strip Container */}
      <div
        className="fsg-strip-container"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* Top Sprocket Perforations */}
        <Perforation id={`${uid}-top`} className="fsg-perforation-top" />

        {/* 3D Film Stage */}
        <div className="fsg-stage">
          {images.map((image, i) => {
            const isCenter = i === active
            const isPrev = i === active - 1
            const isNext = i === active + 1
            const isHiddenLeft = i < active - 1
            const isHiddenRight = i > active + 1

            let positionClass = "fsg-hidden-right"
            if (isCenter) positionClass = "fsg-active"
            else if (isPrev) positionClass = "fsg-prev"
            else if (isNext) positionClass = "fsg-next"
            else if (isHiddenLeft) positionClass = "fsg-hidden-left"

            return (
              <div
                key={image.src + i}
                data-slot="frame"
                data-active={isCenter || undefined}
                className={cn("fsg-frame-box", positionClass)}
                onClick={(e) => {
                  if (swipedRecentlyRef.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }
                  if (isCenter) openPrint(i)
                  else goTo(i)
                }}
              >
                {/* 35mm Edge Printing */}
                <div aria-hidden="true" className="fsg-edge-text">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {film}
                  </span>
                  <span>{String(i + 1).padStart(2, "0")}A</span>
                </div>

                {/* Frame Content Container */}
                <button
                  type="button"
                  aria-label={isCenter ? `${image.alt}. Click to open full print` : `Show ${image.alt}`}
                  aria-current={isCenter ? "true" : undefined}
                  tabIndex={isCenter ? 0 : -1}
                  className="fsg-frame-btn"
                  style={{
                    boxShadow: isCenter ? "inset 0 0 0 2px var(--fsg-ink, #ebdcb0)" : "none",
                  }}
                  onClick={(e) => {
                    if (swipedRecentlyRef.current) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
                >
                  <img
                    src={imgFallbacks[i] || image.src}
                    alt={image.alt || ""}
                    loading={Math.abs(i - active) <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="fsg-frame-img"
                    onError={() => {
                      if (!imgFallbacks[i]) {
                        const raw = image.src
                        if (raw.includes("/uploads/opt_")) {
                          setImgFallbacks((prev) => ({
                            ...prev,
                            [i]: raw.replace("/opt_", "/").replace(".webp", ".jpg"),
                          }))
                        }
                      }
                    }}
                  />
                </button>

                <div aria-hidden="true" style={{ height: "10px" }} />
              </div>
            )
          })}

          {/* Gate Center Alignment Markers */}
          <span aria-hidden="true" className="fsg-gate-marker-top" />
          <span aria-hidden="true" className="fsg-gate-marker-bottom" />
        </div>

        {/* Bottom Sprocket Perforations */}
        <Perforation id={`${uid}-bottom`} className="fsg-perforation-bottom" />
      </div>

      {/* Caption & Navigation Controls Row */}
      {showCaption || showControls ? (
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {showCaption ? (
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.92rem", fontWeight: 500 }}>
                <span>{current?.caption ?? current?.alt}</span>
                <span
                  style={{
                    marginLeft: "10px",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    opacity: 0.65,
                    letterSpacing: "0.05em",
                  }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </p>
            </div>
          ) : (
            <span />
          )}

          {/* Navigation buttons */}
          {showControls && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <button
                type="button"
                data-slot="prev"
                aria-label="Previous frame"
                disabled={active === 0}
                onClick={() => step(-1)}
                className="fsg-control-btn"
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                data-slot="cta-primary"
                aria-label="Next frame"
                disabled={active === last}
                onClick={() => step(1)}
                className="fsg-control-btn"
              >
                <Arrow dir="right" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Lightbox Print Dialog */}
      {lightbox ? (
        <dialog
          ref={dialogRef}
          data-slot="print"
          aria-label={`${print?.caption ?? print?.alt ?? "Print"}, ${printIndex + 1} of ${count}`}
          onClose={closePrint}
          onKeyDown={onDialogKey}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
          className="fsg-dialog"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
              touchAction: "pan-y",
            }}
            onTouchStart={onLbTouchStart}
            onTouchEnd={onLbTouchEnd}
            onTouchCancel={onLbTouchCancel}
            onPointerDown={onLbPointerDown}
            onPointerUp={onLbPointerUp}
            onPointerCancel={onLbPointerCancel}
          >
            <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "80vh" }}>
              <img
                src={imgFallbacks[printIndex] || print?.src}
                alt={print?.alt ?? ""}
                style={{
                  maxHeight: "78dvh",
                  maxWidth: "100%",
                  borderRadius: "4px",
                  objectFit: "contain",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75)",
                  display: "block",
                }}
              />
              {/* Paper white development keyframe animation */}
              {develop && !reduce && (
                <span
                  key={printSeq}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.95)",
                    pointerEvents: "none",
                    animation: "fsg-develop 700ms cubic-bezier(.22,1,.36,1) both",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: "760px",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                color: "#f8fafc",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <span>{print?.caption ?? print?.alt}</span>
                <span
                  style={{
                    marginLeft: "10px",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    opacity: 0.65,
                  }}
                >
                  {String(printIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  aria-label="Previous print"
                  disabled={printIndex === 0}
                  onClick={() => showPrint(printIndex - 1)}
                  className="fsg-control-btn"
                >
                  <Arrow dir="left" />
                </button>
                <button
                  type="button"
                  aria-label="Next print"
                  disabled={printIndex === last}
                  onClick={() => showPrint(printIndex + 1)}
                  className="fsg-control-btn"
                >
                  <Arrow dir="right" />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="fsg-control-btn"
                  style={{ marginLeft: "8px" }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </section>
  )
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      style={{
        width: "16px",
        height: "16px",
        transform: dir === "left" ? "rotate(180deg)" : "none",
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default FilmstripGallery
