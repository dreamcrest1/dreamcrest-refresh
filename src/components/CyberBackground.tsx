import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20 dark:bg-primary/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.6, 0.2],
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

// Animated grid background
function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Perspective grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
          transformOrigin: 'center top',
        }}
      />
      
      {/* Horizontal moving lines */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{ top: `${30 + i * 20}%` }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Glowing orbs
function GlowingOrbs() {
  const orbs = [
    { color: "primary", size: 400, x: "10%", y: "20%", blur: 100 },
    { color: "secondary", size: 300, x: "80%", y: "60%", blur: 80 },
    { color: "primary", size: 250, x: "50%", y: "80%", blur: 60 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-10 dark:opacity-20`}
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
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
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
  const trailRef = useRef<{ x: number; y: number; life: number }[]>([]);

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
      trailRef.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trailRef.current.length > 50) {
        trailRef.current.shift();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      trailRef.current.forEach((point, index) => {
        point.life -= 0.02;
        if (point.life > 0) {
          const alpha = point.life * 0.5;
          const size = point.life * 8;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(18, 100%, 55%, ${alpha})`;
          ctx.fill();

          // Outer glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(18, 100%, 55%, ${alpha * 0.3})`;
          ctx.fill();
        }
      });

      // Remove dead points
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

// Main background component
export function CyberBackground() {
  return (
    <>
      <GlowingOrbs />
      <CyberGrid />
      <FloatingParticles />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
    </>
  );
}

export default CyberBackground;
