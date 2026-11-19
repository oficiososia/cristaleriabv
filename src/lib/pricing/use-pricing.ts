"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing/config";
import { isBackendConfigured, publicHeaders, supabaseUrl } from "@/lib/backend";

/** Mezcla superficial por categoría: lo que falte en Supabase se toma de los valores por defecto. */
export function mergePricing(remote: Partial<PricingConfig> | null | undefined): PricingConfig {
  if (!remote) return DEFAULT_PRICING;
  const out = { ...DEFAULT_PRICING } as Record<string, unknown>;
  for (const [k, v] of Object.entries(remote)) {
    const def = (DEFAULT_PRICING as Record<string, unknown>)[k];
    out[k] = def && typeof def === "object" && v && typeof v === "object" ? { ...def, ...v } : v;
  }
  return out as PricingConfig;
}

/** Tarifas vigentes: las de Supabase (tabla `pricing`) si existe; si no, las de config.ts. */
export function usePricing() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);

  useEffect(() => {
    if (!isBackendConfigured) return;
    const ctrl = new AbortController();
    fetch(`${supabaseUrl}/rest/v1/pricing?select=config&id=eq.1`, {
      headers: publicHeaders(),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((rows: { config: Partial<PricingConfig> }[] | null) => {
        if (rows?.[0]?.config) setConfig(mergePricing(rows[0].config));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return config;
}
