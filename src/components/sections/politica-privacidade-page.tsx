const ATUALIZADO_EM = "4 de agosto de 2026";

export function PoliticaPrivacidadePage() {
  return (
    <div className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Política de Privacidade
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground md:text-5xl">
            Como tratamos seus dados
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Última atualização: {ATUALIZADO_EM}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl space-y-12 px-6 py-20 text-foreground">
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              1. Quem somos
            </h2>
            <p className="text-muted-foreground">
              A G1 Sul Bilhares é uma fabricante de mesas de sinuca sediada em
              Curitiba (PR), que atende clientes em Curitiba e Região
              Metropolitana. Este documento explica como tratamos dados
              pessoais em duas frentes: (i) o site público
              (siteg1sulbilhares.vercel.app) e (ii) um assistente interno de
              apoio à decisão que a equipe da G1 Sul Bilhares usa via
              WhatsApp, chamado internamente de &quot;Copiloto
              Executivo&quot;.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              2. Dados coletados no site
            </h2>
            <p className="text-muted-foreground">
              O formulário de contato do site coleta nome, produto de
              interesse, cidade e mensagem. Esses dados são usados apenas
              para montar uma mensagem que é aberta diretamente no WhatsApp
              do visitante, direcionada ao número comercial da G1 Sul
              Bilhares — não armazenamos esses dados em nenhum servidor ou
              banco de dados nosso.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              3. Assistente interno via WhatsApp (Copiloto Executivo)
            </h2>
            <p className="text-muted-foreground">
              O Copiloto Executivo é uma ferramenta de uso exclusivo da
              equipe da G1 Sul Bilhares — não é destinada a clientes e não
              está disponível publicamente. Apenas números de telefone
              autorizados internamente podem interagir com ela.
            </p>
            <p className="text-muted-foreground">
              Quando um número autorizado envia uma mensagem de texto para o
              número comercial de WhatsApp vinculado à ferramenta, o
              conteúdo da mensagem é processado para gerar uma recomendação
              de negócio (financeira, operacional ou estratégica). Esse
              processamento pode incluir:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Envio do texto da mensagem para os modelos de IA Google
                Gemini e Groq, para análise e geração de resposta.
              </li>
              <li>
                Pesquisa automática de casos semelhantes já resolvidos por
                outras empresas, via Tavily (busca web), quando relevante
                para a pergunta.
              </li>
              <li>
                Consulta e atualização de dados operacionais internos (como
                estoque e custos de produção) em um banco de dados Supabase.
              </li>
              <li>
                Registro do histórico da decisão (pergunta, categoria,
                impacto financeiro estimado e resposta final) no mesmo banco
                de dados Supabase, para fins de auditoria interna.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              4. Com quem compartilhamos dados
            </h2>
            <p className="text-muted-foreground">
              Para operar o Copiloto Executivo, dependemos dos seguintes
              provedores, que processam dados em nosso nome:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <span className="text-foreground">Meta (WhatsApp Cloud API)</span>{" "}
                — recebimento e envio das mensagens de WhatsApp.
              </li>
              <li>
                <span className="text-foreground">Google (Gemini)</span> e{" "}
                <span className="text-foreground">Groq</span> — geração das
                análises e recomendações via inteligência artificial.
              </li>
              <li>
                <span className="text-foreground">Tavily</span> — pesquisa
                web de casos semelhantes já resolvidos.
              </li>
              <li>
                <span className="text-foreground">Supabase</span> —
                armazenamento do banco de dados operacional e do histórico de
                decisões.
              </li>
              <li>
                <span className="text-foreground">Vercel</span> — hospedagem
                do site público.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Não vendemos nem compartilhamos dados pessoais com terceiros
              para fins de publicidade.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              5. Retenção e segurança
            </h2>
            <p className="text-muted-foreground">
              O histórico de decisões do Copiloto Executivo é mantido
              enquanto a ferramenta estiver em operação, para permitir
              auditoria interna das recomendações. O acesso ao banco de
              dados e às chaves de integração é restrito à equipe
              responsável pela G1 Sul Bilhares.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              6. Seus direitos
            </h2>
            <p className="text-muted-foreground">
              Você pode solicitar informações sobre os dados que tratamos,
              correção ou exclusão, entrando em contato pelo e-mail{" "}
              <a
                href="mailto:g1sulbilhares@gmail.com"
                className="text-accent hover:underline"
              >
                g1sulbilhares@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-foreground">
              7. Alterações nesta política
            </h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta política conforme a ferramenta evolui.
              A data no topo desta página indica a última atualização.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
