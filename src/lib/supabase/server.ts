import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route
 * Handlers. Cada chamada lê os cookies da requisição atual — por isso não é
 * um singleton como o `prisma`, tem que ser criado a cada request.
 *
 * Uso: `const supabase = await createSupabaseServerClient()`
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component (sem acesso de escrita
            // a cookies). Inofensivo: o proxy.ts abaixo já cuida de manter a
            // sessão atualizada a cada requisição.
          }
        },
      },
    }
  );
}
