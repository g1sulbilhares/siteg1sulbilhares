import Link from "next/link";
import { requireTeamMember } from "@/server/costs/require-team-member";
import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";

// Todas as páginas deste grupo dependem de sessão (cookies) e consultam o
// banco por usuário — nunca podem ser pré-renderizadas estaticamente no
// build (o build da Vercel não tem acesso ao Postgres real). Forçar
// renderização dinâmica aqui cobre todas as rotas filhas de uma vez.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/custos", label: "Dashboard" },
  { href: "/custos/materia-prima", label: "Matéria-Prima" },
  // Próximas etapas do módulo — rotas ainda não implementadas:
  // { href: "/custos/produtos", label: "Produtos" },
  // { href: "/custos/indiretos", label: "Custos Indiretos" },
  // { href: "/custos/simulador", label: "Simulador" },
];

export default async function CustosAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checagem de sessão feita aqui (perto do que é renderizado), não no
  // layout raiz — ver comentário em custos/layout.tsx.
  const teamMember = await requireTeamMember();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/custos" className="text-sm font-medium text-foreground">
              G1 Sul Bilhares · Custos
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {teamMember.name}
            </span>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
