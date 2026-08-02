import Image from "next/image";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/tilt-card";
import { formatBRL, type Product } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <TiltCard className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-line-strong">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 25vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-line-strong" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 font-mono text-[11px] tracking-wide text-foreground">
          {product.dims}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {product.category}
          </p>
          <h3 className="text-xl font-medium text-foreground">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-medium text-foreground">
            {formatBRL(product.priceCents)}
          </span>
          <Button asChild variant="outline" size="sm">
            <a
              href={whatsappLink(
                `Olá, tenho interesse na ${product.name} (${product.dims})`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conhecer modelo
            </a>
          </Button>
        </div>
      </div>
    </TiltCard>
  );
}
