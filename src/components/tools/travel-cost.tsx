"use client";

import { useState } from "react";
import { LocateFixed, LoaderCircle, MapPin } from "lucide-react";
import { Field, NativeSelect, TextInput } from "@/components/forms/fields";
import { NumberTicker } from "@/components/motion/number-ticker";
import { estimateFromCoords, towns, travelCost, TRAVEL_BLOCK_KM, TRAVEL_RATE_EUR } from "@/lib/travel";
import { cn } from "@/lib/utils";

export type TravelResult = { place: string; km: number; free: boolean; cost: number };

const OTHER = "__otra__";

/**
 * Calculadora de desplazamiento: población de una lista (distancias por
 * carretera), geolocalización del navegador o kilómetros a mano.
 */
export function TravelCost({
  value,
  onChange,
  compact,
}: {
  value?: TravelResult | null;
  onChange?: (r: TravelResult | null) => void;
  compact?: boolean;
}) {
  const [town, setTown] = useState<string>(value?.place && towns.some((t) => t.name === value.place) ? value.place : "");
  const [manualKm, setManualKm] = useState<string>("");
  const [geo, setGeo] = useState<{ state: "idle" | "loading" | "error"; message?: string }>({ state: "idle" });
  const [result, setResult] = useState<TravelResult | null>(value ?? null);

  function publish(r: TravelResult | null) {
    setResult(r);
    onChange?.(r);
  }

  function selectTown(name: string) {
    setTown(name);
    if (name === OTHER || !name) {
      publish(null);
      return;
    }
    const t = towns.find((x) => x.name === name)!;
    publish({ place: t.name, km: t.km, free: Boolean(t.free), cost: travelCost(t.km, t.free) });
  }

  function setKm(v: string) {
    setManualKm(v);
    const km = Number(v.replace(",", "."));
    if (!Number.isFinite(km) || km <= 0) return publish(null);
    publish({ place: `Otra ubicación (${km} km)`, km, free: false, cost: travelCost(km) });
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setGeo({ state: "error", message: "Tu navegador no permite la geolocalización." });
      return;
    }
    setGeo({ state: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { km, free } = estimateFromCoords(pos.coords.latitude, pos.coords.longitude);
        setTown(OTHER);
        setManualKm(String(km));
        publish({ place: `Mi ubicación (≈${km} km)`, km, free, cost: travelCost(km, free) });
        setGeo({ state: "idle" });
      },
      () => setGeo({ state: "error", message: "No hemos podido obtener tu ubicación. Elige tu población de la lista." }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <p className="text-[15px] leading-relaxed text-ink-soft">
        La visita técnica es <strong className="font-medium text-navy-900">gratuita en Crevillente</strong>. Fuera, el
        desplazamiento se calcula a razón de {TRAVEL_RATE_EUR} € por cada {TRAVEL_BLOCK_KM} km (o fracción) desde
        nuestras instalaciones.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Población">
          {(p) => (
            <NativeSelect
              {...p}
              value={town}
              onChange={(e) => selectTown(e.target.value)}
              placeholder="Elige tu población"
              options={[...towns.map((t) => ({ value: t.name, label: t.name })), { value: OTHER, label: "Otra ubicación…" }]}
            />
          )}
        </Field>
        <button
          type="button"
          onClick={locate}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy-900/15 bg-cream-50 px-4 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900/35"
        >
          {geo.state === "loading" ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <LocateFixed aria-hidden className="size-4" />
          )}
          Usar mi ubicación
        </button>
      </div>

      {geo.state === "error" && (
        <p role="alert" className="text-[13px] text-destructive">
          {geo.message}
        </p>
      )}

      {town === OTHER && (
        <Field label="Distancia aproximada (km por carretera)" hint="Si no sabes la distancia exacta, pon una aproximación.">
          {(p) => (
            <TextInput
              {...p}
              inputMode="decimal"
              value={manualKm}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Ej.: 25"
            />
          )}
        </Field>
      )}

      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors",
          result ? "border-navy-900/15 bg-navy-900 text-cream-100" : "border-dashed border-navy-900/20 bg-cream-50 text-ink-soft",
        )}
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <MapPin aria-hidden className={cn("size-5", result ? "text-cream-200" : "text-ink-soft")} />
          <div>
            <p className="text-sm">{result ? result.place : "Elige una población para ver el coste"}</p>
            {result && !result.free && (
              <p className="text-xs text-cream-100/70">
                ≈ {result.km.toLocaleString("es-ES")} km · {Math.ceil(result.km / TRAVEL_BLOCK_KM)} × {TRAVEL_RATE_EUR} €
              </p>
            )}
          </div>
        </div>
        {result && (
          <p className="font-heading text-3xl font-medium text-cream-200">
            {result.free ? "Gratis" : <><NumberTicker value={result.cost} live />&nbsp;€</>}
          </p>
        )}
      </div>
    </div>
  );
}
