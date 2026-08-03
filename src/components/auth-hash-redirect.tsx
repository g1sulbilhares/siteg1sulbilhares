"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Rede de segurança para os links de convite/recuperação de senha do
 * Supabase Auth.
 *
 * Convites disparados pelo painel do Supabase (Authentication → Users →
 * Enviar convite) não passam por nenhuma tela nossa antes de gerar o link —
 * por isso o Supabase não consegue usar o fluxo PKCE (que depende de um
 * "code_verifier" salvo no navegador de quem iniciou o fluxo) e cai no
 * formato antigo: o link, depois de verificado pelo Supabase, redireciona
 * para a Site URL do projeto (a home pública) com os tokens de sessão no
 * fragmento da URL (`#access_token=...&type=invite`), que só existe no
 * navegador — nenhum servidor consegue ler.
 *
 * Sem isso, o token chegava na home pública e nada o processava: o convite
 * "dava erro" (na prática, só carregava a home normal e descartava o token).
 *
 * Este componente roda em toda página pública (montado no layout raiz) e,
 * SEM alterar nada visualmente, verifica se a URL trouxe um desses tokens.
 * Se sim, cria a sessão no Supabase e manda o usuário para a tela certa:
 * `/custos/definir-senha` (convite/recuperação) ou `/custos` (demais
 * casos). Para 99,9% das visitas — sem token no hash — este componente não
 * faz nada.
 */
export function AuthHashRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const params = new URLSearchParams(hash.slice(1));
    const errorDescription = params.get("error_description");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (errorDescription) {
      window.location.replace(
        `/custos/login?erro=link-invalido&detalhe=${encodeURIComponent(errorDescription)}`
      );
      return;
    }

    if (!accessToken || !refreshToken) return;

    const supabase = createSupabaseBrowserClient();

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          window.location.replace("/custos/login?erro=link-invalido");
          return;
        }

        window.location.replace(
          type === "invite" || type === "recovery"
            ? "/custos/definir-senha"
            : "/custos"
        );
      });
  }, []);

  return null;
}
