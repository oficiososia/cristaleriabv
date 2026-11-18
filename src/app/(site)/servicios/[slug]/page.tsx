import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, Check, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaLink } from "@/components/site/cta";
import { ServiceIcon } from "@/components/site/service-icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GlassReveal } from "@/components/motion/glass-reveal";
import { WorksGrid } from "@/components/works/works-grid";
import { FaqSection } from "@/components/home/faq-section";
import { servicePhotos } from "@/content/images";
import { services, serviceBySlug } from "@/content/services";
import { faqs } from "@/content/faq";
import { site } from "@/content/site";
import { works } from "@/content/works";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: `/servicios/${s.slug}` },
    openGraph: { images: [servicePhotos[s.slug].cover.src] },
  };
}

/** Preguntas frecuentes más útiles para cada servicio. */
const faqFor: Record<string, number[]> = {
  mamparas: [2, 4, 0, 9],
  espejos: [4, 0, 5, 9],
  cerramientos: [1, 0, 7, 9],
  aluminio: [1, 0, 3, 9],
  barandillas: [6, 2, 3, 9],
  armarios: [0, 4, 3, 9],
  domino: [1, 6, 0, 9],
  otros: [1, 6, 5, 8],
};

export default async function ServicePage(props: PageProps<"/servicios/[slug]">) {
  const { slug } = await props.params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const photos = servicePhotos[service.slug];
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader
        eyebrow={service.name}
        title={[service.headline]}
        intro={service.intro}
        crumbs={[
          { href: "/servicios", label: "Servicios" },
          { href: `/servicios/${service.slug}`, label: service.name },
        ]}
      >
        <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
          <CtaLink href={`/presupuesto?servicio=${service.slug}`} icon={<Calculator />}>
            Calcular presupuesto
          </CtaLink>
          <CtaLink href={`tel:${site.phones[0].tel}`} variant="outline" icon={<Phone />}>
            Llamar al {site.phones[0].display}
          </CtaLink>
        </Reveal>
      </PageHeader>

      <section className="pb-20 sm:pb-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal y={30}>
            <GlassReveal className="aspect-[4/3] rounded-[26px] shadow-[0_40px_80px_-40px_rgb(6_26_46/0.55)]" radius={300}>
              <Image src={photos.cover.src} alt={photos.cover.alt} fill priority sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
            </GlassReveal>
          </Reveal>

          <div>
            <h2 className="text-3xl font-medium">Qué incluye</h2>
            <RevealGroup className="mt-6 space-y-3">
              {service.features.map((f) => (
                <RevealItem key={f}>
                  <p className="flex items-start gap-3 rounded-xl border border-navy-900/8 bg-cream-50 p-4 text-[15px] text-ink">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-navy-900 text-cream-200">
                      <Check aria-hidden className="size-3" />
                    </span>
                    {f}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="mt-8">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-ink-soft">Ideal para</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.ideas.map((i) => (
                  <li key={i} className="rounded-full border border-navy-900/15 bg-cream-50 px-3.5 py-1.5 text-sm text-navy-900">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-20 text-cream-100 sm:py-24">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-gold-300">Inspiración</span>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-medium text-cream-100">Ideas de {service.name.toLowerCase()}</h2>
            </div>
            <Link href="/trabajos" className="inline-flex min-h-11 items-center gap-2 text-cream-200 underline-offset-4 hover:underline">
              Ver todos los trabajos <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="mt-10 [&_article]:border-cream-200/10 [&_article]:bg-navy-900 [&_h3]:text-cream-100">
            <WorksGrid works={works.filter((w) => w.category === service.slug)} filter={false} />
          </div>
        </div>
      </section>

      <FaqSection items={(faqFor[service.slug] ?? [0, 1, 2, 9]).map((i) => faqs[i])} />

      <section className="pb-20 sm:pb-28">
        <div className="container-site">
          <h2 className="text-2xl font-medium sm:text-3xl">Otros servicios</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-navy-900/10 bg-cream-50 p-4 transition-colors hover:border-navy-900/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-900 text-cream-200">
                  <ServiceIcon slug={s.slug} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-navy-900">{s.name}</span>
                  <span className="block truncate text-sm text-ink-soft">{s.short}</span>
                </span>
                <ArrowRight aria-hidden className="size-4 text-navy-900 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
