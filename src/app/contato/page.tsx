import type { Metadata } from "next";
import { ContatoPage } from "@/components/sections/contato-page";

export const metadata: Metadata = {
  title: "Contato | G1 Sul Bilhares",
  description:
    "Solicite seu orçamento de mesa de sinuca em Curitiba e Região Metropolitana pelo WhatsApp.",
};

export default function Contato() {
  return <ContatoPage />;
}
