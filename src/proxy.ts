import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

// Renomeado de middleware.ts para proxy.ts — convenção do Next.js 16 (ver
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// Só roda nas rotas internas: o site público continua 100% estático e
// intocado por esse arquivo.
export function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/custos/:path*"],
};
