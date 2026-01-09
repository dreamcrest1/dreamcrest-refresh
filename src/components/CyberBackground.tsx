import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// India Map SVG Path (simplified outline)
const INDIA_PATH = "M 200 50 L 220 45 L 250 55 L 280 50 L 310 60 L 340 55 L 360 70 L 380 75 L 400 70 L 420 80 L 440 85 L 450 100 L 460 120 L 455 140 L 460 160 L 470 180 L 480 200 L 475 220 L 480 240 L 490 260 L 485 280 L 475 300 L 465 320 L 450 340 L 435 360 L 420 380 L 400 400 L 380 420 L 360 435 L 340 450 L 320 460 L 300 470 L 280 475 L 260 480 L 240 475 L 220 470 L 200 480 L 180 490 L 160 485 L 140 475 L 130 460 L 120 440 L 110 420 L 105 400 L 100 380 L 95 360 L 90 340 L 85 320 L 80 300 L 85 280 L 90 260 L 95 240 L 100 220 L 110 200 L 120 180 L 130 160 L 140 140 L 150 120 L 160 100 L 175 80 L 190 65 Z";

// Animated India Map Background
function IndiaMapBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 600 600"
        className="w-[80vw] h-[80vh] max-w-[800px] max-h-[800px] opacity-[0.03] dark:opacity-[0.08]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Outer glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
        
        {/* Animated India outline */}
        <motion.path
          d={INDIA_PATH}
          fill="none"
          stroke="url(#indiaGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
        
        {/* Pulsing dots on major cities */}
        {[
          { cx: 280, cy: 130, name: "Delhi" },
          { cx: 180, cy: 280, name: "Mumbai" },
          { cx: 380, cy: 350, name: "Kolkata" },
          { cx: 340, cy: 450, name: "Chennai" },
          { cx: 260, cy: 380, name: "Bangalore" },
        ].map((city, i) => (
          <motion.circle
            key={city.name}
            cx={city.cx}
            cy={city.cy}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              delay: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Connection lines between cities */}
        <motion.path
          d="M 280 130 L 180 280 L 260 380 L 340 450 L 380 350 L 280 130"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, delay: 5 }}
        />
      </motion.svg>
    </div>
  );
}

// Matrix rain effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "hsl(18, 100%, 55%)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.15;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    const interval = setInterval(draw, 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
  const mouseRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef<{ x: number; y: number; life: number; hue: number }[]>([]);

  useEffect(() => {
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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      trailRef.current.push({ 
        x: e.clientX, 
        y: e.clientY, 
        life: 1,
        hue: 18 + Math.random() * 15
      });
      if (trailRef.current.length > 50) {
        trailRef.current.shift();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail points
      trailRef.current.forEach((point) => {
        point.life -= 0.02;
        if (point.life > 0) {
          const alpha = point.life * 0.5;
          const size = point.life * 8;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${point.hue}, 100%, 55%, ${alpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${point.hue}, 100%, 55%, ${alpha * 0.25})`;
          ctx.fill();
        }
      });

      trailRef.current = trailRef.current.filter((p) => p.life > 0);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 hidden md:block"
    />
  );
}

// Touch ripple effect for mobile
function TouchRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        const newRipple = {
          id: Date.now(),
          x: touch.clientX,
          y: touch.clientY,
        };
        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1000);
      }
    };

    window.addEventListener("touchstart", handleTouch);
    return () => window.removeEventListener("touchstart", handleTouch);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 md:hidden">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 border-primary"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 120, height: 120, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Main background component
export function CyberBackground() {
  return (
    <>
      <IndiaMapBackground />
      <GlowingOrbs />
      <CyberGrid />
      <FloatingParticles />
      <FloatingShapes />
      <MatrixRain />
      <TouchRipple />
      
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
