import { useMemo, useState } from "react";
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

export default function IndiaMapInteractive({
  cities = indiaTopMetros,
  title = "India Coverage Network",
  description = "Hover a city to see connections. Click to open details.",
  className,
}: Props) {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);

  const hoveredCity = useMemo(
    () => cities.find((c) => c.id === hoveredCityId) ?? null,
    [cities, hoveredCityId],
  );

  const activeCity = useMemo(
    () => cities.find((c) => c.id === activeCityId) ?? null,
    [cities, activeCityId],
  );

  const networkPairs = useMemo(() => {
    if (!hoveredCity) return [] as Array<{ from: IndiaCity; to: IndiaCity }>;
    return cities
      .filter((c) => c.id !== hoveredCity.id)
      .map((to) => ({ from: hoveredCity, to }));
  }, [cities, hoveredCity]);

  return (
    <TooltipProvider>
      <section className={className}>
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-heading">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </header>

        <div className="relative w-full overflow-hidden rounded-xl border bg-card">
          {/* Maintain a large, stable aspect area */}
          <div className="relative w-full aspect-[1/1]">
            {/* Map + network lines (SVG layer) */}
            <svg
              viewBox="0 0 1500 1500"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Interactive India map with major city markers"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="indiaInteractiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--secondary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>

                <filter id="indiaInteractiveGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* subtle fill */}
              <path d={INDIA_PATH} fill="hsl(var(--primary) / 0.03)" />

              {/* outline */}
              <path
                d={INDIA_PATH}
                fill="none"
                stroke="url(#indiaInteractiveGradient)"
                strokeWidth={2}
                opacity={0.5}
                filter="url(#indiaInteractiveGlow)"
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
            </svg>

            {/* Markers (HTML overlay for easy tooltip + click) */}
            <div className="absolute inset-0">
              {cities.map((city) => {
                const left = `${(city.x / 1500) * 100}%`;
                const top = `${(city.y / 1500) * 100}%`;
                const isHovered = hoveredCityId === city.id;

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
                          {/* outer pulse */}
                          <span
                            className={
                              "absolute inset-0 rounded-full bg-primary/20 " +
                              (isHovered ? "animate-ping" : "")
                            }
                          />

                          {/* core */}
                          <span
                            className={
                              "h-3.5 w-3.5 rounded-full bg-primary shadow-sm ring-2 ring-primary/30 transition-shadow " +
                              (isHovered ? "shadow-[0_0_24px_hsl(var(--primary)_/_0.45)]" : "")
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
            </div>
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
