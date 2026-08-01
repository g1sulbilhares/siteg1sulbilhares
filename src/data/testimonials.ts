export type Testimonial = {
  name: string;
  quote: string;
};

// Depoimentos reais de clientes (enviados via WhatsApp/Instagram), com
// pequenas correções de português para leitura no site.
export const testimonials: Testimonial[] = [
  {
    name: "Wesley",
    quote: "Obrigado, vocês! Mesa muito top, curti!",
  },
  {
    name: "Cris",
    quote:
      "Todo dia jogo na mesma, já posso jogar contra o Baianinho de Mauá kkkk. A mesa está bem cuidada, não tenho o que reclamar dela — muito top a mesinha.",
  },
  {
    name: "Gilsnei",
    quote:
      "Uma experiência muito boa, a mesa é bem construída, dá pra ter uma ótima diversão.",
  },
  {
    name: "Bruna",
    quote:
      "Foi top, entrega rápida, produto bonito. Estamos aproveitando muito em família.",
  },
  {
    name: "Vaguinho",
    quote: "Mesa excelente!",
  },
];
