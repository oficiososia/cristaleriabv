import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Barra superior (como la de Formis) con el mensaje comercial principal. */
export function Announcement() {
  return (
    <div className="relative z-50 bg-navy-900 text-cream-100 print:hidden">
      <div className="container-site flex min-h-10 items-center justify-center gap-3 py-2 text-center text-[13px] sm:text-sm">
        <span>
          <span className="hidden sm:inline">Visita técnica gratuita en Crevillente · </span>
          Presupuesto orientativo online en 2 minutos
        </span>
        <Link
          href="/presupuesto"
          aria-label="Ir a la calculadora de presupuestos"
          className="grid size-6 shrink-0 place-items-center rounded-full bg-cream-200 text-navy-900 transition-transform hover:translate-x-0.5"
        >
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
