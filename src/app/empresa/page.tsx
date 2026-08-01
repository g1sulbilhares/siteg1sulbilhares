import type { Metadata } from "next";
import { EmpresaPage } from "@/components/sections/empresa-page";

export const metadata: Metadata = {
  title: "A empresa | G1 Sul Bilhares",
  description:
    "Conheça a G1 Sul Bilhares: fabricação própria de mesas de sinuca em Curitiba e Região Metropolitana, com atendimento direto da fábrica.",
};

export default function Empresa() {
  return <EmpresaPage />;
}
