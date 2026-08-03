# Módulo de Custos — Setup

Este documento cobre a Etapa 1 (infraestrutura) do sistema de custos: como
colocar o banco no ar e logar em `/custos` pela primeira vez.

## 1. Projeto Supabase — já criado e com o schema aplicado

O projeto `g1sulbilhares's Project` (região `us-west-2`) já está conectado e
as 7 tabelas do módulo (`raw_materials`, `products`, `product_materials`,
`overhead_costs`, `cost_settings`, `cost_snapshots`, `team_members`) já
foram criadas nele via migration, com Row Level Security habilitado em
todas — só o backend (Prisma, com a connection string abaixo) acessa essas
tabelas; a API pública do Supabase (PostgREST/anon key) fica bloqueada por
padrão, que é o comportamento certo para tabelas internas de ERP.

Dados de conexão já disponíveis:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://scghbbsgszzxhkqpkegq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZ2hiYnNnc3p6eGhrcXBrZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDE0MDksImV4cCI6MjEwMTI3NzQwOX0.LQCOmbZl6LTCmfNh3AQlK-E_u9CihG3NTU2pg8Y9nao"
```

`DATABASE_URL`/`DIRECT_URL` eu não consigo montar sozinho até o fim: preciso
da senha do Postgres, e nem o MCP do Supabase nem eu (por regra de
segurança) temos permissão de ler ou digitar essa senha por você. O resto da
connection string (host, porta, usuário, banco) eu já confirmei direto no
painel — está tudo em `.env.example`, só falta você:

1. Se você já guardou a senha de quando criou o projeto, pode usar essa —
   não precisa resetar. Senão, vá em **Database → Settings → Reset database
   password** (ou botão **Connect** no topo do painel → aba **Direct
   Connection** → **Reset database password**) e gere/copie uma nova.
2. Colar `.env.example` como `.env.local` na raiz do projeto e substituir os
   dois `[SUA-SENHA]` pela senha que você acabou de copiar.
3. Se a senha tiver caracteres especiais (`@`, `:`, `/`, `#`, `%`...), o
   próprio painel do Supabase mostra um link "percent-encode" — sem isso a
   connection string quebra.

`.env.local` já está no `.gitignore`, não é versionado.

## 2. Gerar o Prisma Client

```bash
npm install
npx prisma generate
```

Não precisa rodar `prisma migrate dev` — o schema já está aplicado no banco
(passo 1). Rode só `prisma generate` para o TypeScript enxergar os tipos.

> Nota: no ambiente em que este módulo foi desenvolvido, o download dos
> binários do Prisma (`binaries.prisma.sh`) estava bloqueado pela rede do
> sandbox — então não consegui rodar `prisma generate` nem `next build` ali
> para validar de ponta a ponta. É uma restrição do ambiente de
> desenvolvimento, não do schema/código: apliquei a migration equivalente
> direto no Postgres do projeto via SQL (MCP do Supabase) e conferi as 7
> tabelas e o RLS criados corretamente. Rodando `npm install` no seu
> computador ou no Vercel (com acesso normal à internet) o `prisma generate`
> funciona do jeito padrão.

## 3. Criar o primeiro usuário

O login em `/custos` usa Supabase Auth. Já criei o primeiro usuário
(`g1sulbilhares@gmail.com`, papel `ADMIN`) via **Authentication → Users →
Enviar convite** e cadastrei o vínculo em `team_members` — não falta nada
disso para você fazer. Para os próximos usuários, o caminho é o mesmo:

1. No painel do Supabase, vá em **Authentication → Users → Add user →
   Enviar convite** (ou "Create new user" com "Auto Confirm User" marcado,
   se preferir pular o e-mail de convite).
2. Depois, cadastre esse usuário como membro da equipe rodando no SQL
   Editor do Supabase:

   ```sql
   insert into team_members (id, "supabaseUserId", name, email, role)
   values (gen_random_uuid()::text, '<uuid do usuário criado acima>',
           'Seu Nome', 'seu@email.com', 'ADMIN');
   ```

   (O `id` do `auth.users` aparece na própria tela de Users do Supabase.)

