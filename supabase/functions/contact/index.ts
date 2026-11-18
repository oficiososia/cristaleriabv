// Formulario de contacto. Inserta en public.contact_messages.
import { adminClient, clean, clientIpHash, isEmail, isPhone, json, rateLimit, serve } from "../_shared/http.ts";

serve(async (req, body) => {
  if (clean(body.website, 100)) return json(req, { ok: true });
  if (body.consent !== true) return json(req, { error: "Debes aceptar la política de privacidad" }, 400);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  const message = clean(body.message, 1500);
  if (name.length < 2) return json(req, { error: "Falta el nombre" }, 400);
  if (!isPhone(phone)) return json(req, { error: "El teléfono no es válido" }, 400);
  if (!isEmail(email)) return json(req, { error: "El email no es válido" }, 400);
  if (message.length < 10) return json(req, { error: "El mensaje es demasiado corto" }, 400);

  const db = adminClient();
  if (!(await rateLimit(db, "contact", await clientIpHash(req), 5, 60))) {
    return json(req, { error: "Has enviado varios mensajes seguidos. Llámanos al 650 06 63 23." }, 429);
  }

  const { error } = await db.from("contact_messages").insert({
    name,
    phone,
    email,
    service: clean(body.service, 120) || null,
    message,
  });
  if (error) {
    console.error("contact insert", error);
    return json(req, { error: "No se pudo enviar el mensaje" }, 500);
  }
  return json(req, { ok: true });
});
