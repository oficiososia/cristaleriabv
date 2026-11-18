"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Archive, LoaderCircle, Mail, MailOpen, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  service: string | null;
  message: string;
  status: "new" | "read" | "archived";
};

export function MessagesPanel({ supabase }: { supabase: SupabaseClient }) {
  const [archived, setArchived] = useState(false);
  const key = archived ? "archived" : "inbox";
  const [result, setResult] = useState<{ key: string; rows: Message[] } | null>(null);
  const rows = result?.key === key ? result.rows : null;
  const setRows = (fn: (r: Message[] | null) => Message[] | null) =>
    setResult((prev) => (prev ? { ...prev, rows: fn(prev.rows) ?? [] } : prev));

  useEffect(() => {
    let cancelled = false;
    const q = supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
    (key === "archived" ? q.eq("status", "archived") : q.neq("status", "archived")).then(({ data, error }) => {
      if (cancelled) return;
      if (error) toast.error("Error al cargar los mensajes");
      setResult({ key, rows: (data as Message[]) ?? [] });
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, key]);

  async function setStatus(id: string, status: Message["status"]) {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) return toast.error("No se pudo actualizar");
    // Archivar (o desarchivar desde la vista de archivados) saca el mensaje de la lista actual.
    const leavesView = archived ? status !== "archived" : status === "archived";
    setRows((r) => (leavesView ? r?.filter((m) => m.id !== id) ?? null : r?.map((m) => (m.id === id ? { ...m, status } : m)) ?? null));
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium">Mensajes de contacto</h1>
        <button
          onClick={() => setArchived((a) => !a)}
          className="min-h-10 cursor-pointer rounded-full border border-navy-900/15 bg-cream-50 px-4 text-sm text-navy-900"
        >
          {archived ? "Ver bandeja" : "Ver archivados"}
        </button>
      </div>
      {!rows ? (
        <LoaderCircle className="mx-auto mt-16 size-6 animate-spin text-navy-900" />
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-ink-soft">No hay mensajes.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((m) => (
            <li key={m.id} className={cn("rounded-2xl border bg-cream-50 p-5", m.status === "new" ? "border-navy-900/30" : "border-navy-900/10")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy-900">
                    {m.status === "new" && <span className="mr-2 inline-block size-2 rounded-full bg-gold-400 align-middle" />}
                    {m.name}
                    {m.service && <span className="ml-2 text-sm font-normal text-ink-soft">· {m.service}</span>}
                  </p>
                  <p className="text-xs text-ink-soft">{new Date(m.created_at).toLocaleString("es-ES")}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <a href={`tel:${m.phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-navy-900/15 px-3 text-navy-900">
                    <Phone className="size-4" /> {m.phone}
                  </a>
                  <a href={`mailto:${m.email}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-navy-900/15 px-3 text-navy-900">
                    <Mail className="size-4" /> Responder
                  </a>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-[15px] text-ink">{m.message}</p>
              <div className="mt-3 flex gap-2">
                {m.status !== "archived" && (
                  <button
                    onClick={() => void setStatus(m.id, m.status === "new" ? "read" : "new")}
                    className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm text-navy-900 hover:bg-cream-200/60"
                  >
                    <MailOpen className="size-4" /> {m.status === "new" ? "Marcar como leído" : "Marcar como nuevo"}
                  </button>
                )}
                <button
                  onClick={() => void setStatus(m.id, m.status === "archived" ? "read" : "archived")}
                  className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm text-navy-900 hover:bg-cream-200/60"
                >
                  <Archive className="size-4" /> {m.status === "archived" ? "Desarchivar" : "Archivar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
