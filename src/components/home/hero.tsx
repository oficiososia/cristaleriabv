import { BadgeCheck, Calculator, Gem, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ArrowLink, CtaLink } from "@/components/site/cta";
import { IsoHouse } from "@/components/home/iso-house";

const trust = [
  { icon: BadgeCheck, label: "Garantía en todos los trabajos" },
  { icon: Gem, label: "Materiales de primera calidad" },
  { icon: MapPin, label: "Servicio en el Baix Vinalopó" },
];

/**
 * Hero: texto + edificio isométrico interactivo (estilo del render de Formis).
 * - Móvil: una columna, edificio debajo del texto, CTA a todo el ancho.
 * - Escritorio (≥1024px): dos columnas.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden className="absolute -right-24 top-24 -z-10 size-[22rem] rounded-full bg-cream-200/70 blur-3xl sm:size-[34rem]" />

      <div className="container-site grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 xl:gap-14">
        <div className="max-w-2xl lg:max-w-none">
          <TextReveal
            as="h1"
            parts={["Especialistas en", { em: "cristalería" }, "y aluminio"]}
            className="max-w-[14ch] text-[clamp(2.35rem,10.5vw,3.4rem)] font-medium leading-[1.03] sm:text-[clamp(3.2rem,8vw,4.4rem)] lg:text-[clamp(3.4rem,5.2vw,5rem)]"
            delay={0.05}
          />

          <Reveal delay={0.3}>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
              Soluciones profesionales en cristalería, mamparas, espejos y cerramientos para el Baix Vinalopó. Calidad
              garantizada y servicio personalizado.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
            <CtaLink href="/presupuesto" icon={<Calculator />} className="w-full sm:w-auto">
              Calcular presupuesto
            </CtaLink>
            <ArrowLink href="/trabajos" className="justify-center sm:justify-start">
              Ver trabajos realizados
            </ArrowLink>
          </Reveal>

          <Reveal delay={0.5}>
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

        <Reveal delay={0.15} y={40}>
          <IsoHouse className="mx-auto w-full max-w-[640px]" />
        </Reveal>
      </div>
    </section>
  );
}
