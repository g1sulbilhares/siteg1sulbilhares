export type Product = {
  slug: string;
  category: "Mesas de Sinuca" | "Acessórios";
  name: string;
  dims: string;
  priceCents: number;
  tagline: string;
  image: string;
};

export type SinucaSize = {
  slug: string;
  label: string;
  dims: string;
  priceCents: number;
  tagline: string;
};

export type SinucaColor = {
  name: string;
  hex: string;
  image: string;
};

// Fonte de verdade atual: preenchido manualmente. Formato pensado para
// futuramente ser substituído pela leitura da planilha "G1_Sul_Bilhares_Oficial"
// usada pelo projeto ia-vendedora, sem mudar o restante do site.
//
// O preço da mesa de sinuca varia pelo tamanho. A cor do tecido não muda o
// valor — é só uma escolha de acabamento.
export const sinucaSizes: SinucaSize[] = [
  {
    slug: "residencial-150",
    label: "Residencial 150",
    dims: "150 × 90 cm",
    priceCents: 145000,
    tagline: "Compacta, bonita e ideal para espaços menores",
  },
  {
    slug: "familiar-180",
    label: "Familiar 180",
    dims: "180 × 115 cm",
    priceCents: 179000,
    tagline: "O equilíbrio ideal entre espaço e jogabilidade",
  },
  {
    slug: "premium-230",
    label: "Premium 230",
    dims: "230 × 130 cm",
    priceCents: 235000,
    tagline: "Mais espaço de jogo e presença no ambiente",
  },
];

export const sinucaColors: SinucaColor[] = [
  { name: "Verde", hex: "#2f6b3a", image: "/images/instagram/post-8.jpg" },
  { name: "Vermelho", hex: "#b3272b", image: "/images/instagram/post-3.jpg" },
  { name: "Azul", hex: "#2451c4", image: "/images/instagram/post-6.jpg" },
];

export const pingPong: Product = {
  slug: "ping-pong",
  category: "Acessórios",
  name: "Mesa de Ping-Pong",
  dims: "Sob medida para a mesa",
  priceCents: 99000,
  tagline: "Mesa profissional de ping-pong",
  image: "/images/ping-pong.jpg",
};

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
