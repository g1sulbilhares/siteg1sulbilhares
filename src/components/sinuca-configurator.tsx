"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sinucaColors, sinucaSizes, formatBRL } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";

export function SinucaConfigurator() {
  const [sizeIndex, setSizeIndex] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);

  const size = sinucaSizes[sizeIndex];
  const color = sinucaColors[colorIndex];

  return (
    <div className="grid gap-10 rounded-lg border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={color.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={color.image}
              alt={`Mesa de sinuca G1, tecido ${color.name.toLowerCase()}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 font-mono text-[11px] tracking-wide text-foreground">
          {size.dims}
        </span>
      </div>

      <div className="flex flex-col justify-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Monte a sua
        </p>
        <h3 className="mt-2 text-2xl font-medium text-foreground md:text-3xl">
          Mesa de Sinuca G1
        </h3>
        <p className="mt-3 text-muted-foreground">{size.tagline}</p>

        <div className="mt-6 border-t border-line pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Tamanho
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sinucaSizes.map((s, i) => (
              <button
                key={s.slug}
                onClick={() => setSizeIndex(i)}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  i === sizeIndex
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-line text-muted-foreground hover:border-line-strong hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cor do tecido
          </p>
          <div className="mt-3 flex items-center gap-3">
            {sinucaColors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIndex(i)}
                aria-label={c.name}
                title={c.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors"
                style={{
                  borderColor: i === colorIndex ? "var(--accent)" : "transparent",
                }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.hex }}
                >
                  {i === colorIndex && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </span>
              </button>
            ))}
            <span className="text-sm text-muted-foreground">{color.name}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <span className="text-2xl font-medium text-foreground">
            {formatBRL(size.priceCents)}
          </span>
          <Button asChild>
            <a
              href={whatsappLink(
                `Olá, tenho interesse na Mesa de Sinuca ${size.label} (${size.dims}), tecido ${color.name}`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir esta mesa
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
