"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    code: "01",
    title: "Escolha do modelo",
    detail: "Definimos tamanho, estilo e acabamento.",
  },
  {
    code: "02",
    title: "Fabricação",
    detail: "Montagem da estrutura e preparação das peças.",
  },
  {
    code: "03",
    title: "Acabamento",
    detail: "Pintura, pano, caçapas e nivelamento.",
  },
  {
    code: "04",
    title: "Entrega",
    detail: "Orientação e instalação conforme combinado.",
  },
];

export function EmpresaPage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".emp-hero-reveal", {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.from(".emp-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".emp-scroll-target", start: "top 78%" },
      });

      gsap.from(".step-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".step-grid", start: "top 80%" },
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="emp-hero-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Quem somos
          </p>
          <h1 className="emp-hero-reveal mt-2 max-w-2xl text-3xl font-semibold text-foreground md:text-5xl">
            Fabricação própria e atendimento direto
          </h1>
          <p className="emp-hero-reveal mt-4 max-w-xl text-muted-foreground">
            A G1 Sul Bilhares produz mesas para residências, chácaras, áreas
            gourmet, bares, condomínios e empresas.
          </p>
        </div>
      </section>

      <section className="emp-scroll-target">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="emp-reveal relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
            <Image
              src="/images/instagram/post-8.jpg"
              alt="Mesa de sinuca G1 Sul Bilhares"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          <div className="emp-reveal">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              G1 Sul Bilhares
            </p>
            <h2 className="mt-2 text-2xl font-medium text-foreground md:text-3xl">
              Uma fábrica próxima do cliente
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Nosso trabalho começa entendendo o espaço e a necessidade de
              cada cliente. A partir disso, orientamos sobre tamanho, cor do
              pano, acabamento e acessórios.
            </p>
            <p className="mt-4 max-w-md text-muted-foreground">
              Atendemos Curitiba e Região Metropolitana com fabricação,
              reforma, manutenção, instalação e entrega conforme
              disponibilidade.
            </p>
            <Button asChild className="mt-8">
              <a href="/catalogo">Conhecer os modelos</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="emp-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Nosso processo
          </p>
          <h2 className="emp-reveal mt-2 text-2xl font-medium text-foreground md:text-3xl">
            Da oficina para seu espaço de lazer
          </h2>

          <div className="step-grid mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.code} className="step-reveal">
                <span className="font-mono text-xs text-accent">
                  {s.code}
                </span>
                <p className="mt-4 text-base font-medium text-foreground">
                  {s.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="emp-reveal text-2xl font-medium text-foreground md:text-3xl">
            Vamos conversar sobre a sua mesa?
          </h2>
          <Button asChild size="lg" className="emp-reveal mt-8">
            <a
              href={whatsappLink("Olá, vim pelo site da G1 Sul Bilhares")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
