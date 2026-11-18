import { Hero } from "@/components/home/hero";
import { ServicesMarquee } from "@/components/home/services-marquee";
import { About } from "@/components/home/about";
import { ServicesGrid } from "@/components/home/services-grid";
import { Process } from "@/components/home/process";
import { CalculatorBand } from "@/components/home/calculator-band";
import { WorksPreview } from "@/components/home/works-preview";
import { FaqSection } from "@/components/home/faq-section";
import { ContactCta } from "@/components/home/contact-cta";
import { faqs } from "@/content/faq";

/** Las 5 preguntas frecuentes de la home: visita, plazos, presupuesto, garantía y pago. */
const homeFaqs = [9, 0, 5, 3, 8].map((i) => faqs[i]);

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <About />
      <ServicesGrid />
      <Process />
      <CalculatorBand />
      <WorksPreview />
      <FaqSection items={homeFaqs} />
      <ContactCta />
    </>
  );
}
