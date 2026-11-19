// Reserva de visita técnica desde la web. Inserta en public.appointments.
import { adminClient, clean, clientIpHash, isEmail, isPhone, json, rateLimit, serve, toNumber } from "../_shared/http.ts";

function reference() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(5, "0").slice(-5);
  return `VT-${ymd}-${rnd}`;
}

serve(async (req, body) => {
  // Campo trampa: si viene relleno, respondemos OK sin guardar nada.
  if (clean(body.website, 100)) return json(req, { reference: "VT-OK" });
  if (body.consent !== true) return json(req, { error: "Debes aceptar la política de privacidad" }, 400);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  if (name.length < 2) return json(req, { error: "Falta el nombre" }, 400);
  if (!isPhone(phone)) return json(req, { error: "El teléfono no es válido" }, 400);
  if (email && !isEmail(email)) return json(req, { error: "El email no es válido" }, 400);

  const date = clean(body.preferredDate, 10);
  const preferredDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  const slot = ["manana", "tarde"].includes(String(body.preferredSlot)) ? String(body.preferredSlot) : "";
  const quote = body.quote && typeof body.quote === "object" ? (body.quote as Record<string, unknown>) : null;

  const db = adminClient();
  if (!(await rateLimit(db, "book-appointment", await clientIpHash(req), 5, 60))) {
    return json(req, { error: "Has enviado varias solicitudes seguidas. Llámanos al 650 06 63 23." }, 429);
  }

  const ref = reference();
  const { error } = await db.from("appointments").insert({
    reference: ref,
    customer_name: name,
    customer_phone: phone,
    customer_email: email || null,
    service_type: clean(body.service, 120) || null,
    town: clean(body.town, 120) || null,
    customer_address: clean(body.address, 250) || null,
    preferred_date: preferredDate,
    preferred_time: slot,
    distance_km: toNumber(body.distanceKm),
    visit_cost: toNumber(body.visitCost),
    quote_total: quote ? toNumber(quote.total) : null,
    quote_summary: quote ? clean(quote.summary, 3000) : null,
    notes: clean(body.notes, 1000) || null,
  });
  if (error) {
    console.error("appointments insert", error);
    return json(req, { error: "No se pudo guardar la solicitud" }, 500);
  }
  return json(req, { reference: ref });
});
