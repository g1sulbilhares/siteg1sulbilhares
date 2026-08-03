import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-medium text-foreground">
          Acesso interno — Custos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          G1 Sul Bilhares · área restrita à equipe
        </p>

        {params.erro === "sem-acesso" && (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Seu login é válido, mas você ainda não tem acesso liberado a este
            módulo. Peça para um administrador te cadastrar.
          </p>
        )}

        {params.erro === "link-invalido" && (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Esse link de convite/recuperação expirou ou já foi usado. Peça um
            novo convite para um administrador.
          </p>
        )}

        <LoginForm next={params.next} />
      </div>
    </div>
  );
}
