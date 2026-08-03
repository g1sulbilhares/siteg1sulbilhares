import "dotenv/config";
import { defineConfig } from "prisma/config";

// A connection string real (DIRECT_URL) só é obrigatória para comandos que
// falam com o banco (`prisma migrate`, `prisma db push`, etc.). O comando
// `prisma generate` — que roda no `postinstall` do build da Vercel — só lê
// o schema e gera os tipos TypeScript, sem se conectar a nada. Por isso,
// em vez de `env("DIRECT_URL")` (que falha o build inteiro se a variável
// ainda não foi cadastrada no projeto Vercel), usamos um fallback: se
// DIRECT_URL não estiver definida, o `generate` segue normalmente; só um
// `prisma migrate` real exigiria a variável de verdade.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
