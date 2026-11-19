import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "outline-light" | "whatsapp";

const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-cream-100 hover:bg-navy-800 shadow-layered",
  light: "bg-cream-200 text-navy-900 hover:bg-cream-300 shadow-layered",
  outline: "border border-navy-900/15 bg-cream-50/70 text-navy-900 hover:border-navy-900/35 hover:bg-cream-50",
  "outline-light": "border border-cream-200/30 text-cream-100 hover:border-cream-200/60 hover:bg-cream-200/10",
  whatsapp: "bg-whatsapp text-white hover:brightness-110 shadow-layered",
};

const base =
  "group/cta relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-lg px-5 py-2.5 text-[15px] font-medium transition-all duration-300 ease-glass active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

type CtaProps = {
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Botón-enlace al estilo Formis (icono a la izquierda, sombra en capas). */
export function CtaLink({
  href,
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: CtaProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const external = typeof href === "string" && /^(https?:|tel:|mailto:)/.test(href);
  const content = (
    <>
      {icon && <span className="[&_svg]:size-[18px]">{icon}</span>}
      <span>{children}</span>
      <span aria-hidden className="glass-shine -translate-x-[120%] opacity-0 transition-all duration-700 group-hover/cta:translate-x-[320%] group-hover/cta:opacity-100" />
    </>
  );
  if (external) {
    return (
      <a
        href={href as string}
        className={cn(base, variants[variant], className)}
        {...(String(href).startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {content}
    </Link>
  );
}

export function CtaButton({
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: CtaProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {icon && <span className="[&_svg]:size-[18px]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/** Enlace de texto con flecha ("Ver trabajos →"). */
export function ArrowLink({
  href,
  children,
  className,
  light,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/arrow inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline-offset-4 hover:underline",
        light ? "text-cream-100" : "text-navy-900",
        className,
      )}
    >
      {children}
      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/arrow:translate-x-1" />
    </Link>
  );
}
