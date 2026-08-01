"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MessageCircle, MapPin } from "lucide-react";
import { ContatoForm } from "@/components/sections/contato-form";
import { whatsappLink } from "@/lib/whatsapp";

export function ContatoPage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".contato-reveal", {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="contato-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Atendimento
          </p>
          <h1 className="contato-reveal mt-2 max-w-2xl text-3xl font-semibold text-foreground md:text-5xl">
            Solicite seu orçamento
          </h1>
          <p className="contato-reveal mt-4 max-w-xl text-muted-foreground">
            Conte qual modelo procura ou envie as medidas do espaço pelo
            WhatsApp.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr]">
          <div className="contato-reveal">
            <h2 className="text-xl font-medium text-foreground">
              Fale com a G1 Sul Bilhares
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Atendimento para Curitiba e Região Metropolitana.
            </p>

            <div className="mt-8 space-y-6">
              <a
                href={whatsappLink("Olá, vim pelo site da G1 Sul Bilhares")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-accent"
              >
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    WhatsApp
                  </span>
                  <span className="text-foreground">(41) 98826-3601</span>
                </span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Região atendida
                  </span>
                  <span className="text-foreground">Mandirituba, PR</span>
                </span>
              </div>
            </div>
          </div>

          <div className="contato-reveal">
            <ContatoForm />
          </div>
        </div>
      </section>
    </div>
  );
}
