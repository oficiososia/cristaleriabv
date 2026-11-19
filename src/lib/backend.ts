/**
 * Acceso a las edge functions de Supabase desde el navegador.
 * Si las variables de entorno no están configuradas (p. ej. en local antes de
 * crear el proyecto de Supabase), `isBackendConfigured` es false y cada
 * formulario usa su alternativa (WhatsApp o respuestas locales).
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isBackendConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Cabeceras para llamar a Supabase con la clave pública. Las claves nuevas
 * (`sb_publishable_…`) van solo en `apikey`; si se envían también como Bearer,
 * la plataforma intenta leerlas como JWT y rechaza la petición. Las claves
 * antiguas (`anon`, que son JWT y empiezan por "eyJ") sí admiten Bearer.
 */
export function publicHeaders(): Record<string, string> {
  const h: Record<string, string> = { apikey: supabaseKey };
  if (supabaseKey.startsWith("eyJ")) h.Authorization = `Bearer ${supabaseKey}`;
  return h;
}

export class BackendError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

/** Llama a una edge function y devuelve su JSON. Lanza BackendError si falla. */
export async function callFunction<T>(name: string, body: unknown, signal?: AbortSignal): Promise<T> {
  if (!isBackendConfigured) throw new BackendError("Backend no configurado");
  const res = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...publicHeaders() },
    body: JSON.stringify(body),
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackendError((data as { error?: string }).error ?? "No se pudo completar la solicitud", res.status);
  }
  return data as T;
}
