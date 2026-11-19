"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { LoaderCircle, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing/config";
import { mergePricing } from "@/lib/pricing/use-pricing";

/** Nombres legibles de las claves de la configuración. */
const LABELS: Record<string, string> = {
  priceNote: "Nota que acompaña al precio",
  mamparas: "Mamparas a medida",
  domino: "Dominó",
  espejos: "Espejos",
  cerramientos: "Cerramientos",
  aluminio: "Aluminio",
  barandillas: "Barandillas",
  armarios: "Armarios (precios de venta)",
  otros: "Cristal a medida (otros)",
  entrega: "Entrega y montaje",
  base: "Precio base (€)",
  perCmWidth: "€ por cm de ancho",
  tallOverCm: "Altura a partir de la cual hay suplemento (cm)",
  tallSurcharge: "Suplemento por altura (€)",
  cristal: "Suplemento por cristal (€)",
  extraclaro: "Extraclaro (€)",
  perfileria: "Suplemento por perfilería (€)",
  acabadoPerfil: "Suplemento por acabado del perfil (€)",
  acabadoCristal: "Acabados del cristal (€; 0 = se valora en visita)",
  basePerM2: "Precio base por m² (€)",
  factors: "Multiplicadores (1 = sin recargo)",
  extras: "Extras (€ por unidad; 0 = se valora en visita)",
  hardware: "Herrajes (€)",
  envio: "Envío a domicilio (€)",
  montajeMin: "Montaje orientativo mínimo (€)",
  montajeMax: "Montaje orientativo máximo (€)",
  casacaMl: "Barra casaca (€/m)",
  tubo4040Ml: "Tubo 40×40 (€/m)",
  tubo6040Ml: "Tubo 60×40 (€/m)",
  guiaSuperiorMl: "Guía superior (€/m)",
  guiaInferiorMl: "Guía inferior (€/m)",
  tapeta: "Tapeta (€/ud.)",
  rueda: "Rueda (€/ud.)",
  tirador: "Tirador (€/ud.)",
  cristalM2: "Cristal (€/m²)",
  maderaM2: "Madera de la leja (€/m²)",
  acabadoM2: "Acabado del cristal (€/m²)",
  varillaMl: "Varillería (€/m)",
  taladro: "Taladro / encaje (€/ud.)",
};
const label = (k: string) => LABELS[k] ?? k.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function setIn(obj: Json, path: string[], value: Json): Json {
  if (!path.length) return value;
  const [h, ...rest] = path;
  const o = (obj ?? {}) as Record<string, Json>;
  return { ...o, [h]: setIn(o[h], rest, value) };
}

function Editor({ value, path, onChange, depth = 0 }: { value: Json; path: string[]; onChange: (p: string[], v: Json) => void; depth?: number }) {
  if (typeof value === "number") {
    return (
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(path, e.target.value === "" ? 0 : Number(e.target.value))}
        aria-label={path.map(label).join(" › ")}
        className="h-10 w-28 rounded-lg border border-input bg-white px-2.5 text-right text-sm tabular-nums outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15"
      />
    );
  }
  if (typeof value === "string") {
    return (
      <input
        value={value}
        onChange={(e) => onChange(path, e.target.value)}
        aria-label={path.map(label).join(" › ")}
        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-navy-700"
      />
    );
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return <span className="text-sm text-ink-soft">—</span>;
    return (
      <div className={depth > 0 ? "space-y-2" : "space-y-3"}>
        {entries.map(([k, v]) =>
          typeof v === "object" && v !== null ? (
            <fieldset key={k} className="rounded-xl border border-navy-900/10 p-3">
              <legend className="px-1 text-sm font-medium text-navy-900">{label(k)}</legend>
              <Editor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} />
            </fieldset>
          ) : (
            <div key={k} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink">{label(k)}</span>
              <Editor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} />
            </div>
          ),
        )}
      </div>
    );
  }
  return null;
}

export function PricingEditor({ supabase }: { supabase: SupabaseClient }) {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    supabase
      .from("pricing")
      .select("config")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setConfig(mergePricing(data?.config)));
  }, [supabase]);

  function change(path: string[], v: Json) {
    setConfig((c) => setIn(c as unknown as Json, path, v) as unknown as PricingConfig);
    setDirty(true);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    const { error } = await supabase.from("pricing").upsert({ id: 1, config });
    setSaving(false);
    if (error) return toast.error("No se pudieron guardar los precios", { description: error.message });
    setDirty(false);
    toast.success("Precios guardados", { description: "La calculadora ya usa las nuevas tarifas." });
  }

  if (!config) return <LoaderCircle className="mx-auto mt-16 size-6 animate-spin text-navy-900" />;

  const editable = Object.fromEntries(Object.entries(config).filter(([k]) => k !== "version"));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Tarifas de la calculadora</h1>
          <p className="text-sm text-ink-soft">Los cambios se aplican al momento en la web. Nunca pongas aquí precios de compra ni márgenes: esta tabla es pública.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setConfig(DEFAULT_PRICING);
              setDirty(true);
            }}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-navy-900/15 bg-cream-50 px-4 text-sm font-medium text-navy-900"
          >
            <RotateCcw className="size-4" /> Valores iniciales
          </button>
          <button
            onClick={() => void save()}
            disabled={!dirty || saving}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-medium text-cream-100 disabled:opacity-50"
          >
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Guardar
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {Object.entries(editable).map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-navy-900/10 bg-cream-50 p-5">
            <h2 className="mb-4 font-heading text-lg font-medium">{label(k)}</h2>
            <Editor value={v as Json} path={[k]} onChange={change} />
          </div>
        ))}
      </div>
    </section>
  );
}
