"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SetPasswordState = { error?: string } | undefined;

export async function setPassword(
  _prevState: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não são iguais." };
  }

  const supabase = await createSupabaseServerClient();

  // Só funciona se já existir uma sessão válida — criada pelo
  // src/app/auth/confirm/route.ts a partir do token do e-mail de convite.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/custos/login?erro=link-invalido");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Não foi possível salvar a senha. Tente novamente." };
  }

  redirect("/custos");
}
