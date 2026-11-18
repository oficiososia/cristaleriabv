import Image from "next/image";
import { BadgeCheck, CalendarClock, MapPinned, ReceiptText, ShieldCheck, Wrench } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { photos, servicePhotos } from "@/content/images";

/** Garantías y compromisos (sección oscura con tarjetas numeradas, como «Credentials» de Formis). */
const items = [
  {
    icon: ReceiptText,
    title: "Presupuestos transparentes",
    text: "Sin sorpresas: el presupuesto detallado incluye materiales, fabricación, transporte e instalación.",
    badge: "Precio claro desde el primer día",
    photo: photos.process[0],
  },
  {
    icon: MapPinned,
    title: "Visita gratis en Crevillente",
    text: "Asesoramiento y toma de medidas sin coste en Crevillente. Fuera, solo 10 € por cada 10 km de desplazamiento.",
    badge: "Servicio local · Baix Vinalopó",
    photo: photos.process[1],
  },
  {
    icon: ShieldCheck,
    title: "Garantía en todos los trabajos",
    text: "Generalmente 2 años en instalaciones y 5 años en defectos de fabricación. Te lo detallamos en cada presupuesto.",
    badge: "Tranquilidad por escrito",
    photo: servicePhotos.mamparas.cover,
  },
  {
    icon: CalendarClock,
    title: "Plazos de entrega cumplidos",
    text: "Entre 7 y 15 días laborables desde la toma de medidas en la mayoría de trabajos. Pre-montaje en taller incluido.",
    badge: "Fabricación en taller propio",
    photo: photos.process[2],
  },
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-4 text-cream-100 sm:pb-28">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-gold-300">Por qué elegirnos</span>
          <TextReveal
            parts={["La prueba está en", { em: "los detalles." }]}
            className="mt-4 text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.06] text-cream-100 [&_em]:text-gold-300 [&_span]:text-cream-100"
          />
        </div>

        <RevealGroup className="mt-14 space-y-5" stagger={0.1}>
          {items.map((item, i) => (
            <RevealItem key={item.title}>
              <article className="grid overflow-hidden rounded-[22px] border border-gold-400/50 bg-navy-900 md:grid-cols-[1.1fr_1fr]">
                <div className="relative min-h-56 md:min-h-72">
                  <Image src={item.photo.src} alt={item.photo.alt} fill sizes="(min-width: 768px) 600px, 100vw" className="object-cover" />
                  <span className="absolute left-4 top-3 font-heading text-6xl font-medium text-white/85 drop-shadow-[0_2px_10px_rgb(0_0_0/0.35)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9">
                  <item.icon aria-hidden className="size-6 text-gold-300" />
                  <h3 className="mt-4 border-b border-cream-200/15 pb-4 font-heading text-2xl font-medium text-cream-100 sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-cream-100/75">{item.text}</p>
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md border border-gold-400/40 bg-gold-400/10 px-2.5 py-1 text-xs font-medium text-gold-300">
                    <BadgeCheck aria-hidden className="size-3.5" />
                    {item.badge}
                  </span>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-cream-100/60">
          <Wrench aria-hidden className="size-4" />
          Más de 30 años de experiencia · Materiales de primera calidad · Equipo propio
        </p>
      </div>
    </section>
  );
}
