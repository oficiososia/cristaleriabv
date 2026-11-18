import type { ReactNode } from "react";
import { PageHeader } from "@/components/site/page-header";

/** Plantilla de páginas legales. */
export function LegalPage({ title, href, updated, children }: { title: string; href: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={[title]} crumbs={[{ href, label: title }]} />
      <section className="pb-20 sm:pb-28">
        <div className="container-site">
          <div className="max-w-3xl space-y-5 text-[16px] leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_mark]:rounded [&_mark]:bg-cream-200 [&_mark]:px-1 [&_mark]:text-navy-900 [&_ul]:space-y-1.5">
            <p className="text-sm text-ink-soft">Última actualización: {updated}</p>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

/** Dato pendiente de completar por la empresa (se resalta en amarillo crema). */
export function Pending({ children }: { children: ReactNode }) {
  return <mark>{children}</mark>;
}
