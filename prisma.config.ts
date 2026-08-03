import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: a connection string usada pelo CLI (migrate, db pull, etc.)
// vive aqui, não mais em prisma/schema.prisma. Usamos DIRECT_URL (conexão
// direta/session mode) porque é a recomendada para o CLI — a aplicação em
// si usa DATABASE_URL (transaction pooler) via driver adapter, ver
// src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
