"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Testimonials() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".testi-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: "top 78%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="border-t border-line bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="testi-reveal max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Quem já tem uma G1
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
            Depoimentos de clientes
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testi-reveal flex flex-col gap-4 rounded-lg border border-line bg-surface p-6"
            >
              <Quote className="h-5 w-5 text-accent" />
              <p className="text-sm text-foreground">{t.quote}</p>
              <p className="mt-auto font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
