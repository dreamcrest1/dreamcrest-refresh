import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


// Matrix rain effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const desktop = window.matchMedia?.("(min-width: 768px)")?.matches ?? true;
    setEnabled(!reduceMotion && desktop);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01";
    const fontSize = 12;

    const draw = () => {
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = (draw as any).drops ?? Array(columns).fill(1);
      (draw as any).drops = drops.length === columns ? drops : Array(columns).fill(1);

      ctx.fillStyle = "rgba(10, 14, 39, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "hsl(18, 100%, 55%)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < (draw as any).drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.15;
        ctx.fillText(text, i * fontSize, (draw as any).drops[i] * fontSize);

        if ((draw as any).drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          (draw as any).drops[i] = 0;
        }
        (draw as any).drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    const interval = window.setInterval(draw, 60);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60"
    />
  );
}

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    color: i % 3 === 0 ? "primary" : i % 3 === 1 ? "secondary" : "neon-purple",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.color === "primary" 
              ? "bg-primary/30" 
              : particle.color === "secondary" 
              ? "bg-secondary/30" 
              : "bg-neon-purple/20"
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, Math.random() * 80 - 40, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  const shapes = [
    { type: "circle", size: 50, x: "8%", y: "18%", delay: 0 },
    { type: "square", size: 35, x: "88%", y: "12%", delay: 2 },
    { type: "triangle", size: 45, x: "78%", y: "72%", delay: 4 },
    { type: "circle", size: 25, x: "15%", y: "82%", delay: 1 },
    { type: "square", size: 20, x: "55%", y: "25%", delay: 3 },
    { type: "circle", size: 40, x: "92%", y: "48%", delay: 5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-primary/20 dark:border-primary/30"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            borderRadius: shape.type === "circle" ? "50%" : shape.type === "square" ? "8px" : "0",
            transform: shape.type === "triangle" ? "rotate(45deg)" : "none",
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 18 + i * 2,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated grid background
function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Perspective grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
          transformOrigin: 'center top',
        }}
      />
      
      {/* Animated scan lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)`,
          }}
          initial={{ top: "-10%", opacity: 0 }}
          animate={{
            top: ["0%", "100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 10,
            delay: i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Glowing orbs
function GlowingOrbs() {
  const orbs = [
    { color: "primary", size: 450, x: "5%", y: "15%", blur: 100 },
    { color: "secondary", size: 350, x: "88%", y: "55%", blur: 90 },
    { color: "primary", size: 300, x: "50%", y: "88%", blur: 80 },
    { color: "secondary", size: 250, x: "12%", y: "65%", blur: 70 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, hsl(var(--${orb.color})) 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.12, 0.06],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Cursor trail effect (desktop only)
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Smooth "thread" positions
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<{ x: number; y: number; life: number }[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const desktop = window.matchMedia?.("(min-width: 768px)")?.matches ?? true;
    setEnabled(!reduceMotion && desktop);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let hasPointer = false;
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!hasPointer) {
        hasPointer = true;
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationId = 0;
    const hue = 18; // keep brand-orange-ish

    const drawThread = (pts: { x: number; y: number; life: number }[]) => {
      if (pts.length < 2) return;

      // Core thread
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Build a smooth path using quadratic curves between midpoints
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i].x + pts[i + 1].x) / 2;
        const midY = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);

      const alpha = Math.min(0.75, Math.max(0.15, pts[0].life));
      ctx.strokeStyle = `hsla(${hue}, 100%, 55%, ${alpha})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = `hsla(${hue}, 100%, 55%, 0.45)`;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Outer soft glow
      ctx.shadowBlur = 28;
      ctx.lineWidth = 9;
      ctx.strokeStyle = `hsla(${hue}, 100%, 55%, ${alpha * 0.12})`;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      // Ease current position toward target for a smooth "thread" feel
      const ease = 0.22;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * ease;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * ease;

      // Add points at a controlled rate to avoid jitter
      if (hasPointer) {
        const pts = pointsRef.current;
        const last = pts[pts.length - 1];
        const dx = last ? posRef.current.x - last.x : 999;
        const dy = last ? posRef.current.y - last.y : 999;
        if (!last || dx * dx + dy * dy > 36) {
          pts.push({ x: posRef.current.x, y: posRef.current.y, life: 1 });
        }
        if (pts.length > 40) pts.shift();
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Fade life (tail)
      pointsRef.current.forEach((p, idx) => {
        // older points fade faster
        p.life -= 0.03 + idx * 0.0006;
      });
      pointsRef.current = pointsRef.current.filter((p) => p.life > 0);

      drawThread(pointsRef.current);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
// Main background component
export function CyberBackground() {
  return (
    <>
      <GlowingOrbs />
      <CyberGrid />
      <FloatingParticles />
      <FloatingShapes />
      <MatrixRain />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />
    </>
  );
}

export default CyberBackground;
