/**
 * Datos del negocio. Única fuente de verdad para teléfonos, dirección y textos
 * corporativos: cualquier cambio aquí se refleja en toda la web.
 */
export const site = {
  name: "Cristalería Baix Vinalopó",
  shortName: "Cristalería BV",
  tagline: "Especialistas en cristalería y aluminio",
  description:
    "Especialistas en cristalería, mamparas, espejos, cerramientos y aluminio en el Baix Vinalopó. Más de 30 años de experiencia. Calcula tu presupuesto orientativo online.",
  yearsExperience: 30,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  phones: [
    { label: "Oficina", display: "650 06 63 23", tel: "+34650066323" },
    { label: "Jose Antonio", display: "649 99 40 07", tel: "+34649994007" },
  ],
  /** Número que recibe las solicitudes por WhatsApp (formato internacional sin +). */
  whatsapp: "34650066323",
  email: "info@cristaleriabaixvinalopo.es",

  address: {
    street: "C/ Pío XII, 5",
    postalCode: "03330",
    city: "Crevillente",
    province: "Alicante",
    country: "España",
    /** Carrer Pío XII, Crevillent (OpenStreetMap). Origen del cálculo de desplazamiento. */
    lat: 38.24504,
    lon: -0.80694,
  },

  hours: [
    { days: "Lunes a viernes", time: "9:00 – 13:30 y 16:00 – 19:30" },
    { days: "Sábados y domingos", time: "Cerrado" },
  ],

  serviceArea:
    "Baix Vinalopó: Crevillente, Elche, Santa Pola y alrededores. También trabajamos en otras zonas de la provincia de Alicante.",
} as const;

export const mainNav = [
  { href: "/servicios", label: "Servicios" },
  { href: "/presupuesto", label: "Presupuesto" },
  { href: "/trabajos", label: "Trabajos" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city} (${site.address.province})`;

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
