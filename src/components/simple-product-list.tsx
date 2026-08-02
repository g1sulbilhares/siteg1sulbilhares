import { Button } from "@/components/ui/button";
import { formatBRL, type SimpleItem } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";

export function SimpleProductList({ items }: { items: SimpleItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      {items.map((item, i) => (
        <div
          key={item.name}
          className={`flex items-center justify-between gap-4 px-5 py-4 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <span className="text-sm text-foreground">{item.name}</span>
          <div className="flex shrink-0 items-center gap-4">
            <span className="font-mono text-sm text-muted-foreground">
              {formatBRL(item.priceCents)}
            </span>
            <Button asChild variant="outline" size="sm">
              <a
                href={whatsappLink(
                  `Olá, tenho interesse em: ${item.name}`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
