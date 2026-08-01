"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES = [
  {
    code: "01",
    label: "Fabricação própria",
    detail: "Cada mesa é montada na nossa oficina em Curitiba, do zero.",
  },
  {
    code: "02",
    label: "Nivelamento garantido",
    detail: "Estrutura conferida com nível de precisão antes da entrega.",
  },
  {
    code: "03",
    label: "Personalização",
    detail: "Escolha tamanho, pano e acabamento da sua mesa.",
  },
  {
    code: "04",
    label: "Entrega regional",
    detail: "Curitiba e Região Metropolitana, com instalação inclusa.",
  },
];

export function Differentiators() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".diff-item", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 80%",
        },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="border-b border-line bg-background">
      <div className="mx-auto grid max-w-6xl sm:grid-cols-2 md:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.code}
            className={`diff-item border-line px-6 py-12 md:py-16 ${
              i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
            }`}
          >
            <span className="font-mono text-xs text-accent">{f.code}</span>
            <p className="mt-4 text-base font-medium text-foreground">
              {f.label}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{f.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
