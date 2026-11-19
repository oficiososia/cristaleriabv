// Asistente virtual: responde con OpenAI usando el conocimiento de la web
// y guarda la conversación en chat_sessions / chat_messages.
//
// Secretos necesarios: OPENAI_API_KEY. Opcionales: OPENAI_MODEL, ALLOWED_ORIGINS, RATE_LIMIT_SALT.
import { adminClient, clean, clientIpHash, json, rateLimit, serve } from "../_shared/http.ts";
import { KNOWLEDGE } from "../_shared/knowledge.ts";

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Msg = { role: "user" | "assistant"; content: string };

serve(async (req, body) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return json(req, { error: "Asistente no configurado" }, 503);

  const sessionId = typeof body.sessionId === "string" && UUID.test(body.sessionId) ? body.sessionId : null;
  const page = clean(body.page, 200);
  const history: Msg[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m): m is Msg => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: clean(m.content, 1200) }))
    .filter((m) => m.content);

  const last = history.at(-1);
  if (!last || last.role !== "user") return json(req, { error: "Falta la pregunta" }, 400);
  if (last.content.length > 600) return json(req, { error: "La pregunta es demasiado larga" }, 400);

  const db = adminClient();
  const ip = await clientIpHash(req);
  if (!(await rateLimit(db, "chat", ip, 30, 10))) {
    return json(req, { reply: "Has enviado muchas preguntas seguidas. Espera unos minutos o escríbenos por WhatsApp al 650 06 63 23." });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: "system", content: KNOWLEDGE }, ...history],
    }),
  });
  if (!res.ok) {
    console.error("OpenAI", res.status, await res.text());
    return json(req, { error: "El asistente no está disponible ahora mismo" }, 502);
  }
  const data = await res.json();
  const reply: string = (data.choices?.[0]?.message?.content ?? "").trim() ||
    "No he podido generar una respuesta. ¿Puedes reformular la pregunta?";

  // Registro de la conversación (no bloquea la respuesta si falla).
  if (sessionId) {
    try {
      const { data: s } = await db.from("chat_sessions").select("message_count").eq("id", sessionId).maybeSingle();
      await db.from("chat_sessions").upsert({
        id: sessionId,
        page,
        last_message_at: new Date().toISOString(),
        message_count: (s?.message_count ?? 0) + 2,
      });
      await db.from("chat_messages").insert([
        { session_id: sessionId, role: "user", content: last.content },
        { session_id: sessionId, role: "assistant", content: reply },
      ]);
    } catch (e) {
      console.error("chat log", e);
    }
  }

  return json(req, { reply });
});
