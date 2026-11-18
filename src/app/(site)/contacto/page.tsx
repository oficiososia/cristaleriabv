import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactBooking } from "@/components/contact/contact-booking";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { fullAddress, site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto y visita técnica",
  description: `Contacta con ${site.name}: ${site.phones[0].display}, ${site.email}. ${fullAddress}. Reserva tu visita técnica online.`,
  alternates: { canonical: "/contacto" },
};

const { lat, lon } = site.address;
const bbox = [lon - 0.008, lat - 0.004, lon + 0.008, lat + 0.004].join(",");

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title={["Estamos aquí para", { em: "ayudarte" }]}
        intro="Llámanos, escríbenos o reserva directamente la visita técnica. Te respondemos en horario de oficina."
        crumbs={[{ href: "/contacto", label: "Contacto" }]}
      />

      <section className="pb-16">
        <div className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="group rounded-2xl border border-navy-900/10 bg-cream-50 p-5 transition-colors hover:border-navy-900/30">
              <Phone aria-hidden className="size-5 text-gold-600" />
              <p className="mt-3 text-sm text-ink-soft">{p.label}</p>
              <p className="font-heading text-xl font-medium text-navy-900">{p.display}</p>
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="rounded-2xl border border-navy-900/10 bg-cream-50 p-5 transition-colors hover:border-navy-900/30">
            <Mail aria-hidden className="size-5 text-gold-600" />
            <p className="mt-3 text-sm text-ink-soft">Email</p>
            <p className="break-all font-medium text-navy-900">{site.email}</p>
          </a>
          <a
            href={whatsappLink("Hola, quería hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-whatsapp/30 bg-whatsapp/5 p-5 transition-colors hover:border-whatsapp/60"
          >
            <MessageCircle aria-hidden className="size-5 text-whatsapp" />
            <p className="mt-3 text-sm text-ink-soft">WhatsApp</p>
            <p className="font-heading text-xl font-medium text-navy-900">{site.phones[0].display}</p>
          </a>
        </div>
      </section>

      <section id="reservar" className="scroll-mt-24 pb-20 sm:pb-24">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="eyebrow">Visita técnica</span>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-medium leading-tight">Reserva la toma de medidas</h2>
              <p className="mt-4 text-lg text-ink-soft">
                Gratis en Crevillente. Fuera, 10 € por cada 10 km de desplazamiento desde nuestras instalaciones. Te llamamos
                para confirmar el día y la hora.
              </p>
            </Reveal>
            <div className="mt-8 space-y-4 text-[15px]">
              <p className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-600" />
                <span>
                  <strong className="block font-medium text-navy-900">Dirección</strong>
                  {fullAddress}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-600" />
                <span>
                  <strong className="block font-medium text-navy-900">Horario</strong>
                  {site.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-navy-900/10">
              <iframe
                title={`Mapa: ${fullAddress}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
                className="h-72 w-full"
                loading="lazy"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-cream-50 px-4 py-3 text-sm font-medium text-navy-900 underline-offset-4 hover:underline"
              >
                Cómo llegar (Google Maps)
              </a>
            </div>
          </div>
          <ContactBooking />
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-site">
          <div className="grid gap-10 rounded-[28px] bg-navy-900 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow text-gold-300">Escríbenos</span>
              <h2 className="mt-3 text-[clamp(2rem,3.6vw,2.75rem)] font-medium leading-tight text-cream-100">Envíanos un mensaje</h2>
              <p className="mt-3 text-cream-100/70">Para dudas, encargos especiales o cualquier consulta.</p>
            </div>
            <ContactForm dark />
          </div>
        </div>
      </section>
    </>
  );
}
