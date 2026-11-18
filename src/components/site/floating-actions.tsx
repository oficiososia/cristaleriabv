"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { ChatWidget } from "@/components/chat/chat-widget";
import { whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

/** Botones flotantes: WhatsApp y asistente virtual. */
export function FloatingActions() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  // En la calculadora, en móvil, dejamos sitio a la barra de precio inferior.
  const raised = pathname.startsWith("/presupuesto");

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6 print:hidden",
        raised ? "bottom-24 lg:bottom-6" : "bottom-4 sm:bottom-6",
      )}
    >
      <a
        href={whatsappLink("Hola, me gustaría pedir información sobre un trabajo de cristalería.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="pointer-events-auto grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-10px_rgb(31_143_78/0.7)] transition-transform duration-300 hover:scale-105"
      >
        <MessageCircle aria-hidden className="size-6" />
      </a>
      <ChatWidget />
    </div>
  );
}
