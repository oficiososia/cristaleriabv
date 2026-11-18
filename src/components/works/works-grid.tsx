"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { services, type ServiceSlug } from "@/content/services";
import type { Work } from "@/content/works";
import { cn } from "@/lib/utils";

const nameOf = (slug: ServiceSlug) => services.find((s) => s.slug === slug)?.name ?? slug;

/** Galería de trabajos con filtro por categoría y ampliación de imagen. */
export function WorksGrid({
  works,
  filter = true,
  initial = "todos",
  cols = 3,
}: {
  works: Work[];
  filter?: boolean;
  initial?: ServiceSlug | "todos";
  cols?: 2 | 3;
}) {
  const [active, setActive] = useState<ServiceSlug | "todos">(initial);
  const [zoom, setZoom] = useState<Work | null>(null);
  const shown = active === "todos" ? works : works.filter((w) => w.category === active);

  return (
    <div>
      {filter && (
        <div role="tablist" aria-label="Filtrar trabajos" className="mb-8 flex flex-wrap gap-2">
          {(["todos", ...services.map((s) => s.slug)] as const).map((slug) => (
            <button
              key={slug}
              role="tab"
              aria-selected={active === slug}
              onClick={() => setActive(slug)}
              className={cn(
                "min-h-11 cursor-pointer rounded-full border px-4 text-sm transition-colors",
                active === slug ? "border-navy-900 bg-navy-900 text-cream-100" : "border-navy-900/15 bg-cream-50 text-navy-900 hover:border-navy-900/40",
              )}
            >
              {slug === "todos" ? "Todos" : nameOf(slug)}
            </button>
          ))}
        </div>
      )}

      <LayoutGroup>
        <motion.ul layout className={cn("grid gap-5 sm:grid-cols-2", cols === 3 && "lg:grid-cols-3")}>
          <AnimatePresence mode="popLayout">
            {shown.map((w) => (
              <motion.li
                key={w.photo.src}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="group overflow-hidden rounded-[20px] border border-navy-900/8 bg-cream-50 shadow-[0_20px_40px_-30px_rgb(6_26_46/0.5)]">
                  <button
                    type="button"
                    onClick={() => setZoom(w)}
                    className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
                    aria-label={`Ampliar: ${w.title}`}
                  >
                    <Image
                      src={w.photo.src}
                      alt={w.photo.alt}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-glass group-hover:scale-105"
                    />
                    <span className="glass absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-medium text-navy-950">{nameOf(w.category)}</span>
                    <span className="glass absolute right-3 top-3 grid size-9 place-items-center rounded-full text-navy-950 opacity-0 transition-opacity group-hover:opacity-100">
                      <Expand aria-hidden className="size-4" />
                    </span>
                  </button>
                  <div className="flex items-center justify-between gap-4 p-4">
                    <h3 className="font-heading text-lg font-medium leading-snug">{w.title}</h3>
                    <Link
                      href={`/servicios/${w.category}`}
                      aria-label={`Ver servicio de ${nameOf(w.category)}`}
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-navy-900/10 bg-white text-navy-900 shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      <Dialog open={Boolean(zoom)} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="overflow-hidden border-none bg-navy-950 p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{zoom?.title}</DialogTitle>
          {zoom && (
            <figure>
              <div className="relative aspect-[3/2] w-full">
                <Image src={zoom.photo.src} alt={zoom.photo.alt} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-cream-100">
                <span className="font-heading text-lg">{zoom.title}</span>
                <span className="text-sm text-cream-100/60">{nameOf(zoom.category)}</span>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
