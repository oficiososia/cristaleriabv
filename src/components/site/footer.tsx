import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { fullAddress, mainNav, site } from "@/content/site";
import { services } from "@/content/services";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const legal = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-cream-100">
      {/* Halo decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-navy-700/30 blur-3xl"
      />
      <div className="container-site relative py-16 sm:py-20">
        <div className="flex justify-center">
          <Logo tone="light" className="h-16 sm:h-20" />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gold-400/35 p-6">
            <h2 className="text-center font-heading text-lg text-cream-100">Empresa</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[15px] text-cream-100/80">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-cream-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold-400/35 p-6">
            <h2 className="text-center font-heading text-lg text-cream-100">Servicios</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[15px] text-cream-100/80">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} className="inline-flex min-h-11 items-center hover:text-cream-200">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold-400/35 p-6">
            <h2 className="text-center font-heading text-lg text-cream-100">Contacto</h2>
            <ul className="mt-4 space-y-2.5 text-[15px] text-cream-100/80">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="flex min-h-11 items-center gap-2.5 hover:text-cream-200">
                    <Phone aria-hidden className="size-4 shrink-0 text-gold-300" />
                    {p.label}: {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="flex min-h-11 items-center gap-2.5 break-all hover:text-cream-200">
                  <Mail aria-hidden className="size-4 shrink-0 text-gold-300" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-300" />
                {fullAddress}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-300" />
                <span>
                  L–V: {site.hours[0].time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-200/15 pt-6 text-sm text-cream-100/65 md:flex-row">
          <p>
            © <CopyrightYear /> {site.name}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-cream-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
