import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "hsl(18, 100%, 55%)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.3;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-50"
    />
  );
}

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
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
            y: [0, -150, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
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
    { type: "circle", size: 60, x: "10%", y: "20%", delay: 0 },
    { type: "square", size: 40, x: "85%", y: "15%", delay: 2 },
    { type: "triangle", size: 50, x: "75%", y: "70%", delay: 4 },
    { type: "circle", size: 30, x: "20%", y: "80%", delay: 1 },
    { type: "square", size: 25, x: "60%", y: "30%", delay: 3 },
    { type: "circle", size: 45, x: "90%", y: "50%", delay: 5 },
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
            y: [0, -30, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 15 + i * 2,
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
      
      {/* Animated scan lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)`,
          }}
          initial={{ top: "-10%", opacity: 0 }}
          animate={{
            top: ["0%", "100%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Horizontal glowing lines */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{ top: `${30 + i * 25}%` }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scaleX: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 5,
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
    { color: "primary", size: 500, x: "5%", y: "15%", blur: 120 },
    { color: "secondary", size: 400, x: "85%", y: "55%", blur: 100 },
    { color: "primary", size: 350, x: "50%", y: "85%", blur: 90 },
    { color: "secondary", size: 300, x: "15%", y: "60%", blur: 80 },
    { color: "primary", size: 250, x: "70%", y: "20%", blur: 70 },
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
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating tech icons
function FloatingIcons() {
  const icons = ["💻", "🤖", "📺", "☁️", "🎬", "✨", "🚀", "⚡"];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20 dark:opacity-30"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
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
        hue: 18 + Math.random() * 20 // Orange hue variations
      });
      if (trailRef.current.length > 60) {
        trailRef.current.shift();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines
      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        trailRef.current.forEach((point, i) => {
          if (i > 0 && point.life > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.strokeStyle = `hsla(18, 100%, 55%, 0.15)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw trail points
      trailRef.current.forEach((point) => {
        point.life -= 0.015;
        if (point.life > 0) {
          const alpha = point.life * 0.6;
          const size = point.life * 10;
          
          // Inner glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${point.hue}, 100%, 60%, ${alpha})`;
          ctx.fill();

          // Outer glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${point.hue}, 100%, 55%, ${alpha * 0.3})`;
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
          animate={{ width: 150, height: 150, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Main background component
export function CyberBackground() {
  return (
    <>
      <GlowingOrbs />
      <CyberGrid />
      <FloatingParticles />
      <FloatingShapes />
      <FloatingIcons />
      <MatrixRain />
      <TouchRipple />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
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
