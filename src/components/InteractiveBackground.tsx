import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  type: "ripple" | "burst" | "sparkle" | "hex" | "confetti" | "heart" | "firework" | "portal" | "lightning" | "spiral";
}

interface HoverTrail {
  id: number;
  x: number;
  y: number;
  hue: number;
}

const EFFECT_TYPES: ClickEffect["type"][] = [
  "ripple", "burst", "sparkle", "hex", "confetti", "heart", "firework", "portal", "lightning", "spiral"
];

export function InteractiveBackground() {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [hoverTrails, setHoverTrails] = useState<HoverTrail[]>([]);
  const [magneticPoints, setMagneticPoints] = useState<{ x: number; y: number; size: number }[]>([]);
  const lastTrailRef = useRef(0);
  const hueRef = useRef(0);

  // Generate random magnetic points
  useEffect(() => {
    const generatePoints = () => {
      return Array.from({ length: 12 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 8 + 4,
      }));
    };
    
    setMagneticPoints(generatePoints());

    const handleResize = () => setMagneticPoints(generatePoints());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle background clicks
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("[data-interactive]") ||
      target.closest(".product-card") ||
      target.closest(".cyber-card")
    ) {
      return;
    }

    const randomType = EFFECT_TYPES[Math.floor(Math.random() * EFFECT_TYPES.length)];

    const effect: ClickEffect = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      type: randomType,
    };

    setClickEffects((prev) => [...prev, effect]);

    setTimeout(() => {
      setClickEffects((prev) => prev.filter((ef) => ef.id !== effect.id));
    }, 2000);
  }, []);

  // Handle mouse move for hover trails
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastTrailRef.current < 30) return;
    lastTrailRef.current = now;

    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest(".product-card") ||
      target.closest(".cyber-card")
    ) {
      return;
    }

    hueRef.current = (hueRef.current + 2) % 360;

    const trail: HoverTrail = {
      id: now + Math.random(),
      x: e.clientX,
      y: e.clientY,
      hue: hueRef.current,
    };

    setHoverTrails((prev) => [...prev.slice(-30), trail]);

    setTimeout(() => {
      setHoverTrails((prev) => prev.filter((t) => t.id !== trail.id));
    }, 800);
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Magnetic points */}
      {magneticPoints.map((point, i) => (
        <MagneticPoint key={i} x={point.x} y={point.y} size={point.size} />
      ))}

      {/* Rainbow hover trail */}
      <AnimatePresence>
        {hoverTrails.map((trail) => (
          <motion.div
            key={trail.id}
            className="absolute rounded-full"
            style={{ 
              left: trail.x, 
              top: trail.y, 
              transform: "translate(-50%, -50%)",
              background: `hsl(${trail.hue}, 80%, 60%)`,
              boxShadow: `0 0 10px hsl(${trail.hue}, 80%, 60%)`,
            }}
            initial={{ scale: 1, opacity: 0.7, width: 8, height: 8 }}
            animate={{ scale: 0, opacity: 0, width: 2, height: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Click effects */}
      <AnimatePresence>
        {clickEffects.map((effect) => (
          <ClickEffectRenderer key={effect.id} effect={effect} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Magnetic point component
function MagneticPoint({ x, y, size }: { x: number; y: number; size: number }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        setIsNear(true);
        const force = (120 - distance) / 120;
        setOffset({
          x: dx * force * 0.4,
          y: dy * force * 0.4,
        });
      } else {
        setIsNear(false);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{ 
        left: x, 
        top: y, 
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        background: isNear ? "hsl(var(--primary) / 0.4)" : "hsl(var(--primary) / 0.1)",
        border: `1px solid hsl(var(--primary) / ${isNear ? 0.6 : 0.2})`,
        boxShadow: isNear ? "0 0 15px hsl(var(--primary) / 0.3)" : "none",
      }}
      animate={{
        x: offset.x,
        y: offset.y,
        scale: isNear ? 2 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    />
  );
}

// Click effect renderer with many more effects
function ClickEffectRenderer({ effect }: { effect: ClickEffect }) {
  const { x, y, type } = effect;

  if (type === "ripple") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-primary"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 180 + i * 40, height: 180 + i * 40, opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
      </>
    );
  }

  if (type === "burst") {
    const particles = Array.from({ length: 16 }, (_, i) => ({
      angle: (i * 22.5 * Math.PI) / 180,
      distance: 50 + Math.random() * 50,
      size: Math.random() * 6 + 2,
    }));

    return (
      <>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{ left: x, top: y, width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-primary/60"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </>
    );
  }

  if (type === "sparkle") {
    const sparkles = Array.from({ length: 10 }, (_, i) => ({
      angle: (i * 36 * Math.PI) / 180,
      size: 6 + Math.random() * 6,
      distance: 40 + Math.random() * 30,
    }));

    return (
      <>
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              x: Math.cos(s.angle) * s.distance,
              y: Math.sin(s.angle) * s.distance,
              opacity: 0,
              rotate: 180,
              scale: 0,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 24 24">
              <path
                d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                fill="hsl(var(--primary))"
              />
            </svg>
          </motion.div>
        ))}
      </>
    );
  }

  if (type === "hex") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            width={140}
            height={140}
            viewBox="0 0 120 120"
            className="absolute"
            style={{ left: x - 70, top: y - 70 }}
            initial={{ opacity: 1, scale: 0.2 + i * 0.2, rotate: i * 30 }}
            animate={{ opacity: 0, scale: 1.5 + i * 0.3, rotate: 60 + i * 30 }}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
          >
            <polygon
              points="60,10 105,35 105,85 60,110 15,85 15,35"
              fill="none"
              stroke={i === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
              strokeWidth={2 - i * 0.5}
            />
          </motion.svg>
        ))}
      </>
    );
  }

  if (type === "confetti") {
    const confetti = Array.from({ length: 30 }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      distance: 60 + Math.random() * 80,
      rotation: Math.random() * 720 - 360,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      size: Math.random() * 8 + 4,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    return (
      <>
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: x,
              top: y,
              width: c.shape === "rect" ? c.size : c.size,
              height: c.shape === "rect" ? c.size * 0.6 : c.size,
              borderRadius: c.shape === "circle" ? "50%" : "2px",
              background: c.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              x: Math.cos(c.angle) * c.distance,
              y: Math.sin(c.angle) * c.distance + 100,
              opacity: 0,
              rotate: c.rotation,
              scale: 0.5,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}
      </>
    );
  }

  if (type === "heart") {
    const hearts = Array.from({ length: 8 }, (_, i) => ({
      angle: (i * 45 * Math.PI) / 180 - Math.PI / 2,
      distance: 40 + Math.random() * 40,
      size: 12 + Math.random() * 10,
      delay: i * 0.05,
    }));

    return (
      <>
        {hearts.map((h, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500"
            style={{ left: x, top: y, fontSize: h.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: Math.cos(h.angle) * h.distance,
              y: Math.sin(h.angle) * h.distance - 30,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 1, delay: h.delay, ease: "easeOut" }}
          >
            ❤️
          </motion.div>
        ))}
      </>
    );
  }

  if (type === "firework") {
    const sparks = Array.from({ length: 20 }, (_, i) => ({
      angle: (i * 18 * Math.PI) / 180,
      distance: 60 + Math.random() * 60,
      color: `hsl(${Math.random() * 60 + 15}, 100%, 55%)`,
    }));

    return (
      <>
        {/* Initial burst */}
        <motion.div
          className="absolute rounded-full bg-yellow-400"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ width: 4, height: 4, opacity: 1 }}
          animate={{ width: 20, height: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
        {/* Sparks */}
        {sparks.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ left: x, top: y, background: s.color, boxShadow: `0 0 6px ${s.color}` }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(s.angle) * s.distance,
              y: Math.sin(s.angle) * s.distance + 20,
              opacity: 0,
            }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.4, 1] }}
          />
        ))}
      </>
    );
  }

  if (type === "portal") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderColor: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
            }}
            initial={{ width: 10, height: 10, opacity: 0.8, rotate: 0 }}
            animate={{ width: 150 - i * 20, height: 150 - i * 20, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </>
    );
  }

  if (type === "lightning") {
    const bolts = Array.from({ length: 4 }, (_, i) => ({
      angle: (i * 90 + 45) * Math.PI / 180,
      length: 50 + Math.random() * 30,
    }));

    return (
      <>
        <motion.div
          className="absolute rounded-full bg-yellow-300"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ width: 10, height: 10, opacity: 1 }}
          animate={{ width: 40, height: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        {bolts.map((b, i) => (
          <motion.svg
            key={i}
            className="absolute"
            style={{ left: x, top: y }}
            width={100}
            height={100}
            viewBox="-50 -50 100 100"
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          >
            <motion.path
              d={`M 0 0 L ${Math.cos(b.angle) * 20} ${Math.sin(b.angle) * 20} 
                  L ${Math.cos(b.angle + 0.3) * 35} ${Math.sin(b.angle + 0.3) * 35}
                  L ${Math.cos(b.angle) * b.length} ${Math.sin(b.angle) * b.length}`}
              stroke="hsl(50, 100%, 60%)"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ))}
      </>
    );
  }

  if (type === "spiral") {
    const dots = Array.from({ length: 20 }, (_, i) => {
      const angle = i * 0.5;
      const distance = i * 4;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 6 - i * 0.25,
        delay: i * 0.02,
      };
    });

    return (
      <>
        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{ left: x, top: y, width: Math.max(d.size, 2), height: Math.max(d.size, 2) }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: d.x * 2, y: d.y * 2, opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: d.delay, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute rounded-full border-2 border-secondary"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ width: 0, height: 0, rotate: 0, opacity: 0.8 }}
          animate={{ width: 100, height: 100, rotate: 360, opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </>
    );
  }

  return null;
}

export default InteractiveBackground;
