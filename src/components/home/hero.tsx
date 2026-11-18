import Image from "next/image";
import { ArrowRight, BadgeCheck, Calculator, Gem, MapPin, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { GlassReveal } from "@/components/motion/glass-reveal";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ArrowLink, CtaLink } from "@/components/site/cta";
import { photos } from "@/content/images";
import { site } from "@/content/site";

const trust = [
  { icon: BadgeCheck, label: "Garantía en todos los trabajos" },
  { icon: Gem, label: "Materiales de primera calidad" },
  { icon: MapPin, label: "Servicio en el Baix Vinalopó" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12 lg:pt-16">
      {/* Cuadrícula de fondo (Formis) con desvanecido radial */}
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -right-40 top-10 -z-10 size-[36rem] rounded-full bg-cream-200/70 blur-3xl"
      />

      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-cream-50/80 px-3.5 py-1.5 text-sm text-navy-800 shadow-sm">
              <span className="size-1.5 rounded-full bg-gold-400" />
              Más de {site.yearsExperience} años de experiencia
            </span>
          </Reveal>

          <TextReveal
            as="h1"
            parts={["Especialistas en", { em: "cristalería" }, "y aluminio"]}
            className="mt-6 max-w-[14ch] text-[clamp(2.75rem,6.5vw,5rem)] font-medium leading-[1.02]"
            delay={0.1}
          />

          <Reveal delay={0.35}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Soluciones profesionales en cristalería, mamparas, espejos y cerramientos para el Baix Vinalopó.
              Calidad garantizada y servicio personalizado.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CtaLink href="/presupuesto" icon={<Calculator />}>
              Calcular presupuesto
            </CtaLink>
            <ArrowLink href="/trabajos">Ver trabajos realizados</ArrowLink>
          </Reveal>

          <Reveal delay={0.55}>
            <ul className="mt-10 flex flex-col gap-3 border-t border-navy-900/10 pt-6 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[15px] text-ink">
                  <Icon aria-hidden className="size-[18px] text-gold-600" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={40} className="relative">
          <GlassReveal className="aspect-[4/5] rounded-[28px] shadow-[0_40px_80px_-40px_rgb(6_26_46/0.55)] sm:aspect-[5/5] lg:aspect-[4/5]">
            <Image
              src={photos.hero.src}
              alt={photos.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </GlassReveal>

          {/* Insignia de años (como el "EST 2006" de Formis) */}
          <div className="glass absolute left-4 top-4 z-20 rounded-xl px-3.5 py-2 text-navy-950 sm:left-5 sm:top-5">
            <span className="text-xs font-medium uppercase tracking-[0.14em]">Desde hace</span>
            <span className="ml-2 font-heading text-2xl font-medium">+{site.yearsExperience} años</span>
          </div>

          <p className="glass absolute right-4 top-4 z-20 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-navy-950 sm:right-5 sm:top-5 md:flex">
            <MousePointer2 aria-hidden className="size-3.5" />
            Pasa el cursor: el cristal se aclara
          </p>

          <Link
            href="/presupuesto"
            className="glass-dark group absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl p-4 text-cream-100 sm:inset-x-5 sm:bottom-5 sm:p-5"
          >
            <span>
              <span className="block text-xs uppercase tracking-[0.14em] text-cream-200/80">Presupuesto orientativo</span>
              <span className="mt-1 block font-heading text-lg leading-snug sm:text-xl">
                Elige, mide y conoce tu precio en 2 minutos
              </span>
            </span>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream-200 text-navy-900 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight aria-hidden className="size-5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
