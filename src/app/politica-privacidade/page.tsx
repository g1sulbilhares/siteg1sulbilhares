import type { Metadata } from "next";
import { PoliticaPrivacidadePage } from "@/components/sections/politica-privacidade-page";

export const metadata: Metadata = {
  title: "Política de Privacidade | G1 Sul Bilhares",
  description:
    "Como a G1 Sul Bilhares coleta, usa e protege dados no site e no assistente interno via WhatsApp.",
};

export default function PoliticaPrivacidade() {
  return <PoliticaPrivacidadePage />;
}
