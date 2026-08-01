import { Hero } from "@/components/sections/hero";
import { Differentiators } from "@/components/sections/differentiators";
import { Catalog } from "@/components/sections/catalog";
import { Production } from "@/components/sections/production";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaFinal } from "@/components/sections/cta-final";

export default function Home() {
  return (
    <>
      <Hero />
      <Differentiators />
      <Catalog />
      <Production />
      <Testimonials />
      <CtaFinal />
    </>
  );
}
