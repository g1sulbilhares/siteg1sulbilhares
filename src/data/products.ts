export type Product = {
  slug: string;
  category: string;
  name: string;
  dims: string;
  priceCents: number;
  tagline: string;
  image?: string;
};

export type SinucaMaterial = {
  name: "MDF" | "Pedra Ardósia";
  priceCents: number;
};

export type SinucaSize = {
  slug: string;
  label: string;
  dims: string;
  tagline: string;
  materials: SinucaMaterial[];
};

export type SinucaColor = {
  name: string;
  hex: string;
  image: string;
};

export type SimpleItem = {
  name: string;
  priceCents: number;
};

// Fonte de verdade: planilha "G1_Sul_Bilhares_Oficial" (Google Sheets),
// aba Catálogo de Produtos. Formato pensado para futuramente ser lido
// direto da planilha pelo projeto ia-vendedora, sem mudar o site.
//
// O preço da mesa de sinuca varia por tamanho e material do tampo. A cor
// do tecido não muda o valor — é só uma escolha de acabamento.
export const sinucaSizes: SinucaSize[] = [
  {
    slug: "residencial-150",
    label: "Residencial 150",
    dims: "150 × 90 cm",
    tagline: "Compacta, bonita e ideal para espaços menores",
    materials: [{ name: "MDF", priceCents: 109000 }],
  },
  {
    slug: "175",
    label: "175",
    dims: "175 × 105 cm",
    tagline: "Um meio-termo com ótimo acabamento",
    materials: [{ name: "MDF", priceCents: 145000 }],
  },
  {
    slug: "familiar-180",
    label: "Familiar 180",
    dims: "180 × 115 cm",
    tagline: "O equilíbrio ideal entre espaço e jogabilidade",
    materials: [
      { name: "MDF", priceCents: 155000 },
      { name: "Pedra Ardósia", priceCents: 255000 },
    ],
  },
  {
    slug: "190",
    label: "190",
    dims: "190 × 120 cm",
    tagline: "Mais espaço de jogo com jogabilidade de sobra",
    materials: [
      { name: "MDF", priceCents: 175000 },
      { name: "Pedra Ardósia", priceCents: 275000 },
    ],
  },
  {
    slug: "premium-230",
    label: "Premium 230",
    dims: "230 × 130 cm",
    tagline: "Mais espaço de jogo e presença no ambiente",
    materials: [
      { name: "MDF", priceCents: 195000 },
      { name: "Pedra Ardósia", priceCents: 295000 },
    ],
  },
];

export const sinucaColors: SinucaColor[] = [
  { name: "Verde", hex: "#2f6b3a", image: "/images/instagram/post-8.jpg" },
  { name: "Vermelho", hex: "#b3272b", image: "/images/instagram/post-3.jpg" },
  { name: "Azul", hex: "#2451c4", image: "/images/instagram/post-6.jpg" },
];

export const otherTables: Product[] = [
  {
    slug: "pebolim",
    category: "Pebolim",
    name: "Mesa de Pebolim",
    dims: "Padrão",
    priceCents: 210000,
    tagline: "Mesa de pebolim profissional",
    image: "/images/instagram/post-1.jpg",
  },
  {
    slug: "carteado",
    category: "Mesa de Carteado",
    name: "Mesa de Carteado",
    dims: "Padrão",
    priceCents: 120000,
    tagline: "Mesa de carteado padrão, fabricação própria",
  },
];

// Tênis de mesa: 12 variações reais (com/sem rodinha, 3 espessuras de
// tampo, tamanho oficial ou menor).
export const tenisDeMesa: SimpleItem[] = [
  { name: "Com rodinha 15mm — Oficial 274×152 cm", priceCents: 129000 },
  { name: "Com rodinha 15mm — Menor 185×120 cm", priceCents: 89000 },
  { name: "Com rodinha 18mm — Oficial 274×152 cm", priceCents: 149000 },
  { name: "Com rodinha 18mm — Menor 185×120 cm", priceCents: 99000 },
  { name: "Com rodinha 25mm — Oficial 274×152 cm", priceCents: 199000 },
  { name: "Com rodinha 25mm — Menor 185×120 cm", priceCents: 139000 },
  { name: "Sem rodinha 15mm — Oficial 274×152 cm", priceCents: 119000 },
  { name: "Sem rodinha 15mm — Menor 185×120 cm", priceCents: 79000 },
  { name: "Sem rodinha 18mm — Oficial 274×152 cm", priceCents: 139000 },
  { name: "Sem rodinha 18mm — Menor 185×120 cm", priceCents: 89000 },
  { name: "Sem rodinha 25mm — Oficial 274×152 cm", priceCents: 189000 },
  { name: "Sem rodinha 25mm — Menor 185×120 cm", priceCents: 129000 },
];

export const acessorios: SimpleItem[] = [
  { name: "Taco Ipê Padrão 1,5m — Unitário", priceCents: 4500 },
  { name: "Taco Ipê Padrão 1,5m — Kit 2", priceCents: 9000 },
  { name: "Taco Ipê Padrão 1,5m — Kit 3", priceCents: 13500 },
  { name: "Taco Ipê Padrão 1,5m — Kit 4", priceCents: 18000 },
  { name: "Taco Ipê Padrão 1,5m — Kit 5", priceCents: 22500 },
  { name: "Taco Ipê Padrão 1,5m — Kit 6", priceCents: 27000 },
  { name: "Taco Ipê 1m — Unitário", priceCents: 3500 },
  { name: "Taco Ipê 1m — Kit 2", priceCents: 7000 },
  { name: "Taco Ipê 1m — Kit 3", priceCents: 10500 },
  { name: "Taco Ipê 1m — Kit 4", priceCents: 14000 },
  { name: "Tacos de Time (conjunto)", priceCents: 15900 },
  { name: "Taqueira para 6 Tacos", priceCents: 8000 },
  { name: "Taqueira p/ 6 Tacos — Madeira Maciça Queimada", priceCents: 12000 },
  { name: "Kit de Bola 50mm", priceCents: 16000 },
  { name: "Kit de Bola 54mm", priceCents: 18000 },
  { name: "Bola Branca Avulsa 50mm", priceCents: 2500 },
  { name: "Bola Branca Avulsa 54mm", priceCents: 2500 },
  { name: "Capa Curta de Mesa de Sinuca", priceCents: 12000 },
  { name: "Capa Longa de Mesa de Sinuca", priceCents: 18000 },
  { name: "Caçapa Anel Branco (kit 6)", priceCents: 8000 },
  { name: "Caçapa Anel Vermelho (kit 6)", priceCents: 8000 },
  { name: "Tampo de Jantar", priceCents: 35000 },
  { name: "Tampo de Jantar + Kit Ping Pong", priceCents: 39000 },
];

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
