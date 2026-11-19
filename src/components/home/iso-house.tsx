"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, MousePointer2, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* Proyección isométrica                                               */
/* x → derecha-abajo, y → izquierda-abajo, z → arriba (metros)         */
/* ================================================================== */

type V3 = [number, number, number];
const U = 36;
const C = Math.cos(Math.PI / 6);
const S = 0.5;
const P = ([x, y, z]: V3): [number, number] => [(x - y) * C * U, ((x + y) * S - z) * U];
const poly = (vs: V3[]) => vs.map((v) => P(v).map((n) => n.toFixed(1)).join(",")).join(" ");

/** Caras visibles de un prisma: superior, +y (izquierda-frente) y +x (derecha-frente). */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    top: poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
    left: poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]),
    right: poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]),
  };
}

/* ================================================================== */
/* Cristales                                                           */
/* ================================================================== */

type Pane = {
  face: "y" | "x";
  /** Coordenada del plano de la fachada (y o x constante). */
  plane: number;
  a: number;
  b: number;
  z0: number;
  z1: number;
  label: string;
  service: string;
  kind: "window" | "rail";
};

const PANES: Pane[] = [
  // Planta baja, fachada principal: correderas
  { face: "y", plane: 7, a: 1.6, b: 3.6, z0: 0.65, z1: 3.05, label: "Corredera de aluminio", service: "aluminio", kind: "window" },
  { face: "y", plane: 7, a: 3.6, b: 5.6, z0: 0.65, z1: 3.05, label: "Corredera de aluminio", service: "aluminio", kind: "window" },
  { face: "y", plane: 7, a: 5.6, b: 7.6, z0: 0.65, z1: 3.05, label: "Corredera de aluminio", service: "aluminio", kind: "window" },
  // Planta baja, lateral
  { face: "x", plane: 9, a: 1.8, b: 4.0, z0: 0.95, z1: 3.0, label: "Ventana de aluminio", service: "aluminio", kind: "window" },
  { face: "x", plane: 9, a: 4.0, b: 6.2, z0: 0.95, z1: 3.0, label: "Ventana de aluminio", service: "aluminio", kind: "window" },
  // Barandilla de la terraza
  { face: "y", plane: 7.5, a: 0.55, b: 1.38, z0: 3.75, z1: 4.65, label: "Barandilla de vidrio", service: "barandillas", kind: "rail" },
  { face: "y", plane: 7.5, a: 1.38, b: 2.21, z0: 3.75, z1: 4.65, label: "Barandilla de vidrio", service: "barandillas", kind: "rail" },
  { face: "y", plane: 7.5, a: 2.21, b: 3.0, z0: 3.75, z1: 4.65, label: "Barandilla de vidrio", service: "barandillas", kind: "rail" },
  // Planta alta, ventanal
  { face: "y", plane: 6.5, a: 3.6, b: 5.6, z0: 4.2, z1: 6.3, label: "Ventanal panorámico", service: "cerramientos", kind: "window" },
  { face: "y", plane: 6.5, a: 5.6, b: 7.6, z0: 4.2, z1: 6.3, label: "Ventanal panorámico", service: "cerramientos", kind: "window" },
  { face: "y", plane: 6.5, a: 7.6, b: 9.6, z0: 4.2, z1: 6.3, label: "Ventanal panorámico", service: "cerramientos", kind: "window" },
  // Planta alta, lateral
  { face: "x", plane: 10.5, a: 1.6, b: 3.7, z0: 4.35, z1: 6.2, label: "Ventana oscilobatiente", service: "aluminio", kind: "window" },
  { face: "x", plane: 10.5, a: 3.7, b: 5.8, z0: 4.35, z1: 6.2, label: "Ventana oscilobatiente", service: "aluminio", kind: "window" },
];

/** Punto de la fachada de un cristal: u a lo ancho (a→b), w a lo alto (z0→z1). */
function at(p: Pane, u: number, w: number): V3 {
  const t = p.a + (p.b - p.a) * u;
  const z = p.z0 + (p.z1 - p.z0) * w;
  return p.face === "y" ? [t, p.plane, z] : [p.plane, t, z];
}

