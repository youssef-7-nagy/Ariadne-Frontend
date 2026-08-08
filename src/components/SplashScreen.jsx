import React, { useEffect, useRef, useState } from 'react';
import './SplashScreen.css';

/* ─── Text Scramble Hook ─── */
function useScramble(finalText, trigger, duration = 900) {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    useEffect(() => {
        if (!trigger) return;
        let frame = 0;
        const totalFrames = Math.floor(duration / 16);
        const raf = { id: null };
        const tick = () => {
            frame++;
            const progress = frame / totalFrames;
            const resolved = Math.floor(progress * finalText.length);
            let text = '';
            for (let i = 0; i < finalText.length; i++) {
                if (i < resolved) text += finalText[i];
                else text += chars[Math.floor(Math.random() * chars.length)];
            }
            setDisplay(text);
            if (frame < totalFrames) raf.id = requestAnimationFrame(tick);
            else setDisplay(finalText);
        };
        raf.id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.id);
    }, [trigger]);
    return display;
}

/* ─── Canvas Particle System ─── */
function ParticleCanvas({ phase }) {
    const canvasRef = useRef(null);
    const stateRef = useRef({ particles: [], animId: null, phase: 'scatter' });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const W = () => canvas.width;
        const H = () => canvas.height;
        const cx = () => W() / 2;
        const cy = () => H() / 2;

        // Create particles
        const count = 200;
        stateRef.current.particles = Array.from({ length: count }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = 60 + Math.random() * 320;
            return {
                x: Math.random() * W(),
                y: Math.random() * H(),
                tx: cx() + Math.cos(angle) * radius,   // target: orbit ring
                ty: cy() + Math.sin(angle) * radius,
                size: 0.5 + Math.random() * 2,
                alpha: 0,
                speed: 0.012 + Math.random() * 0.018,
                color: `hsl(${38 + Math.random() * 15}, ${60 + Math.random() * 30}%, ${55 + Math.random() * 30}%)`,
                twinkle: Math.random() * Math.PI * 2,
                orbitAngle: angle,
                orbitR: radius,
                orbitSpeed: (Math.random() - 0.5) * 0.004,
            };
        });

        let globalProgress = 0;

        const draw = () => {
            ctx.clearRect(0, 0, W(), H());

            // Background vignette
            const vg = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), Math.max(W(), H()) * 0.7);
            vg.addColorStop(0, 'rgba(12,10,8,0)');
            vg.addColorStop(1, 'rgba(0,0,0,0.85)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W(), H());

            globalProgress = Math.min(globalProgress + 0.004, 1);

            stateRef.current.particles.forEach(p => {
                // Lerp toward orbit target
                p.x += (p.tx - p.x) * p.speed;
                p.y += (p.ty - p.y) * p.speed;
                p.alpha = Math.min(p.alpha + 0.018, 0.9);
                p.twinkle += 0.06;

                // Once converged, orbit continuously
                if (globalProgress > 0.5) {
                    p.orbitAngle += p.orbitSpeed;
                    p.tx = cx() + Math.cos(p.orbitAngle) * p.orbitR;
                    p.ty = cy() + Math.sin(p.orbitAngle) * p.orbitR;
                }

                const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(')', `, ${twinkleAlpha})`).replace('hsl', 'hsla');
                ctx.fill();

                // Star glow
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                g.addColorStop(0, p.color.replace(')', `, ${twinkleAlpha * 0.4})`).replace('hsl', 'hsla'));
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Central radial glow rings
            if (globalProgress > 0.3) {
                const rings = [90, 140, 200];
                rings.forEach((r, i) => {
                    const ringAlpha = (globalProgress - 0.3) * 0.5 * (1 - i * 0.25);
                    ctx.beginPath();
                    ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(197,168,128,${ringAlpha * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            }

            stateRef.current.animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(stateRef.current.animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="spl-canvas" />;
}

/* ─── Scanning Line ─── */
function ScanLine({ active }) {
    return <div className={`spl-scanline ${active ? 'spl-scanline--active' : ''}`} />;
}

/* ─── Glitch Burst ─── */
function GlitchOverlay({ active }) {
    return (
        <div className={`spl-glitch-wrap ${active ? 'spl-glitch--fire' : ''}`}>
            <div className="spl-glitch-r" />
            <div className="spl-glitch-g" />
            <div className="spl-glitch-b" />
        </div>
    );
}

/* ─── Data Stream column ─── */
function DataStream({ side }) {
    const chars = '01アイウエオカキクケコ@#$%&'.split('');
    const cols = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.18,
        chars: Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)])
    }));
    return (
        <div className={`spl-datastream spl-datastream--${side}`}>
            {cols.map(col => (
                <div key={col.id} className="spl-ds-col" style={{ '--d': `${col.delay}s` }}>
                    {col.chars.map((ch, j) => (
                        <span key={j} className="spl-ds-char" style={{ '--j': j }}>{ch}</span>
                    ))}
                </div>
            ))}
        </div>
    );
}

/* ─── Main Component ─── */
const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState(0); // 0=black 1=scan 2=particles+bars 3=logo 4=text 5=settle 6=exit
    const scrambled = useScramble('ARIADNE', phase >= 4, 1100);

    useEffect(() => {
        const seq = [
            [120, () => setPhase(1)],   // scan line
            [450, () => setPhase(2)],   // bars open + particles visible
            [900, () => setPhase(3)],   // logo + aperture
            [1350, () => setPhase(4)],   // scramble text
            [2500, () => setPhase(5)],   // settle
            [3800, () => setPhase(6)],   // exit begins
            [4600, () => { if (onFinish) onFinish(); }],
        ];
        const timers = seq.map(([ms, fn]) => setTimeout(fn, ms));
        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    return (
        <div className={`spl-root phase-${phase}`}>
            {/* Canvas stars/particles */}
            <ParticleCanvas phase={phase} />

            {/* Grain */}
            <div className="spl-grain" />

            {/* Data streams flanking */}
            {phase >= 2 && <DataStream side="left" />}
            {phase >= 2 && <DataStream side="right" />}

            {/* Scanning line */}
            <ScanLine active={phase === 1} />

            {/* Glitch burst on logo reveal */}
            <GlitchOverlay active={phase === 3} />

            {/* Cinematic letterbox bars */}
            <div className={`spl-bar spl-bar-top ${phase >= 2 ? 'open' : ''}`} />
            <div className={`spl-bar spl-bar-bot ${phase >= 2 ? 'open' : ''}`} />

            {/* ── CENTER STAGE ── */}
            <div className={`spl-stage ${phase >= 3 ? 'visible' : ''}`}>

                {/* Holographic halo */}
                <div className="spl-halo" />
                <div className="spl-halo spl-halo-2" />

                {/* Rotating geometric frame */}
                <div className="spl-geo-frame">
                    <div className="spl-hex spl-hex-1" />
                    <div className="spl-hex spl-hex-2" />
                    <div className="spl-hex spl-hex-3" />
                </div>

                {/* Aperture rings + blades */}
                <div className="spl-aperture">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="spl-blade" style={{ '--i': i }} />
                    ))}
                    <div className="spl-ring spl-ring-1" />
                    <div className="spl-ring spl-ring-2" />

                    {/* Logo */}
                    <div className="spl-logo-cell">
                        <div className="spl-logo-holo" />
                        <img src="/mylogo.png" alt="Ariadne" className="spl-logo-img" />
                    </div>
                </div>

                {/* Brand scramble */}
                <div className="spl-brand" aria-label="ARIADNE">
                    {scrambled.split('').map((ch, i) => (
                        <span key={i} className={`spl-ch ${ch === 'ARIADNE'[i] ? 'resolved' : 'scrambling'}`}>
                            {ch || '\u00A0'}
                        </span>
                    ))}
                </div>

                {/* Tagline typewriter */}
                <div className={`spl-tagline ${phase >= 5 ? 'visible' : ''}`}>
                    <span className="spl-tg-line" />
                    <span className="spl-tg-text">Photography &amp; Visual Arts Studio</span>
                    <span className="spl-tg-line" />
                </div>

                {/* Progress */}
                <div className={`spl-prog-wrap ${phase >= 4 ? 'visible' : ''}`}>
                    <div className="spl-prog-track">
                        <div className="spl-prog-fill" />
                        <div className="spl-prog-spark" />
                    </div>
                    <div className="spl-prog-pct">{phase >= 5 ? '100%' : phase >= 4 ? '67%' : '0%'}</div>
                </div>
            </div>

            {/* Corner HUD brackets */}
            {['tl', 'tr', 'bl', 'br'].map(pos => (
                <span key={pos} className={`spl-hud spl-hud-${pos} ${phase >= 2 ? 'visible' : ''}`} />
            ))}

            {/* REC + timecode */}
            <div className={`spl-rec ${phase >= 2 ? 'visible' : ''}`}>
                <span className="spl-rec-dot" />
                <span className="spl-rec-label">REC</span>
            </div>
            <div className={`spl-tc ${phase >= 2 ? 'visible' : ''}`}>
                00:00:04:12
            </div>

            {/* Focus distance meter */}
            <div className={`spl-focus-meter ${phase >= 3 ? 'visible' : ''}`}>
                <span className="spl-focus-label">∞ AUTO</span>
                <div className="spl-focus-track">
                    <div className="spl-focus-needle" />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
