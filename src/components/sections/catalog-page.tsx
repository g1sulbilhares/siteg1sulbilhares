"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SinucaConfigurator } from "@/components/sinuca-configurator";
import { ProductCard } from "@/components/product-card";
import { SimpleProductList } from "@/components/simple-product-list";
import { otherTables, tenisDeMesa, acessorios } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

      gsap.from(".cat-section-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cat-section-reveal", start: "top 80%" },
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
            Escolha o tamanho da mesa de sinuca — o valor muda conforme a
            medida e o tampo — e a cor do tecido, sem alterar o preço.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="cat-reveal">
            <SinucaConfigurator />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherTables.map((product) => (
              <div key={product.slug} className="cat-reveal">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="cat-section-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Tênis de mesa
          </p>
          <h2 className="cat-section-reveal mt-2 text-2xl font-medium text-foreground">
            Todas as variações
          </h2>
          <div className="cat-section-reveal mt-8">
            <SimpleProductList items={tenisDeMesa} />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="cat-section-reveal font-mono text-xs uppercase tracking-widest text-accent">
            Acessórios
          </p>
          <h2 className="cat-section-reveal mt-2 text-2xl font-medium text-foreground">
            Tacos, bolas, capas e mais
          </h2>
          <div className="cat-section-reveal mt-8">
            <SimpleProductList items={acessorios} />
          </div>
        </div>
      </section>
    </div>
  );
}
