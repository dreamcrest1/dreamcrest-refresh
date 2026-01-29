import { supabase } from "@/integrations/supabase/client";

export type PageView = {
  id: string;
  page_path: string;
  referrer: string | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
};

// Track a page view (public, anonymous)
export async function trackPageView(pagePath: string, referrer?: string): Promise<void> {
  // Generate or retrieve session ID from sessionStorage
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }

  await supabase.from("page_views").insert({
    page_path: pagePath,
    referrer: referrer || document.referrer || null,
    user_agent: navigator.userAgent,
    session_id: sessionId,
  });
}

// Admin analytics functions
export async function getPageViewStats(startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from("page_views")
    .select("*")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as PageView[];
}

export async function getAnalyticsSummary(days: number = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("page_views")
    .select("*")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) throw error;

  const views = data as PageView[];
  
  // Calculate metrics
  const totalViews = views.length;
  const uniqueSessions = new Set(views.map(v => v.session_id).filter(Boolean)).size;
  
  // Page path counts
  const pagePathCounts: Record<string, number> = {};
  views.forEach(v => {
    pagePathCounts[v.page_path] = (pagePathCounts[v.page_path] || 0) + 1;
  });
  
  // Top pages
  const topPages = Object.entries(pagePathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  // Referrer counts
  const referrerCounts: Record<string, number> = {};
  views.forEach(v => {
    if (v.referrer) {
      try {
        const url = new URL(v.referrer);
        const source = url.hostname || "Direct";
        referrerCounts[source] = (referrerCounts[source] || 0) + 1;
      } catch {
        referrerCounts["Direct"] = (referrerCounts["Direct"] || 0) + 1;
      }
    } else {
      referrerCounts["Direct"] = (referrerCounts["Direct"] || 0) + 1;
    }
  });

  const trafficSources = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  // Views by day
  const viewsByDay: Record<string, number> = {};
  views.forEach(v => {
    const day = v.created_at.split("T")[0];
    viewsByDay[day] = (viewsByDay[day] || 0) + 1;
  });

  const dailyViews = Object.entries(viewsByDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  return {
    totalViews,
    uniqueSessions,
    topPages,
    trafficSources,
    dailyViews,
  };
}
