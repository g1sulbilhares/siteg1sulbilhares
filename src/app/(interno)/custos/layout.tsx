import type { Metadata } from "next";

// Shell mínimo da área interna. Deliberadamente NÃO reaproveita
// <SiteHeader>/<SiteFooter> do site público (src/app/layout.tsx) — é uma
// área de sistema, não uma página institucional. Também não faz nenhuma
// checagem de autenticação aqui: por causa do Partial Rendering, layouts não
// re-renderizam a cada navegação, então a checagem de sessão fica em cada
// página (ver src/server/costs/require-team-member.ts), como recomenda o
// guia de autenticação do Next.js.
export const metadata: Metadata = {
  title: "Custos | G1 Sul Bilhares",
  robots: { index: false, follow: false },
};

export default function CustosRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
