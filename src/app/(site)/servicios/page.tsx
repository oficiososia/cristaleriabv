import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { ServicesGrid } from "@/components/home/services-grid";
import { CalculatorBand } from "@/components/home/calculator-band";

export const metadata: Metadata = {
  title: "Servicios de cristalería y aluminio",
  description:
    "Mamparas, espejos, cerramientos, carpintería de aluminio, barandillas de vidrio, puertas de armario, paneles Dominó y cristal a medida en el Baix Vinalopó.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title={["Todo lo que", { em: "hacemos" }, "con vidrio y aluminio"]}
        intro="Ocho especialidades con un mismo estándar: asesoramiento, medición, fabricación en taller propio e instalación por nuestro equipo."
        crumbs={[{ href: "/servicios", label: "Servicios" }]}
      />
      <div className="-mt-16">
        <ServicesGrid withHeading={false} />
      </div>
      <CalculatorBand />
    </>
  );
}
