"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const STATIC_MASK =
  "radial-gradient(circle 70% at 50% 50%, transparent 0%, transparent 60%, black 100%)";

type GlassRevealProps = {
  children: ReactNode;
  className?: string;
  /** Radio del círculo "limpio" en px. */
  radius?: number;
};

/**
 * Cristal esmerilado sobre una imagen que se aclara donde pasa el cursor,
 * como quien limpia el vaho de un cristal. Sin cursor (móvil), el círculo
 * se desplaza solo. Con "reducir movimiento" queda fijo en el centro.
 */
export function GlassReveal({ children, className, radius = 260 }: GlassRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(45);
  const x = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  // Recorrido automático cuando no hay cursor encima.
  useEffect(() => {
    if (reduce || hovering) return;
    const cx = animate(rawX, [50, 72, 60, 30, 38, 50], { duration: 14, repeat: Infinity, ease: "easeInOut" });
    const cy = animate(rawY, [45, 35, 68, 60, 30, 45], { duration: 14, repeat: Infinity, ease: "easeInOut" });
    return () => {
      cx.stop();
      cy.stop();
    };
  }, [reduce, hovering, rawX, rawY]);

  const mask = useMotionTemplate`radial-gradient(circle ${radius}px at ${x}% ${y}%, transparent 0%, transparent 50%, rgba(0,0,0,0.55) 80%, black 100%)`;

  return (
    <div
      ref={ref}
      className={cn("relative isolate overflow-hidden", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rawX.set(((e.clientX - r.left) / r.width) * 100);
        rawY.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {children}
      {/* Capa de vidrio esmerilado con un "agujero" limpio que sigue al cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-cream-50/15 [backdrop-filter:blur(9px)_saturate(115%)] [-webkit-backdrop-filter:blur(9px)_saturate(115%)]"
        style={
          reduce
            ? { maskImage: STATIC_MASK, WebkitMaskImage: STATIC_MASK }
            : { maskImage: mask, WebkitMaskImage: mask }
        }
      />
      {/* Reflejo que cruza el cristal */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="glass-shine animate-shine" />
      </div>
    </div>
  );
}
