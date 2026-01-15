import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const minVisibleMs = 450;

    let raf = 0;
    let done = false;

    const markDone = () => {
      done = true;
    };

    // If the document is already loaded, don't hold the preloader.
    if (document.readyState === "complete") {
      markDone();
    } else {
      window.addEventListener("load", markDone, { once: true });
    }

    const tick = () => {
      setProgress((p) => {
        if (done) return 100;
        // Ease towards 92% while waiting for load event
        const next = p + (92 - p) * 0.06;
        return Math.min(next, 92);
      });

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    const finishInterval = window.setInterval(() => {
      if (!done) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed < minVisibleMs) return;

      setProgress(100);
      window.setTimeout(() => setIsLoading(false), 200);
      window.clearInterval(finishInterval);
      window.cancelAnimationFrame(raf);
    }, 60);

    return () => {
      window.removeEventListener("load", markDone);
      window.clearInterval(finishInterval);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 cyber-grid opacity-30" />
          
          {/* Glowing orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
            animate={{
              x: [0, -100, 100, 0],
              y: [0, 100, -100, 0],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Scan lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.03) 2px, hsl(var(--primary) / 0.03) 4px)",
            }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo / Brand with glitch effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-wider"
                animate={{
                  textShadow: [
                    "0 0 20px hsl(var(--primary))",
                    "0 0 40px hsl(var(--primary)), 0 0 60px hsl(var(--secondary))",
                    "0 0 20px hsl(var(--primary))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="gradient-text">DREAMCREST</span>
              </motion.h1>
              
              {/* Glitch layers */}
              <motion.h1
                className="absolute inset-0 text-5xl md:text-7xl font-bold tracking-wider text-primary opacity-50"
                animate={{
                  x: [-2, 2, -2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
              >
                DREAMCREST
              </motion.h1>
              <motion.h1
                className="absolute inset-0 text-5xl md:text-7xl font-bold tracking-wider text-secondary opacity-50"
                animate={{
                  x: [2, -2, 2],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
              >
                DREAMCREST
              </motion.h1>
            </motion.div>

            {/* Futuristic progress bar */}
            <div className="relative w-80 md:w-96">
              {/* Outer frame */}
              <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/50 backdrop-blur-sm">
                {/* Progress fill */}
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
                    backgroundSize: "200% 100%",
                  }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    width: { duration: 0.3 },
                    backgroundPosition: { duration: 1, repeat: Infinity, ease: "linear" },
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* Progress percentage */}
              <motion.div
                className="mt-4 text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-2xl font-mono font-bold text-primary">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </motion.div>
            </div>

            {/* Loading text with typing effect */}
            <motion.p
              className="mt-6 text-muted-foreground text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initializing Experience...
            </motion.p>

            {/* Decorative elements */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-primary/50" />
          <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-primary/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
