import { PrismaClient } from "@prisma/client";

// Padrão singleton recomendado pela própria Prisma para Next.js: em
// desenvolvimento o módulo é recarregado a cada mudança de arquivo, e sem
// isso cada reload abriria uma conexão nova com o Postgres até esgotar o
// pool do Supabase.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
