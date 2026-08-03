import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Chamado pelo `src/proxy.ts` (equivalente ao antigo middleware.ts a partir
 * do Next.js 16 — ver AGENTS.md) em toda requisição às rotas protegidas.
 * Faz uma checagem "otimista": só confirma que existe uma sessão válida via
 * cookie, sem bater no banco. Cada Server Action dentro de `/custos` ainda
 * deve validar a sessão de novo antes de mutar dados (ver
 * `src/server/costs/require-team-member.ts`).
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/custos/login";

  if (!user && !isLoginRoute) {
    const redirectUrl = new URL("/custos/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginRoute) {
    return NextResponse.redirect(new URL("/custos", request.url));
  }

  return response;
}
