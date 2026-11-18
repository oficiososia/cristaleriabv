import { Hero } from "@/components/home/hero";
import { ServicesMarquee } from "@/components/home/services-marquee";
import { About } from "@/components/home/about";
import { ServicesGrid } from "@/components/home/services-grid";
import { Process } from "@/components/home/process";
import { CalculatorBand } from "@/components/home/calculator-band";
import { WhyUs } from "@/components/home/why-us";
import { WorksPreview } from "@/components/home/works-preview";
import { FaqSection } from "@/components/home/faq-section";
import { ContactCta } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <About />
      <ServicesGrid />
      <Process />
      <CalculatorBand />
      <WhyUs />
      <WorksPreview />
      <FaqSection />
      <ContactCta />
    </>
  );
}
