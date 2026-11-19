// Utilidades comunes de las edge functions (Deno).
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Cabeceras CORS. ALLOWED_ORIGINS = lista separada por comas (p. ej. https://cristaleriabaixvinalopo.es). */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = allowed.includes("*") ? "*" : allowed.includes(origin) ? origin : allowed[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Cliente con la clave secreta (salta RLS). Solo para uso en servidor. */
export function adminClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL")!;
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  const key = secretKeys ? JSON.parse(secretKeys)["default"] : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash de la IP del cliente (no se guarda la IP en claro). */
export function clientIpHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
  return sha256(`${Deno.env.get("RATE_LIMIT_SALT") ?? "cristaleriabv"}:${ip}`);
}

/**
 * Límite de peticiones por IP y función. Devuelve true si se puede continuar.
 * Registra la petición en public.request_log.
 */
export async function rateLimit(db: SupabaseClient, fn: string, ipHash: string, max: number, windowMinutes: number) {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const { count, error } = await db
    .from("request_log")
    .select("id", { count: "exact", head: true })
    .eq("fn", fn)
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) {
    console.error("rateLimit", error);
    return true; // ante un fallo del contador, no bloqueamos a clientes reales
  }
  if ((count ?? 0) >= max) return false;
  await db.from("request_log").insert({ fn, ip_hash: ipHash });
  return true;
}

/* Validación sencilla */
export const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, max) : "";
export const isPhone = (v: string) => /^\+?\d[\d\s-]{7,15}$/.test(v);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const toNumber = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Envuelve el handler con CORS, método POST y gestión de errores. */
export function serve(handler: (req: Request, body: Record<string, unknown>) => Promise<Response>) {
  Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
    if (req.method !== "POST") return json(req, { error: "Método no permitido" }, 405);
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json(req, { error: "JSON no válido" }, 400);
    }
    try {
      return await handler(req, body);
    } catch (e) {
      console.error(e);
      return json(req, { error: "Error interno. Inténtalo de nuevo más tarde." }, 500);
    }
  });
}
