import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { INDIA_PATH } from "@/lib/indiaMap";
import { indiaTopMetros, type IndiaCity } from "@/data/indiaCities";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

type Props = {
  cities?: IndiaCity[];
  title?: string;
  description?: string;
  className?: string;
};

function CityDetailsPanel({
  city,
  open,
  onOpenChange,
}: {
  city: IndiaCity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  const content = city ? (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {city.description ?? "Delivery coverage details coming soon."}
        </p>
      </div>
      <div className="pt-4">
        <Button className="w-full">Enquire for {city.name}</Button>
      </div>
    </>
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>{city?.name ?? ""}</DrawerTitle>
              <DrawerDescription>
                Tap other markers to explore coverage.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">{content}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{city?.name ?? ""}</DialogTitle>
          <DialogDescription>
            Hover for network lines, click for details.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function useSvgFitToViewBox({
  viewBoxWidth,
  viewBoxHeight,
}: {
  viewBoxWidth: number;
  viewBoxHeight: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const scale = Math.min(rect.width / viewBoxWidth, rect.height / viewBoxHeight);
      const contentW = viewBoxWidth * scale;
      const contentH = viewBoxHeight * scale;
      const offsetX = (rect.width - contentW) / 2;
      const offsetY = (rect.height - contentH) / 2;
      setFit({ scale, offsetX, offsetY });
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewBoxWidth, viewBoxHeight]);

  return { containerRef, fit };
}

export default function IndiaMapInteractive({
  cities = indiaTopMetros,
  title = "India Coverage Network",
  description = "Hover a city to see connections. Click to open details.",
  className,
}: Props) {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);

  const { containerRef, fit } = useSvgFitToViewBox({
    viewBoxWidth: 1500,
    viewBoxHeight: 1500,
  });

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const pathRef = useRef<SVGPathElement | null>(null);
  const [dotProgress, setDotProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (!pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength());
  }, []);

  // Traveling dot along the outline (contained inside the map area)
  useEffect(() => {
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduceMotion) return;

    const duration = 18000;
    let startTime = 0;
    let raf = 0;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      setDotProgress(((elapsed % duration) / duration + 1) % 1);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getPointOnPath = (progress: number) => {
    if (!pathRef.current || pathLength === 0) return { x: 0, y: 0 };
    const p = pathRef.current.getPointAtLength(progress * pathLength);
    return { x: p.x, y: p.y };
  };

  const dotPosition = getPointOnPath(dotProgress);
  const trailPositions = [0.025, 0.05, 0.075].map((offset) =>
    getPointOnPath((dotProgress - offset + 1) % 1),
  );

  const hoveredCity = useMemo(
    () => cities.find((c) => c.id === hoveredCityId) ?? null,
    [cities, hoveredCityId],
  );

  const activeCity = useMemo(
    () => cities.find((c) => c.id === activeCityId) ?? null,
    [cities, activeCityId],
  );

  const networkPairs = useMemo(() => {
    if (!hoveredCity) return [] as Array<{ from: IndiaCity; to: IndiaCity }>; // all connections
    return cities
      .filter((c) => c.id !== hoveredCity.id)
      .map((to) => ({ from: hoveredCity, to }));
  }, [cities, hoveredCity]);

  const mapOffsetX = parallax.x;
  const mapOffsetY = parallax.y;

  return (
    <TooltipProvider>
      <section className={className}>
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-heading">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </header>

        <div className="relative w-full overflow-hidden rounded-xl border bg-card">
          {/* Maintain a large, stable aspect area */}
          <div
            ref={containerRef}
            className="relative w-full aspect-[1/1]"
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const r = el.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
              const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
              // Keep it subtle so it feels premium, not gimmicky
              setParallax({ x: dx * 10, y: dy * 10 });
            }}
            onMouseLeave={() => setParallax({ x: 0, y: 0 })}
          >
            {/* SVG layer (parallax) */}
            <motion.svg
              viewBox="0 0 1500 1500"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Interactive India map with major city markers"
              preserveAspectRatio="xMidYMid meet"
              animate={{ x: mapOffsetX, y: mapOffsetY }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <defs>
                <linearGradient
                  id="indiaInteractiveGradientAnimated"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <motion.stop
                    offset="0%"
                    animate={{
                      stopColor: [
                        "hsl(var(--primary))",
                        "hsl(var(--secondary))",
                        "hsl(var(--primary))",
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.stop
                    offset="100%"
                    animate={{
                      stopColor: [
                        "hsl(var(--secondary))",
                        "hsl(var(--primary))",
                        "hsl(var(--secondary))",
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </linearGradient>

                <filter
                  id="indiaInteractiveGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="indiaDotGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* subtle fill */}
              <path d={INDIA_PATH} fill="hsl(var(--primary) / 0.03)" />

              {/* outline */}
              <motion.path
                ref={pathRef}
                d={INDIA_PATH}
                fill="none"
                stroke="url(#indiaInteractiveGradientAnimated)"
                strokeWidth={2}
                opacity={0.55}
                filter="url(#indiaInteractiveGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.8, ease: "easeInOut" }}
              />

              {/* secondary outline for depth */}
              <path
                d={INDIA_PATH}
                fill="none"
                stroke="hsl(var(--primary) / 0.10)"
                strokeWidth={1}
              />

              {/* network lines */}
              {networkPairs.map(({ from, to }) => (
                <motion.path
                  key={`${from.id}->${to.id}`}
                  d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.65)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="6 10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, strokeDashoffset: [0, -64] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              ))}

              {/* traveling dot trail */}
              {trailPositions.map((pos, i) => (
                <circle
                  key={i}
                  cx={pos.x}
                  cy={pos.y}
                  r={6 - i * 1.4}
                  fill={`hsl(var(--primary) / ${0.24 - i * 0.06})`}
                />
              ))}

              {/* main traveling dot */}
              <motion.circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r={9}
                fill="hsl(var(--primary))"
                filter="url(#indiaDotGlow)"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r={3.5}
                fill="hsl(var(--primary-foreground))"
              />
            </motion.svg>

            {/* Markers (HTML overlay; positioned using the SAME fit math as the SVG) */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: mapOffsetX, y: mapOffsetY }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {cities.map((city) => {
                const left = fit.offsetX + city.x * fit.scale;
                const top = fit.offsetY + city.y * fit.scale;
                const isHovered = hoveredCityId === city.id;
                const isActive = activeCityId === city.id;

                return (
                  <div
                    key={city.id}
                    className="absolute"
                    style={{ left, top, transform: "translate(-50%, -50%)" }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={city.name}
                          onMouseEnter={() => setHoveredCityId(city.id)}
                          onMouseLeave={() => setHoveredCityId(null)}
                          onFocus={() => setHoveredCityId(city.id)}
                          onBlur={() => setHoveredCityId(null)}
                          onClick={() => setActiveCityId(city.id)}
                          className={
                            "relative grid place-items-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                            (isHovered ? "scale-110" : "scale-100")
                          }
                        >
                          {/* ambient pulse */}
                          <span
                            className={
                              "absolute inset-0 rounded-full bg-primary/20 " +
                              (isHovered ? "animate-ping" : "")
                            }
                          />

                          {/* click ripple */}
                          {isActive ? (
                            <motion.span
                              key={`${city.id}-active`}
                              className="absolute inset-0 rounded-full bg-primary/15"
                              initial={{ scale: 1, opacity: 0.6 }}
                              animate={{ scale: 2.2, opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          ) : null}

                          {/* core */}
                          <span
                            className={
                              "h-3.5 w-3.5 rounded-full bg-primary shadow-sm ring-2 ring-primary/30 transition-shadow " +
                              (isHovered
                                ? "shadow-[0_0_24px_hsl(var(--primary)_/_0.45)]"
                                : "")
                            }
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={8}>
                        <span className="font-medium">{city.name}</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <CityDetailsPanel
          city={activeCity}
          open={!!activeCityId}
          onOpenChange={(open) => {
            if (!open) setActiveCityId(null);
          }}
        />
      </section>
    </TooltipProvider>
  );
}


