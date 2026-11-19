"use client";

import { Check } from "lucide-react";
import { ChoiceChips, Field, NativeSelect, TextArea, TextInput } from "@/components/forms/fields";
import { arr, type FieldDef, type Values } from "@/lib/pricing/categories";
import { cn } from "@/lib/utils";

type Props = {
  field: FieldDef;
  values: Values;
  onChange: (id: string, value: Values[string]) => void;
  showErrors?: boolean;
};

/** Pinta un campo de la calculadora a partir de su definición. */
export function FieldRenderer({ field, values, onChange, showErrors }: Props) {
  const value = values[field.id];

  if (field.kind === "toggle") {
    const checked = Boolean(value);
    return (
      <label
        className={cn(
          "flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-navy-700/30",
          checked ? "border-navy-900/40 bg-cream-200/40" : "border-input bg-white hover:border-navy-900/30",
        )}
      >
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(field.id, e.target.checked)} />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
            checked ? "border-navy-900 bg-navy-900 text-cream-100" : "border-navy-900/30 bg-white",
          )}
        >
          {checked && <Check className="size-3.5" />}
        </span>
        <span>
          <span className="block text-[15px] font-medium text-navy-900">{field.label}</span>
          {field.hint && <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{field.hint}</span>}
        </span>
      </label>
    );
  }

  if (field.kind === "multi") {
    const selected = arr(value);
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-navy-900">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => {
            const checked = selected.includes(o.value);
            return (
              <label
                key={o.value}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-all has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-navy-700/30",
                  checked ? "border-navy-900 bg-navy-900 text-cream-100" : "border-input bg-white text-ink hover:border-navy-900/35",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onChange(field.id, checked ? selected.filter((x) => x !== o.value) : [...selected, o.value])}
                />
                {checked && <Check aria-hidden className="size-3.5" />}
                {o.label}
              </label>
            );
          })}
        </div>
        {field.hint && <p className="text-[13px] text-ink-soft">{field.hint}</p>}
      </fieldset>
    );
  }

  const numberError =
    showErrors && field.kind === "number" && field.required
      ? (() => {
          const n = Number(value);
          if (value === "" || value == null || !n) return `Indica ${field.label.toLowerCase()}`;
          if (n < field.min) return `Mínimo ${field.min} ${field.unit ?? ""}`.trim();
          if (n > field.max) return `Máximo ${field.max} ${field.unit ?? ""}`.trim();
          return undefined;
        })()
      : undefined;
  const choiceError = showErrors && field.required && field.kind === "chips" && !value ? "Elige una opción" : undefined;

  return (
    <Field label={field.label + (field.kind === "number" && field.unit ? ` (${field.unit})` : "")} hint={field.hint} required={field.required} error={numberError ?? choiceError}>
      {(p) => {
        switch (field.kind) {
          case "number":
            return (
              <TextInput
                {...p}
                type="number"
                inputMode="decimal"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                placeholder={field.placeholder}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={(e) => onChange(field.id, e.target.value === "" ? "" : Number(e.target.value))}
              />
            );
          case "chips":
            return (
              <ChoiceChips
                id={p.id}
                aria-describedby={p["aria-describedby"]}
                name={field.id}
                value={String(value ?? "")}
                onChange={(v) => onChange(field.id, v)}
                options={field.options}
              />
            );
          case "select":
            return (
              <NativeSelect
                {...p}
                value={String(value ?? "")}
                onChange={(e) => onChange(field.id, e.target.value)}
                options={field.options}
                placeholder="Selecciona una opción"
              />
            );
          case "text":
            return (
              <TextInput
                {...p}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                value={String(value ?? "")}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
            );
          case "textarea":
            return (
              <TextArea
                {...p}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                value={String(value ?? "")}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
            );
        }
      }}
    </Field>
  );
}
