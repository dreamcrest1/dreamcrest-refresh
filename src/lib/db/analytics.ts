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
  const { data, error } = await supabase.rpc("get_analytics_summary", {
    _days: days,
  });

  if (error) throw error;

  const result = data as {
    totalViews: number;
    uniqueSessions: number;
    topPages: { path: string; count: number }[];
    trafficSources: { source: string; count: number }[];
    dailyViews: { date: string; count: number }[];
  };

  return {
    totalViews: result.totalViews,
    uniqueSessions: result.uniqueSessions,
    topPages: result.topPages,
    trafficSources: result.trafficSources,
    dailyViews: result.dailyViews,
  };
}
