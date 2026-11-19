import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Duración de una vuelta completa en segundos. */
  duration?: number;
  gap?: string;
  reverse?: boolean;
};

/**
 * Cinta infinita (estilo Marquee de Magic UI) hecha solo con CSS.
 * Se pausa al pasar el ratón y se detiene con "reducir movimiento".
 */
export function Marquee({ children, className, duration = 40, gap = "2.5rem", reverse }: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s`, "--marquee-gap": gap } as CSSProperties;
  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ gap }}
      >
        {children}
        <div aria-hidden className="flex items-center" style={{ gap }}>
          {children}
        </div>
      </div>
    </div>
  );
}
