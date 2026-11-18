import {
  AppWindow,
  DoorClosed,
  Fence,
  Grid2x2,
  House,
  Layers,
  ShowerHead,
  Sparkle,
  type LucideProps,
} from "lucide-react";
import type { ServiceSlug } from "@/content/services";

const icons: Record<ServiceSlug, React.ComponentType<LucideProps>> = {
  mamparas: ShowerHead,
  espejos: Sparkle,
  cerramientos: House,
  aluminio: AppWindow,
  barandillas: Fence,
  armarios: DoorClosed,
  domino: Grid2x2,
  otros: Layers,
};

export function ServiceIcon({ slug, ...props }: { slug: ServiceSlug } & LucideProps) {
  const Icon = icons[slug];
  return <Icon aria-hidden strokeWidth={1.6} {...props} />;
}
