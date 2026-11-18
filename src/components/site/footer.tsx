import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight, Calculator, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { fullAddress, mainNav, site, whatsappLink } from "@/content/site";
import { services } from "@/content/services";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const legal = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];

const heading = "text-xs font-medium uppercase tracking-[0.16em] text-gold-300";
const link = "inline-flex min-h-10 items-center text-[15px] text-cream-100/75 transition-colors hover:text-cream-100";

/**
 * Pie de página: marca y accesos rápidos, navegación, servicios y contacto en
 * columnas alineadas; debajo, la marca a gran tamaño y la barra legal.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-cream-100">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-navy-700/25 blur-3xl" />

      <div className="container-site relative pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr] lg:gap-10">
          {/* Marca */}
          <div className="max-w-sm">
            <Logo tone="light" className="h-14" />
            <p className="mt-5 text-[15px] leading-relaxed text-cream-100/70">
              Cristalería, mamparas, espejos, cerramientos y aluminio en el Baix Vinalopó. Más de {site.yearsExperience} años
              fabricando e instalando a medida desde Crevillente.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/presupuesto"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream-200 px-4 text-sm font-medium text-navy-900 transition-colors hover:bg-cream-300"
              >
                <Calculator aria-hidden className="size-4" /> Calcular presupuesto
              </Link>
              <a
                href={whatsappLink("Hola, me gustaría pedir información.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream-200/25 px-4 text-sm font-medium text-cream-100 transition-colors hover:border-cream-200/60"
              >
                <MessageCircle aria-hidden className="size-4 text-whatsapp" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Navegación + servicios: dos columnas también en móvil */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            <nav aria-label="Pie de página">
              <h2 className={heading}>Navegación</h2>
              <ul className="mt-4 space-y-0.5">
                <li>
                  <Link href="/" className={link}>
                    Inicio
                  </Link>
                </li>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className={heading}>Servicios</h2>
              <ul className="mt-4 space-y-0.5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicios/${s.slug}`} className={link}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h2 className={heading}>Contacto</h2>
            <ul className="mt-4 space-y-3 text-[15px] text-cream-100/75">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="group flex min-h-10 items-center gap-3 transition-colors hover:text-cream-100">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-200/10 text-gold-300">
                      <Phone aria-hidden className="size-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-cream-100/50">{p.label}</span>
                      <span className="text-cream-100">{p.display}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="flex min-h-10 items-center gap-3 transition-colors hover:text-cream-100">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-200/10 text-gold-300">
                    <Mail aria-hidden className="size-4" />
                  </span>
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 transition-colors hover:text-cream-100"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-200/10 text-gold-300">
                    <MapPin aria-hidden className="size-4" />
                  </span>
                  <span className="pt-1.5">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city} ({site.address.province})
                    <ArrowUpRight aria-hidden className="ml-1 inline size-3.5 opacity-60 group-hover:opacity-100" />
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-200/10 text-gold-300">
                  <Clock aria-hidden className="size-4" />
                </span>
                <span className="pt-1.5">
                  Lunes a viernes
                  <br />
                  {site.hours[0].time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Marca a gran tamaño */}
        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center font-heading text-[clamp(3.2rem,15vw,13rem)] font-medium leading-[0.8] tracking-tight text-cream-100/[0.06]"
        >
          Cristalería BV
        </p>

        {/* pb-24: deja libre la zona de los botones flotantes (WhatsApp y asistente) */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream-200/10 pb-24 pt-6 text-sm text-cream-100/55 sm:flex-row sm:pb-28">
          <p className="text-center sm:text-left">
            © <CopyrightYear /> {site.name}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center transition-colors hover:text-cream-100">
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
