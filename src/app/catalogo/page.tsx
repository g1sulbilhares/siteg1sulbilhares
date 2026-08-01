import type { Metadata } from "next";
import { CatalogPage } from "@/components/sections/catalog-page";

export const metadata: Metadata = {
  title: "Catálogo | G1 Sul Bilhares",
  description:
    "Compare os modelos de mesa de sinuca e acessórios da G1 Sul Bilhares e solicite seu orçamento pelo WhatsApp.",
};

export default function Catalogo() {
  return <CatalogPage />;
}
