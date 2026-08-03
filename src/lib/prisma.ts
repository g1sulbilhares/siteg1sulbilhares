import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Padrão singleton recomendado pela própria Prisma para Next.js: em
// desenvolvimento o módulo é recarregado a cada mudança de arquivo, e sem
// isso cada reload abriria uma conexão nova com o Postgres até esgotar o
// pool do Supabase.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 exige um driver adapter explicito em runtime (a connection
// string deixou de ser lida sozinha a partir do schema.prisma). Usamos
// DATABASE_URL (transaction pooler do Supabase, porta 6543) — já vem com
// `pgbouncer=true`, necessário para funcionar atrás do Supavisor.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
