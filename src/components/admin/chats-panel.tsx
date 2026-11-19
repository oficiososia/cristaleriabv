"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatSession = { id: string; last_message_at: string; page: string | null; message_count: number };
type ChatMessage = { id: number; role: "user" | "assistant"; content: string; created_at: string };

/** Conversaciones del asistente virtual (solo lectura). */
export function ChatsPanel({ supabase }: { supabase: SupabaseClient }) {
  const [sessions, setSessions] = useState<ChatSession[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<{ id: string; messages: ChatMessage[] } | null>(null);
  const messages = loaded?.id === active ? loaded.messages : null;

  useEffect(() => {
    supabase
      .from("chat_sessions")
      .select("id, last_message_at, page, message_count")
      .order("last_message_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setSessions((data as ChatSession[]) ?? []));
  }, [supabase]);

  useEffect(() => {
    if (!active) return;
    supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_id", active)
      .order("created_at")
      .then(({ data }) => setLoaded({ id: active, messages: (data as ChatMessage[]) ?? [] }));
  }, [supabase, active]);

  return (
    <section>
      <h1 className="text-2xl font-medium">Conversaciones del asistente</h1>
      <p className="mt-1 text-sm text-ink-soft">Sirven para detectar dudas frecuentes y mejorar las respuestas. Se borran a los 12 meses.</p>
      {!sessions ? (
        <LoaderCircle className="mx-auto mt-16 size-6 animate-spin text-navy-900" />
      ) : sessions.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-ink-soft">Aún no hay conversaciones.</p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
          <ul className="max-h-[70dvh] space-y-2 overflow-y-auto">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-xl border p-3 text-left text-sm",
                    active === s.id ? "border-navy-900 bg-navy-900 text-cream-100" : "border-navy-900/10 bg-cream-50 text-navy-900",
                  )}
                >
                  <span className="block font-medium">{new Date(s.last_message_at).toLocaleString("es-ES")}</span>
                  <span className={cn("block text-xs", active === s.id ? "text-cream-100/70" : "text-ink-soft")}>
                    {s.message_count} mensajes · {s.page ?? "/"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="min-h-64 rounded-2xl border border-navy-900/10 bg-cream-50 p-4">
            {!active ? (
              <p className="p-6 text-center text-ink-soft">Elige una conversación.</p>
            ) : !messages ? (
              <LoaderCircle className="mx-auto mt-10 size-6 animate-spin text-navy-900" />
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <p
                      className={cn(
                        "max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[15px]",
                        m.role === "user" ? "bg-navy-900 text-cream-100" : "border border-navy-900/10 bg-white text-ink",
                      )}
                    >
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
