"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, type ElementType, type ReactNode } from "react";

type Part = string | { em: string };

type TextRevealProps = {
  /** Texto en partes; `{ em: "..." }` se muestra en serif cursiva (acento). */
  parts: Part[];
  as?: ElementType;
  className?: string;
  delay?: number;
};

/**
 * Título que aparece palabra a palabra con desenfoque (estilo "blur in" de 21st.dev).
 * El texto completo queda siempre en el DOM para lectores de pantalla y SEO.
 */
export function TextReveal({ parts, as: Tag = "h2", className, delay = 0 }: TextRevealProps) {
  const reduce = useReducedMotion();
  let index = 0;

  const words: ReactNode[] = parts.flatMap((part, p) => {
    const isEm = typeof part !== "string";
    const text = isEm ? part.em : part;
    return text
      .split(" ")
      .filter(Boolean)
      .map((word, w) => {
        const i = index++;
        const node = (
          <motion.span
            key={`${p}-${w}`}
            className="inline-block will-change-transform"
            initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.65, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {isEm ? <em className="font-serif font-normal italic text-navy-700">{word}</em> : word}
          </motion.span>
        );
        return (
          <Fragment key={`${p}-${w}-f`}>
            {node}{" "}
          </Fragment>
        );
      });
  });

  return <Tag className={className}>{words}</Tag>;
}
