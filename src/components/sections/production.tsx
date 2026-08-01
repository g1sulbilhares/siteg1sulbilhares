"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POINTS = [
  "Estrutura firme e bem nivelada",
  "Opções de cores e acabamentos",
  "Atendimento direto com a fábrica",
];

export function Production() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".prod-reveal", {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      gsap.to(".prod-img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-surface text-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="prod-reveal">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Produção própria
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
            Feitas por quem conhece bilhar
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Cada mesa passa por etapas de montagem, acabamento, instalação do
            pano e conferência de nível antes da entrega — sem intermediários
            entre a oficina e a sua casa.
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="prod-reveal relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
          <Image
            src="/images/instagram/post-4.jpg"
            alt="Tacos e opções de pano G1 Sul Bilhares"
            fill
            className="prod-img scale-110 object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
