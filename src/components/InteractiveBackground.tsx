import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  type: "ripple" | "burst" | "sparkle" | "hex";
}

interface HoverTrail {
  id: number;
  x: number;
  y: number;
}

export function InteractiveBackground() {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [hoverTrails, setHoverTrails] = useState<HoverTrail[]>([]);
  const [magneticPoints, setMagneticPoints] = useState<{ x: number; y: number }[]>([]);
  const lastTrailRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random magnetic points
  useEffect(() => {
    const points = Array.from({ length: 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setMagneticPoints(points);

    const handleResize = () => {
      setMagneticPoints(
        Array.from({ length: 8 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }))
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle background clicks
  const handleClick = useCallback((e: MouseEvent) => {
    // Only trigger on actual background (not on interactive elements)
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("[data-interactive]")
    ) {
      return;
    }

    const types: ClickEffect["type"][] = ["ripple", "burst", "sparkle", "hex"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const effect: ClickEffect = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      type: randomType,
    };

    setClickEffects((prev) => [...prev, effect]);

    // Remove after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((ef) => ef.id !== effect.id));
    }, 1500);
  }, []);

  // Handle mouse move for hover trails
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastTrailRef.current < 50) return; // Throttle
    lastTrailRef.current = now;

    // Only add trails in empty space
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

    const trail: HoverTrail = {
      id: now + Math.random(),
      x: e.clientX,
      y: e.clientY,
    };

    setHoverTrails((prev) => [...prev.slice(-20), trail]);

    // Remove trail particle
    setTimeout(() => {
      setHoverTrails((prev) => prev.filter((t) => t.id !== trail.id));
    }, 1000);
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
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
    >
      {/* Magnetic points that react to nearby cursor */}
      {magneticPoints.map((point, i) => (
        <MagneticPoint key={i} x={point.x} y={point.y} />
      ))}

      {/* Hover trail particles */}
      <AnimatePresence>
        {hoverTrails.map((trail) => (
          <motion.div
            key={trail.id}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{ left: trail.x, top: trail.y, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
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
function MagneticPoint({ x, y }: { x: number; y: number }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        setOffset({
          x: dx * force * 0.3,
          y: dy * force * 0.3,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full bg-primary/10 border border-primary/20"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      animate={{
        x: offset.x,
        y: offset.y,
        scale: offset.x !== 0 || offset.y !== 0 ? 1.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    />
  );
}

// Click effect renderer
function ClickEffectRenderer({ effect }: { effect: ClickEffect }) {
  const { x, y, type } = effect;

  if (type === "ripple") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-primary"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{
              width: 150 + i * 50,
              height: 150 + i * 50,
              opacity: 0,
            }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
          />
        ))}
      </>
    );
  }

  if (type === "burst") {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      angle: (i * 30 * Math.PI) / 180,
      distance: 60 + Math.random() * 40,
    }));

    return (
      <>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ left: x, top: y }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-primary/50"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </>
    );
  }

  if (type === "sparkle") {
    const sparkles = Array.from({ length: 8 }, (_, i) => ({
      angle: (i * 45 * Math.PI) / 180,
      size: 4 + Math.random() * 4,
    }));

    return (
      <>
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(s.angle) * 50,
              y: Math.sin(s.angle) * 50,
              opacity: 0,
              rotate: 180,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
      <motion.svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        className="absolute"
        style={{ left: x - 60, top: y - 60 }}
        initial={{ opacity: 1, scale: 0, rotate: 0 }}
        animate={{ opacity: 0, scale: 1.5, rotate: 60 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <polygon
          points="60,10 105,35 105,85 60,110 15,85 15,35"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
        <polygon
          points="60,25 90,42.5 90,77.5 60,95 30,77.5 30,42.5"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={1.5}
        />
      </motion.svg>
    );
  }

  return null;
}

export default InteractiveBackground;
