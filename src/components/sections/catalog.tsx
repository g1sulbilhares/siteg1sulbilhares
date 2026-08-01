"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SinucaConfigurator } from "@/components/sinuca-configurator";
import { ProductCard } from "@/components/product-card";
import { pingPong } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Catalog() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".catalog-reveal", {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 75%",
        },
      });
    },
    { scope }
  );

  return (
    <section id="catalogo" ref={scope} className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="catalog-reveal max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Catálogo
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
            Monte a sua mesa
          </h2>
          <p className="mt-3 text-muted-foreground">
            Escolha o tamanho — cada medida tem seu valor — e a cor do
            tecido, sem alterar o preço.
          </p>
        </div>

        <div className="catalog-reveal mt-14">
          <SinucaConfigurator />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="catalog-reveal">
            <ProductCard product={pingPong} />
          </div>
        </div>
      </div>
    </section>
  );
}