const GEOMETRY = PANES.map((p) => {
  const quad: V3[] = [at(p, 0, 0), at(p, 1, 0), at(p, 1, 1), at(p, 0, 1)];
  const pts = quad.map(P);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return {
    quad: poly(quad),
    streak: poly([at(p, 0.12, 0), at(p, 0.28, 0), at(p, 0.62, 1), at(p, 0.46, 1)]),
    streak2: poly([at(p, 0.66, 0), at(p, 0.74, 0), at(p, 0.98, 0.7), at(p, 0.9, 0.7)]),
    top: poly([at(p, 0, 1), at(p, 1, 1)]),
    center: P(at(p, 0.5, 0.55)),
    bbox: { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) },
  };
});

/* ================================================================== */
/* Escena fija                                                         */
/* ================================================================== */

const platform = box(0, 12, 0, 10, 0, 0.42);
const ground = box(1, 9, 1, 7, 0.42, 3.4);
const slab = box(0.5, 11, 0.5, 7.5, 3.4, 3.75);
const upper = box(3, 10.5, 1, 6.5, 3.75, 6.6);
const roof = box(2.6, 11, 0.6, 7, 6.6, 6.95);
const door = poly([[7.95, 7, 0.42], [8.75, 7, 0.42], [8.75, 7, 2.9], [7.95, 7, 2.9]]);
const wood = poly([[9.75, 6.5, 3.75], [10.5, 6.5, 3.75], [10.5, 6.5, 6.6], [9.75, 6.5, 6.6]]);
const pool = poly([[2.2, 7.7, 0.43], [7.6, 7.7, 0.43], [7.6, 9.5, 0.43], [2.2, 9.5, 0.43]]);
const poolEdge = poly([[2.2, 9.5, 0.28], [7.6, 9.5, 0.28], [7.6, 9.5, 0.43], [2.2, 9.5, 0.43]]);
const shadowOnDeck = poly([[9, 1, 0.43], [10.6, 1.4, 0.43], [10.6, 7.3, 0.43], [9, 7, 0.43]]);
const woodSlats = Array.from({ length: 6 }, (_, k) => {
  const x = 9.85 + k * 0.12;
  return [P([x, 6.5, 3.8]), P([x, 6.5, 6.55])] as const;
});

/** Andamio delante del ventanal de la planta alta. */
const SCAFFOLD = (() => {
  const yF = 7.2;
  const poles = [3.5, 5.6, 7.7, 9.8];
  const levels = [3.75, 4.95, 6.15, 7.25];
  const lines: [number, number, number, number][] = [];
  const seg = (a: V3, b: V3) => {
    const [x1, y1] = P(a);
    const [x2, y2] = P(b);
    lines.push([x1, y1, x2, y2]);
  };
  for (const x of poles) seg([x, yF, 3.75], [x, yF, 7.25]);
  for (const z of levels.slice(1)) seg([poles[0], yF, z], [poles[poles.length - 1], yF, z]);
  for (let i = 0; i < poles.length - 1; i++) seg([poles[i], yF, levels[i % 2 === 0 ? 1 : 2]], [poles[i + 1], yF, levels[i % 2 === 0 ? 2 : 3]]);
  const planks = [4.95, 6.15].map((z) =>
    poly([[poles[0], 6.6, z], [poles[poles.length - 1], 6.6, z], [poles[poles.length - 1], yF, z], [poles[0], yF, z]]),
  );
  return { lines, planks };
})();

/* Límites de la escena para el viewBox */
const VB = (() => {
  const pts: V3[] = [[0, 10, 0], [12, 0, 0], [12, 10, 0], [0, 0, 0], [2.6, 0.6, 7.3], [11, 0.6, 7], [3.5, 7.2, 7.25], [0, 10, 0.42]];
  const ps = pts.map(P);
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  const pad = 26;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return { x: minX, y: minY, w: Math.max(...xs) - minX + pad, h: Math.max(...ys) - minY + pad + 18 };
})();

const pct = ([x, y]: [number, number]) => ({ left: `${((x - VB.x) / VB.w) * 100}%`, top: `${((y - VB.y) / VB.h) * 100}%` });

/* ================================================================== */
/* Componente                                                          */
/* ================================================================== */

