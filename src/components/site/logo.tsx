import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Logo de la marca. `tone="dark"` usa el texto en marino (fondos claros);
 * `tone="light"` usa el logo original con texto crema (fondos marino).
 */
export function Logo({
  tone = "dark",
  className,
  priority,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" aria-label={`${site.name} — inicio`} className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={tone === "dark" ? "/brand/logo-dark.webp" : "/brand/logo-light.webp"}
        alt={site.name}
        width={900}
        height={340}
        priority={priority}
        className="h-full w-auto"
      />
    </Link>
  );
}
