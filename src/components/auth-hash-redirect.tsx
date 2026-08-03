"use client";

import { useEffect } from "react";

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
        `/custos/login?erro=link-invalido&motivo=hash-error-description&detalhe=${encodeURIComponent(errorDescription)}`
      );
      return;
    }

    if (!accessToken || !refreshToken) return;

    // Troca os tokens por uma sessão via `/auth/set-session` (server-side,
    // grava o cookie por `Set-Cookie` de verdade) em vez de chamar
    // `setSession()` direto no cliente — evita a corrida entre o cookie ser
    // persistido e a navegação para a próxima tela começar (ver comentário
    // detalhado em `src/app/auth/set-session/route.ts`).
    //
    // TEMPORÁRIO (diagnóstico): os parâmetros `motivo`/`status`/`detalhe`
    // anexados abaixo em cada caminho de falha não mudam o comportamento
    // pro usuário (a mensagem de erro na tela de login continua igual) —
    // servem só pra eu conseguir ver, pela URL que a pessoa reporta, em
    // qual ponto exato o fluxo quebrou. Remover depois de identificar a
    // causa raiz do "link inválido" que persiste mesmo com token válido.
    fetch("/auth/set-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          window.location.replace(
            `/custos/login?erro=link-invalido&motivo=set-session-failed&status=${res.status}&detalhe=${encodeURIComponent(body.slice(0, 200))}`
          );
          return;
        }

        window.location.replace(
          type === "invite" || type === "recovery"
            ? "/custos/definir-senha"
            : "/custos"
        );
      })
      .catch((err) => {
        window.location.replace(
          `/custos/login?erro=link-invalido&motivo=fetch-exception&detalhe=${encodeURIComponent(String(err?.message || err).slice(0, 200))}`
        );
      });
  }, []);

  return null;
}
