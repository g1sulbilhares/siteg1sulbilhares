"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SinucaConfigurator } from "@/components/sinuca-configurator";
import { ProductCard } from "@/components/product-card";
import { pingPong } from "@/data/products";

export function CatalogPage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cat-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="cat-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Vitrine de produtos
          </p>
          <h1 className="cat-reveal mt-2 text-3xl font-semibold text-foreground md:text-5xl">
            Catálogo G1 Sul Bilhares
          </h1>
          <p className="cat-reveal mt-3 max-w-lg text-muted-foreground">
            Escolha o tamanho da sua mesa de sinuca — o valor muda conforme a
            medida — e a cor do tecido, sem alterar o preço.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="cat-reveal">
            <SinucaConfigurator />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="cat-reveal">
              <ProductCard product={pingPong} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
