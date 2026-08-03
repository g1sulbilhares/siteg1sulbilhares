import { SetPasswordForm } from "./set-password-form";

// Passo final do convite: chega aqui só depois que src/app/auth/confirm
// já trocou o token do e-mail por uma sessão válida. Deliberadamente fora
// do grupo (app) — não tem nav nem exige linha em team_members ainda (o
// ADMIN que convidou já cadastra isso antes de mandar o convite).
export default function DefinirSenhaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-medium text-foreground">
          Defina sua senha
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          G1 Sul Bilhares · área restrita à equipe
        </p>

        <SetPasswordForm />
      </div>
    </div>
  );
}
