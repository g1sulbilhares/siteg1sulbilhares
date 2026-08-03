import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Data Access Layer para a área /custos, no padrão recomendado pelo próprio
 * guia de autenticação do Next.js (ver
 * node_modules/next/dist/docs/01-app/02-guides/authentication.md#creating-a-data-access-layer-dal).
 *
 * O `proxy.ts` já bloqueia visitantes sem sessão nas rotas /custos/*, mas
 * essa é só uma checagem otimista (lê o cookie, não bate no banco). Toda
 * Server Action que muta dados deve chamar `requireTeamMember()` de novo —
 * é essa chamada que confirma no Postgres que o usuário é membro da equipe
 * e devolve o papel dele.
 *
 * `cache()` garante que, dentro do mesmo request, múltiplas chamadas não
 * disparam múltiplas consultas ao Supabase/Postgres.
 */
export const requireTeamMember = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/custos/login");
  }

  const teamMember = await prisma.teamMember.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!teamMember) {
    // Usuário tem login válido no Supabase mas ainda não foi cadastrado
    // como membro da equipe — acesso negado até alguém com papel ADMIN
    // cadastrá-lo em team_members.
    redirect("/custos/login?erro=sem-acesso");
  }

  return teamMember;
});
