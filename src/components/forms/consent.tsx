import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Casilla de consentimiento RGPD con enlace a la política de privacidad. */
export function ConsentCheckbox({
  checked,
  onChange,
  error,
  dark,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-snug has-[:focus-visible]:[&>span:first-of-type]:ring-[3px] has-[:focus-visible]:[&>span:first-of-type]:ring-navy-700/30">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
            checked
              ? dark
                ? "border-cream-200 bg-cream-200 text-navy-900"
                : "border-navy-900 bg-navy-900 text-cream-100"
              : dark
                ? "border-cream-200/40"
                : "border-navy-900/30 bg-white",
          )}
        >
          {checked && <Check className="size-3.5" />}
        </span>
        <span className={dark ? "text-cream-100/80" : "text-ink-soft"}>
          He leído y acepto la{" "}
          <Link href="/privacidad" className={cn("underline underline-offset-2", dark ? "text-cream-100" : "text-navy-900")} target="_blank">
            política de privacidad
          </Link>{" "}
          y el tratamiento de mis datos para responder a mi solicitud.
        </span>
      </label>
      {error && (
        <p role="alert" className={cn("mt-1.5 text-[13px]", dark ? "text-red-300" : "text-destructive")}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Campo oculto anti-spam (los bots lo rellenan; las personas no lo ven). */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        No rellenes este campo
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
