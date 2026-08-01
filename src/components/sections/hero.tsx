"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

gsap.registerPlugin(useGSAP);

const HEADLINE_LINES = [
  "Uma mesa de sinuca",
  "só está pronta quando está",
  "perfeitamente nivelada.",
];

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      tl.set(".hero-mask-inner", { yPercent: 110 })
        .set(".hero-fade", { autoAlpha: 0, y: 16 })
        .set(".hero-frame", { autoAlpha: 0, scale: 0.98 })
        .to(".hero-eyebrow .hero-fade", { autoAlpha: 1, y: 0, duration: 0.7 })
        .to(
          ".hero-mask-inner",
          { yPercent: 0, duration: 1, stagger: 0.09 },
          "-=0.35"
        )
        .to(
          ".hero-body .hero-fade",
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.55"
        )
        .to(
          ".hero-frame",
          { autoAlpha: 1, scale: 1, duration: 1.1 },
          "-=0.9"
        )
        .to(
          ".hero-scroll-cue",
          { autoAlpha: 1, duration: 0.6 },
          "-=0.3"
        );

      gsap.to(".hero-frame-img", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-scroll-cue span:last-child", {
        scaleY: 0.4,
        transformOrigin: "top",
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "power1.inOut",
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden border-b border-line bg-background"
    >
      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-28 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pb-28 md:pt-36">
        <div>
          <div className="hero-eyebrow overflow-hidden">
            <div className="hero-fade flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Curitiba, PR — Fabricação própria
            </div>
          </div>

          <h1 className="mt-6 text-[2.5rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-[3.4rem]">
            {HEADLINE_LINES.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="hero-mask-inner block">{line}</span>
              </span>
            ))}
          </h1>

          <div className="hero-body mt-8 max-w-md overflow-hidden">
            <p className="hero-fade text-lg text-muted-foreground">
              Modelos residenciais e profissionais com medidas, cores e
              acabamentos personalizados — construídos e conferidos à mão, um
              de cada vez.
            </p>
          </div>

          <div className="hero-body mt-10 flex flex-wrap gap-4 overflow-hidden pb-1">
            <div className="hero-fade flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button asChild size="lg">
                  <a href="#catalogo">Ver catálogo</a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button asChild size="lg" variant="outline">
                  <a
                    href={whatsappLink("Olá, gostaria de um orçamento")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pedir orçamento
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hero-frame relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line-strong">
            <Image
              src="/images/instagram/post-6.jpg"
              alt="Mesa de sinuca G1 Sul Bilhares, modelo Premium 230"
              fill
              priority
              className="hero-frame-img object-cover scale-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/10" />

            {/* Cantos de precisão — moldura de inspeção */}
            {["-top-px -left-px", "-top-px -right-px rotate-90", "-bottom-px -right-px rotate-180", "-bottom-px -left-px -rotate-90"].map(
              (pos, i) => (
                <span
                  key={i}
                  className={`absolute h-4 w-4 border-t-2 border-l-2 border-accent ${pos}`}
                />
              )
            )}
          </div>

          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Mesa Premium 230 · 230 × 130 cm
          </p>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-0 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <span className="h-10 w-px bg-line-strong" />
      </div>
    </section>
  );
}
