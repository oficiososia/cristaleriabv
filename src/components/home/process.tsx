"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarCheck, Check, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/site/cta";
import { TravelCost } from "@/components/tools/travel-cost";
import { photos } from "@/content/images";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/utils";

/**
 * Proceso de trabajo al estilo Formis: título fijo a la izquierda y tarjetas
 * que se apilan al hacer scroll (sticky) a la derecha.
 */
export function Process() {
  const [travelOpen, setTravelOpen] = useState(false);

  return (
    <section id="proceso" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <span className="eyebrow">Cómo trabajamos</span>
          </Reveal>
          <TextReveal
            parts={["Sin sorpresas.", { em: "Un proceso claro", }, "de principio a fin."]}
            className="mt-4 max-w-[13ch] text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.06]"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Desde el primer asesoramiento hasta la instalación final, sabes en todo momento qué viene después.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/presupuesto" icon={<CalendarCheck />}>
                Empezar mi proyecto
              </CtaLink>
            </div>
          </Reveal>
        </div>

        <ol className="relative space-y-5">
          {processSteps.map((step, i) => {
            const photo = step.photo != null ? photos.process[step.photo] : null;
            return (
              <li
                key={step.title}
                className="sticky"
                style={{ top: `calc(7rem + ${Math.min(i, 6) * 14}px)` }}
              >
                <article
                  className={cn(
                    "grid overflow-hidden rounded-[22px] border border-gold-400/60 bg-cream-50 shadow-[0_24px_50px_-34px_rgb(6_26_46/0.6)]",
                    photo && "sm:grid-cols-[1.25fr_0.75fr]",
                  )}
                >
                  <div className="flex flex-col p-6 sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-navy-900 px-2.5 py-1 text-xs font-medium tracking-[0.12em] text-cream-200">
                        PASO {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 border-b border-navy-900/10 pb-4 font-serif text-[1.65rem] font-normal leading-tight text-navy-900">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{step.description}</p>
                    {step.options && (
                      <ul className="mt-3 space-y-2">
                        {step.options.map((o) => (
                          <li key={o} className="flex items-start gap-2 text-[15px] text-ink">
                            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-600" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.action && (
                      <div className="mt-5">
                        {step.action.kind === "travel" ? (
                          <button
                            type="button"
                            onClick={() => setTravelOpen(true)}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-navy-900/15 bg-white px-4 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900/40"
                          >
                            <MapPin aria-hidden className="size-4 text-gold-600" />
                            {step.action.label}
                          </button>
                        ) : (
                          <Link
                            href="/presupuesto"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-navy-900/15 bg-white px-4 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900/40"
                          >
                            {step.action.label}
                            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  {photo && (
                    <div className="relative hidden min-h-56 sm:block">
                      <Image src={photo.src} alt={photo.alt} fill sizes="280px" className="object-cover" />
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <Dialog open={travelOpen} onOpenChange={setTravelOpen}>
        <DialogContent className="bg-cream-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-navy-900">Coste de desplazamiento</DialogTitle>
            <DialogDescription>Calcula el coste de la visita técnica y la toma de medidas.</DialogDescription>
          </DialogHeader>
          <TravelCost compact />
          <p className="text-[13px] text-ink-soft">
            <strong className="font-medium text-navy-900">Nota:</strong> es un coste estimado del desplazamiento para la toma de
            medidas. Se confirma al concertar la visita.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
