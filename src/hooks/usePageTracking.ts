import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/db/analytics";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  }, [location.pathname]);
}