/**
 * Edificio isométrico (al estilo del render de Formis) en obra: cada ventana
 * se acristala al pasar el cursor por encima (o al tocarla), con contador de
 * cristales instalados; al completarlo se retira el andamio.
 */
export function IsoHouse({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${uid}-${n}`;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.45, once: true });

  const [glazed, setGlazed] = useState<ReadonlySet<number>>(new Set());
  const [hover, setHover] = useState<number | null>(null);
  const touched = useRef(false);
  const timers = useRef<number[]>([]);

  const total = PANES.length;
  const done = glazed.size;
  const complete = done === total;

  // Inclinación 3D siguiendo al ratón.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 90, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 90, damping: 18 });

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  /** Instala (o retira) todos los cristales en secuencia. */
  const runAll = (install: boolean) => {
    clearTimers();
    const order = PANES.map((_, i) => i);
    order.forEach((i, k) => {
      timers.current.push(
        window.setTimeout(
          () =>
            setGlazed((prev) => {
              const next = new Set(prev);
              if (install) next.add(i);
              else next.delete(i);
              return next;
            }),
          k * (install ? 140 : 50),
        ),
      );
    });
  };

  // Táctil o sin cursor: se acristala sola al aparecer en pantalla.
  useEffect(() => {
    if (!inView) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const t = window.setTimeout(() => {
      if (!touched.current && (!fine || reduce)) runAll(true);
    }, 700);
    return () => window.clearTimeout(t);
    // runAll es estable a efectos prácticos (solo usa refs y setState).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  useEffect(() => clearTimers, []);

  const glaze = (i: number) =>
    setGlazed((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });

  const toggle = (i: number) => {
    touched.current = true;
    clearTimers();
    setGlazed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  /** Un cristal: hueco, vidrio con reflejos, brillo al instalarlo, perfilería y resalte. */
  const renderPane = (i: number) => {
    const p = PANES[i];
    const g = GEOMETRY[i];
    const on = glazed.has(i);
    const isRail = p.kind === "rail";
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onPointerEnter={(e) => {
                    setHover(i);
                    if (e.pointerType === "mouse" && !touched.current) glaze(i);
                  }}
                  onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                  onClick={() => toggle(i)}
                >
                  {/* Hueco sin cristal */}
                  {!isRail && <polygon points={g.quad} fill={p.face === "y" ? "#143552" : "#0d2840"} />}
                  {/* Zona sensible (también en la barandilla, que no tiene hueco) */}
                  <polygon points={g.quad} fill="transparent" />
                  <motion.polygon
                    points={g.quad}
                    fill="none"
                    stroke={isRail ? "#0a2a48" : "#f2e8c8"}
                    strokeWidth="1.6"
                    strokeDasharray="5 5"
                    initial={false}
                    animate={{ opacity: on ? 0 : 0.7 }}
                    transition={{ duration: 0.2 }}
                  />
                  <g clipPath={`url(#${id(`clip-${i}`)})`}>
                    <motion.g initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : -14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                      <polygon points={g.quad} fill={`url(#${id(isRail ? "rail" : p.face === "y" ? "glassY" : "glassX")})`} />
                      <polygon points={g.streak} fill="#fff" opacity={isRail ? 0.3 : 0.25} />
                      <polygon points={g.streak2} fill="#fff" opacity="0.15" />
                    </motion.g>
                    {on && !reduce && (
                      <motion.rect
                        y={g.bbox.y}
                        height={g.bbox.h}
                        width={40}
                        fill={`url(#${id("shine")})`}
                        initial={{ x: g.bbox.x - 60, opacity: 0 }}
                        animate={{ x: g.bbox.x + g.bbox.w + 20, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
                      />
                    )}
                  </g>
                  {isRail ? (
                    <motion.polyline
                      points={g.top}
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0 }}
                    />
                  ) : (
                    <motion.polygon
                      points={g.quad}
                      fill="none"
                      stroke="#0f2f4d"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  )}
                  {/* Resalte al pasar por encima */}
                  <polygon
                    points={g.quad}
                    fill="none"
                    stroke="#c9a55c"
                    strokeWidth="2.5"
                    className="pointer-events-none transition-opacity duration-200"
                    opacity={hover === i ? 1 : 0}
                  />
                </g>
              );
              };
  const panesOf = (from: number, to: number) => PANES.slice(from, to).map((_, k) => renderPane(from + k));

  const hovered = hover != null ? GEOMETRY[hover] : null;

  const sceneFaces = useMemo(
    () => ({ platform, ground, slab, upper, roof }),
    [],
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="relative"
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1400 }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
          setHover(null);
        }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <svg
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            className="block h-auto w-full overflow-visible drop-shadow-[0_30px_40px_rgb(6_26_46/0.18)]"
            role="img"
            aria-label={`Ilustración de una casa moderna en obra: ${done} de ${total} cristales instalados`}
          >
            <defs>
              <linearGradient id={id("glassY")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e4f1f7" stopOpacity="0.95" />
                <stop offset="0.5" stopColor="#9fc4d6" stopOpacity="0.6" />
                <stop offset="1" stopColor="#d3e6ee" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id={id("glassX")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c7dde8" stopOpacity="0.9" />
                <stop offset="0.55" stopColor="#7ea7bd" stopOpacity="0.6" />
                <stop offset="1" stopColor="#a9c8d7" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id={id("rail")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#eaf5fa" stopOpacity="0.85" />
                <stop offset="1" stopColor="#bcd8e5" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id={id("shine")} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={id("water")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a8d8e4" />
                <stop offset="1" stopColor="#5d9fb6" />
              </linearGradient>
              <radialGradient id={id("floor")}>
                <stop offset="0" stopColor="#0a2a48" stopOpacity="0.16" />
                <stop offset="1" stopColor="#0a2a48" stopOpacity="0" />
              </radialGradient>
              {GEOMETRY.map((g, i) => (
                <clipPath key={i} id={id(`clip-${i}`)}>
                  <polygon points={g.quad} />
                </clipPath>
              ))}
            </defs>

            {/* Sombra sobre la cuadrícula */}
            <ellipse cx={P([6, 5, 0])[0]} cy={P([6, 5, 0])[1] + 20} rx={U * 9} ry={U * 3.2} fill={`url(#${id("floor")})`} />

            {/* Plataforma de piedra */}
            <polygon points={sceneFaces.platform.top} fill="#ece4d4" />
            <polygon points={sceneFaces.platform.left} fill="#d8ccb6" />
            <polygon points={sceneFaces.platform.right} fill="#c7b99f" />
            <polygon points={shadowOnDeck} fill="#0a2a48" opacity="0.07" />
            {/* Piscina */}
            <polygon points={pool} fill={`url(#${id("water")})`} />
            <polygon points={poolEdge} fill="#4f8ea6" opacity="0.6" />
            <g stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d={`M${P([2.8, 8.2, 0.43]).join(" ")} L${P([3.8, 8.2, 0.43]).join(" ")}`} />
              <path d={`M${P([4.6, 8.9, 0.43]).join(" ")} L${P([5.8, 8.9, 0.43]).join(" ")}`} />
              <path d={`M${P([6.2, 8.1, 0.43]).join(" ")} L${P([7.1, 8.1, 0.43]).join(" ")}`} />
            </g>

            {/* Planta baja */}
            <polygon points={sceneFaces.ground.left} fill="#f6f1e8" />
            <polygon points={sceneFaces.ground.right} fill="#e3dbcc" />
            <polygon points={door} fill="#9b6a43" />
            <polygon points={poly([[8.6, 7, 1.5], [8.66, 7, 1.5], [8.66, 7, 1.9], [8.6, 7, 1.9]])} fill="#2b2b2b" />
            {panesOf(0, 5)}

            {/* Forjado */}
            <polygon points={sceneFaces.slab.top} fill="#f1ebdf" />
            <polygon points={sceneFaces.slab.left} fill="#e2dacb" />
            <polygon points={sceneFaces.slab.right} fill="#d2c8b6" />
            {panesOf(5, 8)}

            {/* Planta alta */}
            <polygon points={sceneFaces.upper.left} fill="#fbf9f4" />
            <polygon points={sceneFaces.upper.right} fill="#e8e1d4" />
            <polygon points={wood} fill="#a3724a" />
            <g stroke="#c48f63" strokeWidth="2" opacity="0.6">
              {woodSlats.map(([a, b], k) => (
                <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
              ))}
            </g>
            {panesOf(8, 13)}

            {/* Cubierta */}
            <polygon points={sceneFaces.roof.top} fill="#f3eee4" />
            <polygon points={sceneFaces.roof.left} fill="#ddd5c5" />
            <polygon points={sceneFaces.roof.right} fill="#cdc3b0" />

            {/* Andamio: se retira según avanzan los cristales */}
            <motion.g
              className="pointer-events-none"
              initial={false}
              animate={{ opacity: complete ? 0 : 1 - (done / total) * 0.55, y: complete ? 12 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {SCAFFOLD.planks.map((pl, k) => (
                <polygon key={k} points={pl} fill="#c9a55c" opacity="0.85" />
              ))}
              <g stroke="#8d99a6" strokeWidth="2.2" strokeLinecap="round">
                {SCAFFOLD.lines.map(([x1, y1, x2, y2], k) => (
                  <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />
                ))}
              </g>
            </motion.g>

            {/* Vegetación */}
            <g className="pointer-events-none">
              {[
                [0.8, 8.4],
                [8.7, 9.2],
                [11.2, 2.4],
              ].map(([x, y], k) => {
                const [cx, cy] = P([x, y, 0.42]);
                return (
                  <g key={k}>
                    <ellipse cx={cx} cy={cy - 8} rx="20" ry="13" fill="#8fa07a" />
                    <ellipse cx={cx - 6} cy={cy - 13} rx="11" ry="7" fill="#a6b592" />
                  </g>
                );
              })}
              {(() => {
                const [tx, ty] = P([11.1, 8.6, 0.42]);
                return (
                  <g>
                    <rect x={tx - 2.5} y={ty - 70} width="5" height="70" rx="2" fill="#7a6048" />
                    <circle cx={tx} cy={ty - 86} r="30" fill="#8a9b74" />
                    <circle cx={tx - 14} cy={ty - 96} r="16" fill="#a3b28c" />
                  </g>
                );
              })()}
            </g>
          </svg>

          {/* Etiqueta del cristal bajo el cursor */}
          <AnimatePresence>
            {hovered && hover != null && (
              <motion.div
                key={hover}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="glass pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-navy-950"
                style={pct(hovered.center)}
              >
                {PANES[hover].label}
                <span className="ml-1.5 text-ink-soft">{glazed.has(hover) ? "· instalado" : "· pendiente"}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Contador y acciones */}
      <div className="relative z-10 mx-auto -mt-2 flex max-w-md flex-col items-center gap-3 sm:-mt-4">
        <div className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-navy-950">
          <div className="min-w-0 flex-1">
            <p className="flex items-center justify-between gap-2 text-[13px]">
              <span className="font-medium" aria-live="polite">
                {complete ? "¡Casa acristalada!" : "Cristales instalados"}
              </span>
              <span className="tabular-nums text-ink-soft">
                {done}/{total}
              </span>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-900/10">
              <motion.div
                className="h-full rounded-full bg-navy-900"
                initial={false}
                animate={{ width: `${(done / total) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
          {complete ? (
            <button
              type="button"
              onClick={() => {
                touched.current = true;
                runAll(false);
              }}
              aria-label="Retirar los cristales y volver a empezar"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-navy-900/15 bg-white/60 text-navy-900 transition-colors hover:bg-white"
            >
              <RotateCcw className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                touched.current = true;
                runAll(true);
              }}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-navy-900 px-3.5 text-[13px] font-medium text-cream-100 shadow-sm transition-colors hover:bg-navy-800"
            >
              <Sparkles className="size-3.5" /> Instalar todos
            </button>
          )}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {complete ? (
            <motion.div key="cta" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Link
                href="/presupuesto"
                className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-navy-900 underline-offset-4 hover:underline"
              >
                ¿Calculamos los cristales de tu casa?
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-11 items-center gap-1.5 text-center text-[13px] text-ink-soft"
            >
              <MousePointer2 aria-hidden className="hidden size-3.5 md:block" />
              <span className="hidden md:inline">Pasa el cursor por las ventanas para instalar los cristales</span>
              <span className="md:hidden">Toca una ventana para quitar o poner su cristal</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
