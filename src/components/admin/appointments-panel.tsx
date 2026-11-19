"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ChevronDown, LoaderCircle, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  reference: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_type: string | null;
  town: string | null;
  customer_address: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  distance_km: number | null;
  visit_cost: number | null;
  quote_total: number | null;
  quote_summary: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

export const STATUS: Record<Appointment["status"], { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-900" },
  confirmed: { label: "Confirmada", cls: "bg-emerald-100 text-emerald-900" },
  completed: { label: "Completada", cls: "bg-sky-100 text-sky-900" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-900" },
};
const slot = { manana: "Mañana", tarde: "Tarde", "": "Indiferente" } as Record<string, string>;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

export function AppointmentsPanel({ supabase }: { supabase: SupabaseClient }) {
  const [filter, setFilter] = useState<Appointment["status"] | "all">("pending");
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  // Cada resultado se guarda con la clave (filtro + recarga) que lo pidió.
  const key = `${filter}:${reload}`;
  const [result, setResult] = useState<{ key: string; rows: Appointment[] } | null>(null);
  const rows = result?.key === key ? result.rows : null;

  useEffect(() => {
    let cancelled = false;
    let q = supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    q.then(({ data, error }) => {
      if (cancelled) return;
      if (error) toast.error("Error al cargar las citas");
      setResult({ key, rows: (data as Appointment[]) ?? [] });
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, filter, key]);

  async function setStatus(id: string, status: Appointment["status"]) {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error("No se pudo actualizar el estado");
    toast.success("Estado actualizado");
    setResult((r) =>
      r && {
        ...r,
        rows: filter === "all" ? r.rows.map((x) => (x.id === id ? { ...x, status } : x)) : r.rows.filter((x) => x.id !== id),
      },
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium">Citas de visita técnica</h1>
        <div className="flex flex-wrap items-center gap-2">
          {(["pending", "confirmed", "completed", "cancelled", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "min-h-10 cursor-pointer rounded-full border px-3.5 text-sm",
                filter === s ? "border-navy-900 bg-navy-900 text-cream-100" : "border-navy-900/15 bg-cream-50 text-navy-900",
              )}
            >
              {s === "all" ? "Todas" : STATUS[s].label}
            </button>
          ))}
          <button onClick={() => setReload((n) => n + 1)} aria-label="Recargar" className="grid size-10 cursor-pointer place-items-center rounded-full border border-navy-900/15 bg-cream-50">
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      {!rows ? (
        <LoaderCircle className="mx-auto mt-16 size-6 animate-spin text-navy-900" />
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-ink-soft">No hay citas en este estado.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((a) => (
            <li key={a.id} className="rounded-2xl border border-navy-900/10 bg-cream-50">
              <div className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-navy-900">
                    {a.customer_name} <span className="ml-2 text-xs font-normal text-ink-soft">{a.reference}</span>
                  </p>
                  <p className="text-sm text-ink-soft">
                    {a.service_type ?? "Servicio sin indicar"} · {a.town ?? "Sin población"}
                    {a.preferred_date && ` · ${fmtDate(a.preferred_date)} (${slot[a.preferred_time ?? ""]})`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <a href={`tel:${a.customer_phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-navy-900/15 px-3 text-navy-900">
                    <Phone className="size-4" /> {a.customer_phone}
                  </a>
                  {a.customer_email && (
                    <a href={`mailto:${a.customer_email}`} aria-label={`Email a ${a.customer_email}`} className="grid size-10 place-items-center rounded-lg border border-navy-900/15 text-navy-900">
                      <Mail className="size-4" />
                    </a>
                  )}
                </div>
                <label className="sr-only" htmlFor={`st-${a.id}`}>Estado</label>
                <select
                  id={`st-${a.id}`}
                  value={a.status}
                  onChange={(e) => void setStatus(a.id, e.target.value as Appointment["status"])}
                  className={cn("h-10 cursor-pointer rounded-lg border-0 px-3 text-sm font-medium", STATUS[a.status].cls)}
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setOpen(open === a.id ? null : a.id)}
                  aria-expanded={open === a.id}
                  aria-label="Ver detalle"
                  className="grid size-10 cursor-pointer place-items-center rounded-lg hover:bg-cream-200/60"
                >
                  <ChevronDown className={cn("size-4 transition-transform", open === a.id && "rotate-180")} />
                </button>
              </div>
              {open === a.id && (
                <div className="grid gap-4 border-t border-navy-900/10 p-4 text-sm sm:grid-cols-2">
                  <dl className="space-y-1.5">
                    <Row k="Recibida" v={new Date(a.created_at).toLocaleString("es-ES")} />
                    <Row k="Dirección" v={a.customer_address} />
                    <Row k="Distancia" v={a.distance_km != null ? `${a.distance_km} km` : null} />
                    <Row k="Coste visita" v={a.visit_cost != null ? (a.visit_cost === 0 ? "Gratis" : `${a.visit_cost} €`) : null} />
                    <Row k="Presupuesto" v={a.quote_total != null ? `${a.quote_total} €` : null} />
                    <Row k="Comentarios" v={a.notes} />
                  </dl>
                  {a.quote_summary && <pre className="whitespace-pre-wrap rounded-xl bg-white p-3 font-sans text-[13px] text-ink">{a.quote_summary}</pre>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-ink-soft">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}
