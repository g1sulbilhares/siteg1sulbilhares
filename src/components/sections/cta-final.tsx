"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaFinal() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 80%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="border-t border-line bg-background">
      <div className="mx-auto max-w-6xl px-6 py-28 text-center">
        <p className="cta-reveal font-mono text-xs uppercase tracking-widest text-accent">
          Fale direto com a fábrica
        </p>
        <h2 className="cta-reveal mx-auto mt-2 max-w-xl text-3xl font-semibold text-foreground md:text-4xl">
          Quer saber qual mesa cabe no seu espaço?
        </h2>
        <p className="cta-reveal mx-auto mt-3 max-w-md text-muted-foreground">
          Envie as medidas do ambiente e receba uma orientação pelo WhatsApp.
        </p>
        <motion.div
          className="cta-reveal mt-8 inline-block"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button asChild size="lg">
            <a
              href={whatsappLink("Olá, quero ajuda para escolher uma mesa")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar agora
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
