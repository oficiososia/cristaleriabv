"use client";

import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { MousePointer2, Pointer } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Geometría (viewBox 1000 × 880)                                      */
/* ------------------------------------------------------------------ */

type Pane = { x: number; y: number; w: number; h: number; kind: "window" | "rail" };

// Orden de instalación: planta baja → planta alta → barandilla → ventana estrecha.
const PANES: Pane[] = [
  // Correderas planta baja (hueco x 260–700, y 530–700)
  { x: 262, y: 532, w: 108, h: 166, kind: "window" },
  { x: 372, y: 532, w: 108, h: 166, kind: "window" },
  { x: 482, y: 532, w: 108, h: 166, kind: "window" },
  { x: 592, y: 532, w: 106, h: 166, kind: "window" },
  // Ventanal planta alta (hueco x 360–760, y 346–462)
  { x: 362, y: 348, w: 98, h: 112, kind: "window" },
  { x: 462, y: 348, w: 98, h: 112, kind: "window" },
  { x: 562, y: 348, w: 98, h: 112, kind: "window" },
  { x: 662, y: 348, w: 96, h: 112, kind: "window" },
  // Barandilla de vidrio de la terraza
  { x: 112, y: 428, w: 66, h: 56, kind: "rail" },
  { x: 181, y: 428, w: 66, h: 56, kind: "rail" },
  { x: 250, y: 428, w: 66, h: 56, kind: "rail" },
  // Ventana estrecha junto a la puerta
  { x: 838, y: 542, w: 22, h: 148, kind: "window" },
];

const STEP = 0.09;

/* ------------------------------------------------------------------ */
/* Variantes de animación                                              */
/* ------------------------------------------------------------------ */

