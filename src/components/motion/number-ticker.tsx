"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type NumberTickerProps = {
  value: number;
  className?: string;
  /** Formato con separador de miles en español. */
  decimals?: number;
  duration?: number;
  /** Si es true, anima cada vez que cambia el valor (precios en directo). */
  live?: boolean;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Contador animado (estilo NumberTicker de Magic UI). */
export function NumberTicker({ value, className, decimals = 0, duration = 1.4, live = false }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: !live, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const last = useRef(live ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(value, decimals);
      last.current = value;
      return;
    }
    const controls = animate(last.current, value, {
      duration: live ? 0.6 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v, decimals);
      },
    });
    last.current = value;
    return () => controls.stop();
  }, [value, inView, reduce, decimals, duration, live]);

  return (
    <span ref={ref} className={className} aria-live={live ? "polite" : undefined}>
      {format(live ? value : 0, decimals)}
    </span>
  );
}
