import { optionLabel, visibleFields, type CategoryDef, type Quote, type Values } from "@/lib/pricing/categories";
import type { TravelResult } from "@/components/tools/travel-cost";

export type Delivery = "recogida" | "envio" | "instalacion";

export const deliveryLabels: Record<Delivery, string> = {
  recogida: "Recogida en nuestras instalaciones",
  envio: "Envío a domicilio",
  instalacion: "Instalación completa por nuestro equipo",
};

const eur = (n: number) => `${n.toLocaleString("es-ES", { maximumFractionDigits: 2 })} €`;

/** Líneas «Etiqueta: valor» con las opciones elegidas (solo campos visibles y con valor). */
export function selectedOptions(def: CategoryDef, v: Values) {
  return visibleFields(def, v)
    .map((f) => ({ label: f.label, value: optionLabel(f, v[f.id]) }))
    .filter((x) => x.value && x.value !== "No");
}

/** Mensaje de WhatsApp con la solicitud completa. */
export function buildQuoteMessage(opts: {
  def: CategoryDef;
  values: Values;
  quote: Quote;
  model?: string;
  travel?: TravelResult | null;
  delivery?: Delivery;
  envio?: number;
  montaje?: { min: number; max: number };
}) {
  const { def, values, quote, model, travel, delivery, envio, montaje } = opts;
  const lines: string[] = [`*Nueva solicitud de presupuesto · ${def.name}*`];
  if (model) lines.push(`Modelo: ${model}`);
  lines.push("");
  for (const o of selectedOptions(def, values)) lines.push(`• ${o.label}: ${o.value}`);
  lines.push("");
  if (quote.ready) {
    lines.push(`*Precio orientativo:* ${eur(quote.total)}`);
    if (quote.pending.length) lines.push(`(A valorar en la visita: ${quote.pending.join(", ")})`);
  }
  if (delivery) {
    let d = `*Entrega:* ${deliveryLabels[delivery]}`;
    if (delivery === "envio" && envio) d += ` (${eur(envio)})`;
    if (delivery === "instalacion" && montaje) d += ` (montaje orientativo ${montaje.min}–${montaje.max} €)`;
    lines.push(d);
  }
  if (travel) {
    lines.push(`*Visita técnica:* ${travel.place} · ${travel.free ? "gratuita" : eur(travel.cost)}`);
  }
  lines.push("", "Me gustaría confirmar el presupuesto y concertar la visita técnica.");
  return lines.join("\n");
}
