import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

type Part = string | { em: string };

/** Cabecera de páginas interiores: migas de pan, etiqueta, título y entradilla. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: Part[];
  intro?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-site">
        <nav aria-label="Migas de pan" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
            <li>
              <Link href="/" className="hover:text-navy-900">
                Inicio
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <ChevronRight aria-hidden className="size-3.5" />
                <Link href={c.href} className="hover:text-navy-900">
                  {c.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <TextReveal as="h1" parts={title} className="mt-4 max-w-[20ch] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.04]" />
        {intro && (
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
