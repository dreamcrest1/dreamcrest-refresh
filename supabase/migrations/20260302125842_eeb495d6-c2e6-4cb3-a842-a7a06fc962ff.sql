
-- Server-side analytics aggregation to avoid 1000 row limit
CREATE OR REPLACE FUNCTION public.get_analytics_summary(_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _start_date timestamptz;
  _end_date timestamptz;
  _total_views bigint;
  _unique_sessions bigint;
  _top_pages jsonb;
  _traffic_sources jsonb;
  _daily_views jsonb;
BEGIN
  -- Only allow admins
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  _end_date := now();
  _start_date := now() - (_days || ' days')::interval;

  -- Total views
  SELECT count(*) INTO _total_views
  FROM page_views
  WHERE created_at >= _start_date AND created_at <= _end_date;

  -- Unique sessions
  SELECT count(DISTINCT session_id) INTO _unique_sessions
  FROM page_views
  WHERE created_at >= _start_date AND created_at <= _end_date
    AND session_id IS NOT NULL;

  -- Top pages
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO _top_pages
  FROM (
    SELECT page_path as path, count(*) as count
    FROM page_views
    WHERE created_at >= _start_date AND created_at <= _end_date
    GROUP BY page_path
    ORDER BY count DESC
    LIMIT 10
  ) t;

  -- Traffic sources (parse referrer hostname)
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO _traffic_sources
  FROM (
    SELECT 
      CASE 
        WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
        ELSE coalesce(
          (regexp_match(referrer, '://([^/]+)'))[1],
          'Direct'
        )
      END as source,
      count(*) as count
    FROM page_views
    WHERE created_at >= _start_date AND created_at <= _end_date
    GROUP BY source
    ORDER BY count DESC
    LIMIT 10
  ) t;

  -- Daily views
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO _daily_views
  FROM (
    SELECT created_at::date::text as date, count(*) as count
    FROM page_views
    WHERE created_at >= _start_date AND created_at <= _end_date
    GROUP BY created_at::date
    ORDER BY date ASC
  ) t;

  RETURN jsonb_build_object(
    'totalViews', _total_views,
    'uniqueSessions', _unique_sessions,
    'topPages', _top_pages,
    'trafficSources', _traffic_sources,
    'dailyViews', _daily_views
  );
END;
$$;
