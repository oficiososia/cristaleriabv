"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { Bot, CalendarCheck, Euro, LoaderCircle, LogOut, Mail, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Field, TextInput } from "@/components/forms/fields";
import { getSupabase } from "@/lib/supabase/browser";
import { AppointmentsPanel } from "@/components/admin/appointments-panel";
import { MessagesPanel } from "@/components/admin/messages-panel";
import { PricingEditor } from "@/components/admin/pricing-editor";
import { ChatsPanel } from "@/components/admin/chats-panel";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "citas", label: "Citas", icon: CalendarCheck },
  { id: "mensajes", label: "Mensajes", icon: Mail },
  { id: "precios", label: "Precios", icon: Euro },
  { id: "asistente", label: "Asistente", icon: Bot },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function AdminApp() {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  // Resultado de la comprobación de admin, asociado al usuario que se comprobó.
  const [adminCheck, setAdminCheck] = useState<{ userId: string; ok: boolean } | null>(null);
  const [tab, setTab] = useState<Tab>("citas");
  const isAdmin = session && adminCheck?.userId === session.user.id ? adminCheck.ok : null;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const userId = session?.user.id;
  useEffect(() => {
    if (!supabase || !userId) return;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setAdminCheck({ userId, ok: Boolean(data) }));
  }, [supabase, userId]);

  if (!supabase) return <NotConfigured />;
  if (!ready) return <Centered><LoaderCircle className="size-6 animate-spin text-navy-900" /></Centered>;
  if (!session) return <Login />;
  if (isAdmin === null) return <Centered><LoaderCircle className="size-6 animate-spin text-navy-900" /></Centered>;
  if (!isAdmin)
    return (
      <Centered>
        <div className="max-w-md rounded-3xl border border-navy-900/10 bg-cream-50 p-8 text-center">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 text-2xl font-medium">Sin permisos de administración</h1>
          <p className="mt-2 text-ink-soft">
            La cuenta {session.user.email} no tiene acceso al panel. Pide a un administrador que te añada.
          </p>
          <button onClick={() => supabase.auth.signOut()} className="mt-6 min-h-11 cursor-pointer rounded-xl bg-navy-900 px-5 font-medium text-cream-100">
            Cerrar sesión
          </button>
        </div>
      </Centered>
    );

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-navy-900/10 bg-cream-50/90 [backdrop-filter:blur(14px)]">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo className="h-10" />
            <span className="hidden rounded-md bg-navy-900 px-2 py-0.5 text-xs font-medium text-cream-200 sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-soft md:inline">{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-navy-900/15 px-3 font-medium text-navy-900 hover:border-navy-900/40"
            >
              <LogOut className="size-4" /> Salir
            </button>
          </div>
        </div>
        <nav className="container-site flex gap-1 overflow-x-auto pb-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors",
                tab === t.id ? "bg-navy-900 text-cream-100" : "text-navy-900 hover:bg-cream-200/60",
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="container-site py-8">
        {tab === "citas" && <AppointmentsPanel supabase={supabase} />}
        {tab === "mensajes" && <MessagesPanel supabase={supabase} />}
        {tab === "precios" && <PricingEditor supabase={supabase} />}
        {tab === "asistente" && <ChatsPanel supabase={supabase} />}
      </main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh place-items-center p-4">{children}</div>;
}

function NotConfigured() {
  return (
    <Centered>
      <div className="max-w-lg rounded-3xl border border-navy-900/10 bg-cream-50 p-8">
        <Logo className="h-12" />
        <h1 className="mt-6 text-2xl font-medium">Panel pendiente de configurar</h1>
        <p className="mt-3 text-ink-soft">
          El panel necesita el proyecto de Supabase. Añade <code className="rounded bg-cream-200 px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code className="rounded bg-cream-200 px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> a las variables de entorno y
          aplica la migración de <code className="rounded bg-cream-200 px-1">supabase/migrations</code> (ver supabase/README.md).
        </p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-medium text-navy-900 underline underline-offset-4">
          Volver a la web
        </Link>
      </div>
    </Centered>
  );
}

function Login() {
  const supabase = getSupabase()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) setError(error.message.includes("Invalid") ? "Email o contraseña incorrectos" : "No se pudo iniciar sesión");
  }

  async function reset() {
    if (!email.trim()) return setError("Escribe tu email para recibir el enlace");
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    setResetSent(true);
  }

  return (
    <Centered>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl border border-navy-900/10 bg-cream-50 p-8 shadow-[0_30px_60px_-40px_rgb(6_26_46/0.5)]">
        <Logo className="h-12" />
        <div>
          <h1 className="text-2xl font-medium">Administración</h1>
          <p className="text-sm text-ink-soft">Accede con tu cuenta de empleado.</p>
        </div>
        <Field label="Email">
          {(p) => <TextInput {...p} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />}
        </Field>
        <Field label="Contraseña" error={error}>
          {(p) => <TextInput {...p} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />}
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-navy-900 font-medium text-cream-100 disabled:opacity-60"
        >
          {loading && <LoaderCircle className="size-4 animate-spin" />} Entrar
        </button>
        <button type="button" onClick={reset} className="w-full cursor-pointer text-sm text-navy-900 underline underline-offset-4">
          {resetSent ? "Te hemos enviado un enlace por email" : "He olvidado mi contraseña"}
        </button>
      </form>
    </Centered>
  );
}
