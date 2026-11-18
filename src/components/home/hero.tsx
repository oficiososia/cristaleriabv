import { BadgeCheck, Calculator, Gem, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ArrowLink, CtaLink } from "@/components/site/cta";
import { GlazingHouse } from "@/components/home/glazing-house";
import { site } from "@/content/site";

const trust = [
  { icon: BadgeCheck, label: "Garantía en todos los trabajos" },
  { icon: Gem, label: "Materiales de primera calidad" },
  { icon: MapPin, label: "Servicio en el Baix Vinalopó" },
];

/**
 * Hero: texto + casa que se acristala.
 * - Móvil: una columna, ilustración cuadrada debajo del texto, CTA a todo el ancho.
 * - Tablet: una columna, ilustración 16:11.
 * - Escritorio (≥1024px): dos columnas, ilustración cuadrada.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-14">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,black,transparent)]"
      />
      <div aria-hidden className="absolute -right-24 top-24 -z-10 size-[22rem] rounded-full bg-cream-200/70 blur-3xl sm:size-[34rem]" />

      <div className="container-site grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        <div className="max-w-2xl lg:max-w-none">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-cream-50/80 px-3.5 py-1.5 text-[13px] text-navy-800 shadow-sm sm:text-sm">
              <span className="size-1.5 rounded-full bg-gold-400" />
              Más de {site.yearsExperience} años de experiencia
            </span>
          </Reveal>

          <TextReveal
            as="h1"
            parts={["Especialistas en", { em: "cristalería" }, "y aluminio"]}
            className="mt-5 max-w-[14ch] text-[clamp(2.35rem,10.5vw,3.4rem)] font-medium leading-[1.03] sm:mt-6 sm:text-[clamp(3.2rem,8vw,4.4rem)] lg:text-[clamp(3.4rem,5.2vw,5rem)]"
            delay={0.1}
          />

          <Reveal delay={0.35}>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
              Soluciones profesionales en cristalería, mamparas, espejos y cerramientos para el Baix Vinalopó. Calidad
              garantizada y servicio personalizado.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
            <CtaLink href="/presupuesto" icon={<Calculator />} className="w-full sm:w-auto">
              Calcular presupuesto
            </CtaLink>
            <ArrowLink href="/trabajos" className="justify-center sm:justify-start">
              Ver trabajos realizados
            </ArrowLink>
          </Reveal>

          <Reveal delay={0.55}>
            <ul className="mt-8 grid gap-3 border-t border-navy-900/10 pt-6 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-7">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[15px] text-ink">
                  <Icon aria-hidden className="size-[18px] shrink-0 text-gold-600" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={40} className="relative">
          <GlazingHouse className="aspect-square rounded-[22px] shadow-[0_30px_70px_-36px_rgb(6_26_46/0.55)] ring-1 ring-navy-900/5 sm:aspect-[16/11] sm:rounded-[28px] lg:aspect-square" />
          {/* Insignia de años (como el «EST 2006» de Formis) */}
          <div className="glass pointer-events-none absolute left-3 top-3 z-20 rounded-xl px-3 py-1.5 text-navy-950 sm:left-4 sm:top-4 sm:px-3.5 sm:py-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] sm:text-xs">Desde hace</span>
            <span className="ml-2 font-heading text-lg font-medium sm:text-2xl">+{site.yearsExperience} años</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
