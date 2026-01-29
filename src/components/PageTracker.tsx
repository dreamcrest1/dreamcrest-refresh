import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/db/analytics";

export function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith("/admin")) return;
    
    // Track page view on route change
    trackPageView(location.pathname).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  }, [location.pathname]);

  return null;
}