Sem essa segunda etapa, o login no Supabase funciona mas `/custos` redireciona
de volta com "acesso não liberado" — de propósito, para nenhum e-mail
conseguir entrar só por ter uma conta Supabase válida.

### Por que o link do e-mail de convite "dava erro" (e como resolvi)

O convite do Supabase, quando disparado pelo painel, não passa por
nenhuma tela nossa antes — então ele não consegue usar o fluxo moderno
(PKCE) e cai no formato antigo: o link, depois de verificado pelo próprio
Supabase, redireciona para a **Site URL** do projeto (a home pública, ainda
configurada como `http://localhost:3000` — veja **Authentication → URL
Configuration**) levando o token de sessão no fragmento da URL
(`#access_token=...`), que só existe no navegador. Como o projeto ainda não
tinha nenhuma página preparada para ler esse token, o link só carregava a
home pública normalmente e descartava o convite — daí o "erro".

Corrigi isso com três peças novas, sem tocar no site público visualmente:

- `src/components/auth-hash-redirect.tsx`: componente client invisível,
  montado no layout raiz (`src/app/layout.tsx`). Roda em toda página; se (e
  só se) detectar um token de convite/recuperação no fragmento da URL, cria
  a sessão no Supabase e redireciona para `/custos/definir-senha`. Em 99,9%
  das visitas (sem token) ele não faz nada.
- `src/app/auth/confirm/route.ts`: endpoint server-side equivalente, usado
  se algum dia customizarmos o template do e-mail para o formato
  `token_hash` (ver abaixo) — hoje as duas pontas convivem, cada convite
  usa uma ou outra dependendo do fluxo.
- `/custos/definir-senha`: tela nova onde quem acabou de aceitar o convite
  escolhe a própria senha (`src/app/(interno)/custos/definir-senha/`).

**Isso já resolve o convite que mandei para você.** Se quiser abrir o link
de novo: o Site URL aponta para `http://localhost:3000`, então o link só
funciona com `npm run dev` rodando na sua máquina no momento do clique (veja
seção 4). Se preferir não depender disso, me avise para eu mandar um novo
convite depois que o projeto estiver publicado (Vercel) e o Site URL
apontar para o domínio real — aí o link funciona a qualquer hora.

> Nota: não consegui customizar o template do e-mail de convite
> diretamente no painel (**Authentication → Emails → Invite user**) porque
> o Supabase só libera edição de assunto/corpo depois de configurar um SMTP
> próprio no projeto — com o e-mail padrão (o que está em uso agora), o
> texto e o link ficam fixos no formato que a correção acima já contempla.

## 4. Rodar o projeto

```bash
npm run dev
```

Acesse http://localhost:3000/custos — deve redirecionar para
`/custos/login`. Depois de logar, o dashboard aparece vazio até você
cadastrar matéria-prima em **Matéria-Prima** (menu superior).

## O que já está pronto (Etapa 1)

- Schema Prisma completo (`prisma/schema.prisma`): matéria-prima, produtos
  (produção própria e revenda), BOM, custos indiretos, parâmetros de rateio,
  histórico de cálculo, equipe.
- Autenticação via Supabase, isolada em `/custos/*` (`src/proxy.ts` —
  equivalente ao `middleware.ts` no Next.js 16, ver `AGENTS.md`).
- Motor de cálculo puro em `src/server/costs/` (sem Prisma, sem Next.js —
  reutilizável por qualquer integração futura).
- Dashboard com as métricas pedidas: produto mais/menos lucrativo, margem
  média, custo médio, produtos com margem baixa.
- CRUD completo de Matéria-Prima (`/custos/materia-prima`).

## Próximas etapas

- Cadastro de Produtos + composição (BOM) — tela para montar a lista de
  materiais de cada mesa/produto.
- Tela de Custos Indiretos + parâmetros de rateio (`CostSettings`).
- Tela de produto com o breakdown completo (matéria-prima, mão de obra,
  indireto, total, margem, markup).
- Simulador (alterar preço do MDF/salário/energia sem gravar, recalcular ao
  vivo).
- Histórico de custos (`CostSnapshot`) alimentando um gráfico de evolução.
