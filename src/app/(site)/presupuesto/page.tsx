import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck, Clock, Ruler } from "lucide-react";
import { Calculator } from "@/components/calculator/calculator";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Calculadora de presupuestos",
  description:
    "Calcula al momento un presupuesto orientativo para mamparas, espejos, cerramientos, aluminio, barandillas, armarios y cristal a medida en el Baix Vinalopó.",
  alternates: { canonical: "/presupuesto" },
};

export default function PresupuestoPage() {
  return (
    <div className="relative pb-28 lg:pb-24">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 -z-10 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <section className="container-site pb-8 pt-10 sm:pt-14 print:hidden">
        <Reveal>
          <span className="eyebrow">Presupuesto online</span>
        </Reveal>
        <TextReveal
          as="h1"
          parts={["Calcula tu", { em: "presupuesto" }, "orientativo"]}
          className="mt-4 max-w-[18ch] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.04]"
        />
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Elige el tipo de trabajo, introduce las medidas y conoce un precio aproximado al instante. Todos los presupuestos
            están sujetos a confirmación tras la visita técnica.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink">
            <li className="flex items-center gap-2">
              <Clock aria-hidden className="size-4 text-gold-600" /> En 2 minutos
            </li>
            <li className="flex items-center gap-2">
              <Ruler aria-hidden className="size-4 text-gold-600" /> A tu medida
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck aria-hidden className="size-4 text-gold-600" /> Sin compromiso
            </li>
          </ul>
        </Reveal>
      </section>
      <section className="container-site">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-cream-50" />}>
          <Calculator />
        </Suspense>
        <p className="mt-10 max-w-3xl text-sm text-ink-soft print:hidden">
          <strong className="font-medium text-navy-900">Aviso importante:</strong> los presupuestos calculados son aproximados y
          orientativos. El precio final está sujeto a las condiciones específicas de cada trabajo y se confirma tras la visita
          técnica.
        </p>
      </section>
    </div>
  );
}
