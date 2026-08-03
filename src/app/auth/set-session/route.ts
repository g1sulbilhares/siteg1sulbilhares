import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Endpoint server-side para trocar os tokens do fragmento da URL
// (`#access_token=...&refresh_token=...`) por uma sessão real, com o
// cookie de sessão gravado via cabeçalho `Set-Cookie` de uma resposta HTTP
// de verdade — em vez de `document.cookie` escrito pelo JS do navegador.
//
// Por quê: o `auth-hash-redirect.tsx` chamava `setSession()` direto no
// cliente (Supabase browser client) e, assim que a Promise resolvia, já
// navegava para `/custos/definir-senha` com `window.location.replace`. Na
// prática isso é uma corrida: o Supabase confirmava o link certinho (login
// aparecia nos logs de auth), mas às vezes o cookie ainda não tinha sido
// persistido no navegador no exato instante em que a navegação começava —
// daí a página seguinte (renderizada no servidor) não via sessão nenhuma e
// mandava de volta pro login com "link inválido/expirado", mesmo o link
// tendo sido válido segundos antes.
//
// Com esse endpoint, o `fetch` só resolve DEPOIS que o `Set-Cookie` já
// chegou na resposta — o navegador aplica o cookie antes mesmo do
// JavaScript ler o corpo da resposta. Só então o componente navega.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const accessToken = body?.access_token as string | undefined;
  const refreshToken = body?.refresh_token as string | undefined;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "missing_tokens" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
