import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Endpoint de confirmação server-side (padrão recomendado pelo guia de auth
// SSR do Supabase). Troca o `token_hash` enviado por e-mail (convite,
// recuperação de senha, etc.) por uma sessão válida — sem isso, o link do
// e-mail cai direto na Site URL sem nenhuma sessão criada, e o usuário nunca
// consegue definir a senha.
//
// Fora do matcher do `src/proxy.ts` (só cobre /custos/:path*) de propósito:
// esta rota precisa ser acessível sem sessão prévia, já que é ela quem cria
// a sessão a partir do token do e-mail.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      // Convite ou recuperação de senha: usuário ainda precisa escolher uma
      // senha antes de usar o login normal (e-mail + senha).
      redirectTo.pathname =
        type === "invite" || type === "recovery"
          ? "/custos/definir-senha"
          : "/custos";
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/custos/login";
  redirectTo.searchParams.set("erro", "link-invalido");
  return NextResponse.redirect(redirectTo);
}