const frameV: Variants = {
  off: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
  on: (i: number) => ({ pathLength: 1, opacity: 1, transition: { delay: i * STEP, duration: 0.45, ease: "easeOut" } }),
};
const glassV: Variants = {
  off: { scaleY: 0, opacity: 0, transition: { duration: 0.25 } },
  on: (i: number) => ({ scaleY: 1, opacity: 1, transition: { delay: i * STEP + 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
};
const shineV: Variants = {
  off: { x: -160, opacity: 0 },
  on: (i: number) => ({
    x: 260,
    opacity: [0, 1, 1, 0],
    transition: { delay: i * STEP + 0.6, duration: 0.9, ease: "easeInOut" },
  }),
};
const dashV: Variants = {
  off: { opacity: 0.55, transition: { duration: 0.3 } },
  on: (i: number) => ({ opacity: 0, transition: { delay: i * STEP, duration: 0.2 } }),
};

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

/**
 * Casa moderna sin cristales que «se acristala» al pasar el cursor
 * (escritorio), al aparecer en pantalla (móvil/táctil) o al hacer scroll.
 * El interruptor permite verla con y sin cristales en cualquier momento.
 */
export function GlazingHouse({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5, once: true });
  const { scrollY } = useScroll();
  const [glazed, setGlazed] = useState(false);
  const manual = useRef(false);

  // Táctil: se acristala sola poco después de aparecer.
  useEffect(() => {
    if (!inView || manual.current) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const t = window.setTimeout(() => !manual.current && setGlazed(true), coarse || reduce ? 900 : 4500);
    return () => window.clearTimeout(t);
  }, [inView, reduce]);

  // Escritorio: si se empieza a bajar sin haber pasado el cursor, también.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > 140 && !manual.current) setGlazed(true);
  });

  const toggle = (v: boolean) => {
    manual.current = true;
    setGlazed(v);
  };

  const id = (n: string) => `${uid}-${n}`;
  const state = glazed ? "on" : "off";

  return (
    <div
      ref={ref}
      className={cn("relative isolate overflow-hidden bg-[#eef1f2]", className)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !manual.current) setGlazed(true);
      }}
    >
      <svg
        viewBox="0 60 1000 820"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={
          glazed
            ? "Ilustración de una casa moderna con todos sus cristales instalados: correderas, ventanal y barandilla de vidrio"
            : "Ilustración de una casa moderna sin cristales, con los huecos de las ventanas vacíos"
        }
      >
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe9ef" />
            <stop offset="0.75" stopColor="#f6f2ea" />
          </linearGradient>
          <radialGradient id={id("sun")}>
            <stop offset="0" stopColor="#fff6dc" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("interior")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#163652" />
            <stop offset="1" stopColor="#0a2034" />
          </linearGradient>
          <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e3f0f6" stopOpacity="0.92" />
            <stop offset="0.42" stopColor="#a9cbdc" stopOpacity="0.55" />
            <stop offset="0.7" stopColor="#7fa9c0" stopOpacity="0.45" />
            <stop offset="1" stopColor="#d6e8f0" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={id("rail")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6f2f7" stopOpacity="0.75" />
            <stop offset="1" stopColor="#b9d6e3" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={id("shine")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("shadow")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a2a48" stopOpacity="0.28" />
            <stop offset="1" stopColor="#0a2a48" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("wood")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8a5b37" />
            <stop offset="1" stopColor="#a8784f" />
          </linearGradient>
          <linearGradient id={id("pool")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fd0dc" />
            <stop offset="1" stopColor="#5f9fb6" />
          </linearGradient>
          <radialGradient id={id("lamp")}>
            <stop offset="0" stopColor="#fbe7b0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fbe7b0" stopOpacity="0" />
          </radialGradient>
          {PANES.map((p, i) => (
            <clipPath key={i} id={id(`clip-${i}`)}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} />
            </clipPath>
          ))}
        </defs>

        {/* Cielo, sol, nubes y colinas */}
        <rect width="1000" height="880" fill={`url(#${id("sky")})`} />
        <circle cx="810" cy="170" r="150" fill={`url(#${id("sun")})`} />
        <g fill="#fff" opacity="0.75">
          <ellipse cx="210" cy="150" rx="70" ry="16" />
          <ellipse cx="250" cy="138" rx="46" ry="18" />
          <ellipse cx="640" cy="96" rx="60" ry="12" />
          <ellipse cx="672" cy="86" rx="36" ry="14" />
        </g>
        <path d="M0 640 C 180 590, 330 610, 470 596 S 780 570, 1000 600 L1000 720 L0 720 Z" fill="#e1e5dc" />
        <path d="M0 668 C 220 640, 420 660, 620 646 S 880 630, 1000 650 L1000 720 L0 720 Z" fill="#d6dccf" />

        {/* Ciprés y olivo */}
        <path d="M70 700 C 52 640, 58 560, 78 520 C 98 560, 104 640, 86 700 Z" fill="#7d8c69" />
        <path d="M948 700 L942 610 C 940 596, 950 592, 952 606 L956 700 Z" fill="#7a6048" />
        <g fill="#93a37f">
          <ellipse cx="930" cy="590" rx="46" ry="30" />
          <ellipse cx="968" cy="572" rx="40" ry="28" />
          <ellipse cx="948" cy="548" rx="38" ry="26" />
        </g>
        <g fill="#a9b893" opacity="0.9">
          <ellipse cx="920" cy="572" rx="22" ry="12" />
          <ellipse cx="962" cy="552" rx="20" ry="10" />
        </g>

        {/* ---------- Suelo, piscina y césped ---------- */}
        <rect x="0" y="700" width="1000" height="180" fill="#e9e0cf" />
        <g stroke="#ddd2bd" strokeWidth="2">
          <path d="M0 724 H1000" />
          {Array.from({ length: 13 }, (_, k) => (
            <path key={k} d={`M${k * 80} 700 V724`} />
          ))}
        </g>
        <rect x="40" y="740" width="560" height="120" rx="6" fill={`url(#${id("pool")})`} />
        <rect x="40" y="740" width="560" height="8" fill="#0a2a48" opacity="0.12" />
        <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" fill="none">
          <path d="M90 780 q 20 -8 40 0 t 40 0" />
          <path d="M300 806 q 20 -8 40 0 t 40 0" />
          <path d="M470 772 q 16 -6 32 0 t 32 0" />
          <path d="M160 836 q 18 -7 36 0 t 36 0" />
        </g>
        {/* Reflejo de los cristales en el agua */}
        <motion.rect
          x="262"
          y="750"
          width="336"
          height="40"
          fill="#e3f0f6"
          animate={{ opacity: glazed ? 0.35 : 0.08 }}
          transition={{ duration: 0.8, delay: glazed ? 0.6 : 0 }}
        />
        <rect x="620" y="740" width="380" height="140" fill="#b8c49f" />
        <rect x="620" y="740" width="380" height="6" fill="#a6b38c" />

        {/* Sombra de la casa en el suelo */}
        <path d="M130 700 L910 700 L960 728 L170 728 Z" fill="#0a2a48" opacity="0.08" />

        {/* ---------- Planta baja ---------- */}
        <rect x="140" y="502" width="760" height="198" fill="#f4efe6" />
        {/* Muro de piedra */}
        <rect x="140" y="502" width="100" height="198" fill="#d9cdb7" />
        <g stroke="#c4b69d" strokeWidth="2" fill="none">
          <path d="M140 540 H240 M140 580 H240 M140 620 H240 M140 660 H240" />
          <path d="M180 502 V540 M210 540 V580 M168 580 V620 M220 620 V660 M190 660 V700" />
        </g>
        {/* Hueco de las correderas: interior */}
        <rect x="260" y="530" width="440" height="170" fill={`url(#${id("interior")})`} />
        <rect x="260" y="530" width="440" height="6" fill="#0a2a48" opacity="0.5" />
        <g>
          <circle cx="330" cy="540" r="26" fill={`url(#${id("lamp")})`} />
          <circle cx="480" cy="540" r="26" fill={`url(#${id("lamp")})`} />
          <circle cx="630" cy="540" r="26" fill={`url(#${id("lamp")})`} />
          <rect x="286" y="640" width="190" height="44" rx="12" fill="#2a4b6c" />
          <rect x="296" y="626" width="170" height="24" rx="10" fill="#33577a" />
          <rect x="520" y="660" width="64" height="24" rx="4" fill="#3b5f80" />
          <ellipse cx="652" cy="636" rx="22" ry="34" fill="#3f6a5b" />
          <rect x="645" y="660" width="14" height="24" fill="#5b4433" />
          <rect x="260" y="684" width="440" height="16" fill="#0b2236" opacity="0.6" />
        </g>
        {/* Puerta de madera */}
        <rect x="730" y="540" width="90" height="160" fill={`url(#${id("wood")})`} />
        <g stroke="#7a4f2e" strokeWidth="2" opacity="0.6">
          <path d="M752 540 V700 M775 540 V700 M798 540 V700" />
        </g>
        <rect x="806" y="606" width="4" height="34" rx="2" fill="#2b2b2b" />
        {/* Hueco de la ventana estrecha */}
        <rect x="836" y="540" width="26" height="152" fill={`url(#${id("interior")})`} />

        {/* Forjado y sombra */}
        <rect x="100" y="484" width="840" height="18" fill="#e7e0d2" />
        <rect x="100" y="484" width="840" height="3" fill="#fff" opacity="0.6" />
        <rect x="140" y="502" width="760" height="16" fill={`url(#${id("shadow")})`} />

        {/* ---------- Planta alta ---------- */}
        <rect x="320" y="318" width="590" height="166" fill="#fbf9f4" />
        <rect x="320" y="318" width="10" height="166" fill="#ece6da" />
        {/* Hueco del ventanal: interior */}
        <rect x="360" y="346" width="400" height="116" fill={`url(#${id("interior")})`} />
        <rect x="360" y="346" width="400" height="5" fill="#0a2a48" opacity="0.5" />
        <circle cx="430" cy="356" r="22" fill={`url(#${id("lamp")})`} />
        <circle cx="560" cy="356" r="22" fill={`url(#${id("lamp")})`} />
        <circle cx="690" cy="356" r="22" fill={`url(#${id("lamp")})`} />
        <rect x="600" y="384" width="64" height="44" rx="3" fill="#24476a" />
        <rect x="608" y="392" width="48" height="28" rx="2" fill="#c9a55c" opacity="0.45" />
        <rect x="390" y="430" width="140" height="22" rx="8" fill="#2a4b6c" />
        <rect x="360" y="452" width="400" height="10" fill="#0b2236" opacity="0.6" />
        {/* Lamas de madera */}
        <rect x="790" y="330" width="100" height="154" fill={`url(#${id("wood")})`} />
        <g stroke="#c08f63" strokeWidth="3" opacity="0.55">
          {Array.from({ length: 11 }, (_, k) => (
            <path key={k} d={`M${796 + k * 9} 330 V484`} />
          ))}
        </g>

        {/* Cubierta y sombra */}
        <rect x="290" y="300" width="650" height="18" fill="#e2dbcc" />
        <rect x="290" y="300" width="650" height="3" fill="#fff" opacity="0.7" />
        <rect x="320" y="318" width="590" height="14" fill={`url(#${id("shadow")})`} />

        {/* Terraza: borde y pasamanos */}
        <rect x="104" y="480" width="216" height="4" fill="#d5cdbd" />

        {/* Arbustos junto al muro */}
        <g fill="#8fa07a">
          <ellipse cx="160" cy="696" rx="34" ry="18" />
          <ellipse cx="206" cy="700" rx="30" ry="14" />
          <ellipse cx="884" cy="698" rx="28" ry="14" />
        </g>

        {/* ---------- Cristales ---------- */}
        {PANES.map((p, i) => {
          const isRail = p.kind === "rail";
          return (
            <g key={i}>
              {/* Contorno discontinuo: hueco pendiente de cristal */}
              <motion.rect
                x={p.x + 3}
                y={p.y + 3}
                width={p.w - 6}
                height={p.h - 6}
                fill="none"
                stroke={isRail ? "#0a2a48" : "#f2e8c8"}
                strokeWidth="2"
                strokeDasharray="7 7"
                variants={dashV}
                custom={i}
                initial="off"
                animate={state}
              />
              <g clipPath={`url(#${id(`clip-${i}`)})`}>
                <motion.rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  fill={`url(#${id(isRail ? "rail" : "glass")})`}
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                  variants={glassV}
                  custom={i}
                  initial="off"
                  animate={state}
                />
                {/* Reflejos diagonales */}
                <motion.g variants={glassV} custom={i} initial="off" animate={state} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
                  <path
                    d={`M${p.x + p.w * 0.15} ${p.y + p.h} L${p.x + p.w * 0.55} ${p.y} L${p.x + p.w * 0.72} ${p.y} L${p.x + p.w * 0.32} ${p.y + p.h} Z`}
                    fill="#fff"
                    opacity={isRail ? 0.25 : 0.22}
                  />
                  <path
                    d={`M${p.x + p.w * 0.62} ${p.y + p.h} L${p.x + p.w * 0.95} ${p.y + p.h * 0.2} L${p.x + p.w} ${p.y + p.h * 0.32} L${p.x + p.w * 0.72} ${p.y + p.h} Z`}
                    fill="#fff"
                    opacity="0.14"
                  />
                </motion.g>
                {/* Brillo que cruza el cristal al instalarlo */}
                <motion.rect
                  x={p.x - 40}
                  y={p.y}
                  width="70"
                  height={p.h}
                  fill={`url(#${id("shine")})`}
                  variants={shineV}
                  custom={i}
                  initial="off"
                  animate={state}
                />
              </g>
              {/* Perfilería (aluminio) o canto de la barandilla */}
              {isRail ? (
                <motion.path
                  d={`M${p.x} ${p.y} H${p.x + p.w}`}
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={frameV}
                  custom={i}
                  initial="off"
                  animate={state}
                />
              ) : (
                <motion.rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  fill="none"
                  stroke="#0f2f4d"
                  strokeWidth="4"
                  variants={frameV}
                  custom={i}
                  initial="off"
                  animate={state}
                />
              )}
            </g>
          );
        })}
        {/* Pinzas de la barandilla */}
        <motion.g fill="#9aa7b3" variants={frameV} custom={9} initial="off" animate={state}>
          {[120, 170, 189, 239, 258, 308].map((x) => (
            <rect key={x} x={x} y="476" width="8" height="6" rx="1" />
          ))}
        </motion.g>

      </svg>

      {/* Indicación (escritorio) */}
      <p
        className={cn(
          "glass pointer-events-none absolute right-3 top-3 z-10 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-navy-950 transition-opacity duration-500 sm:right-4 sm:top-4 md:flex",
          glazed && "opacity-0",
        )}
      >
        <MousePointer2 aria-hidden className="size-3.5" />
        Pasa el cursor: instalamos los cristales
      </p>

      {/* Interruptor sin cristal / acristalado */}
      <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-3 sm:inset-x-4 sm:bottom-4">
        <div role="group" aria-label="Ver la casa" className="glass flex rounded-full p-1 text-[13px] font-medium text-navy-950">
          <button
            type="button"
            aria-pressed={!glazed}
            onClick={() => toggle(false)}
            className={cn("min-h-9 cursor-pointer rounded-full px-3.5 transition-colors", !glazed && "bg-navy-900 text-cream-100 shadow-sm")}
          >
            Sin cristal
          </button>
          <button
            type="button"
            aria-pressed={glazed}
            onClick={() => toggle(true)}
            className={cn("min-h-9 cursor-pointer rounded-full px-3.5 transition-colors", glazed && "bg-navy-900 text-cream-100 shadow-sm")}
          >
            Acristalado
          </button>
        </div>
        <span className="glass hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-navy-950 sm:flex md:hidden">
          <Pointer aria-hidden className="size-3.5" />
          Toca para comparar
        </span>
      </div>
    </div>
  );
}
