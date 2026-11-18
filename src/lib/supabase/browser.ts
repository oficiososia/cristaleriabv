"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isBackendConfigured, supabaseKey, supabaseUrl } from "@/lib/backend";

let client: SupabaseClient | null = null;

/** Cliente de Supabase para el navegador (sesión del panel /admin). Null si no está configurado. */
export function getSupabase(): SupabaseClient | null {
  if (!isBackendConfigured) return null;
  client ??= createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
