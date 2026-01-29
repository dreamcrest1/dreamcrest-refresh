// Minimal function to satisfy Cloud tooling; safe to remove once you add real backend functions.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(() => new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } }));
