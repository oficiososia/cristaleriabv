import { ChevronDown, Info } from "lucide-react";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-input bg-white px-3.5 text-[15px] text-ink shadow-[inset_0_1px_2px_rgb(6_26_46/0.04)] outline-none transition-colors placeholder:text-ink-soft/80 hover:border-navy-900/30 focus:border-navy-700 focus:ring-[3px] focus:ring-navy-700/15 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15";

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
};

/** Campo con etiqueta visible, ayuda y error junto al control (accesible). */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-navy-900">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-gold-600">
            *
          </span>
        )}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && !error && (
        <p id={hintId} className="flex items-start gap-1.5 text-[13px] leading-snug text-ink-soft">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(function TextInput(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(control, "h-12", className)} {...props} />;
});

export const TextArea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(function TextArea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(control, "min-h-28 py-3 leading-relaxed", className)} {...props} />;
});

export type Option = { value: string; label: string };

export const NativeSelect = forwardRef<
  HTMLSelectElement,
  ComponentProps<"select"> & { options: readonly Option[]; placeholder?: string }
>(function NativeSelect({ className, options, placeholder, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(control, "h-12 cursor-pointer appearance-none pr-10", className)} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
    </div>
  );
});

/** Grupo de opciones tipo "píldora" (radio accesible) para elecciones cortas. */
export function ChoiceChips<T extends string>({
  name,
  value,
  onChange,
  options,
  className,
  "aria-describedby": describedBy,
  id,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string; hint?: string }[];
  className?: string;
  "aria-describedby"?: string;
  id?: string;
}) {
  return (
    <div id={id} role="radiogroup" aria-describedby={describedBy} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <label
            key={o.value}
            className={cn(
              "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-all duration-200 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-navy-700/30",
              checked
                ? "border-navy-900 bg-navy-900 text-cream-100 shadow-layered"
                : "border-input bg-white text-ink hover:border-navy-900/35",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span>{o.label}</span>
            {o.hint && <span className={cn("text-xs", checked ? "text-cream-200/80" : "text-ink-soft")}>{o.hint}</span>}
          </label>
        );
      })}
    </div>
  );
}
