# Brazukas Delivery — Visão Geral da Aplicação e Plano de Implementação JWT (sem Manus)

Este documento reúne uma visão abrangente da aplicação, arquitetura, fluxo de dados, pontos de integração, convenções do projeto e um plano passo-a-passo para implementar autenticação JWT real localmente (sem Manus) — com checklist executável para "fazer hoje".

> Nota: você pediu para começar sem Manus — toda a seção de autenticação assume que vamos emitir e validar JWTs localmente (via `JWT_SECRET`) e usar cookies/Authorization headers para proteger endpoints tRPC.

---

## 1) Visão geral (big picture)

- Objetivo do projeto: plataforma de delivery (clientes, lojistas, entregadores, administradores) com frontend React + TypeScript e backend Express + tRPC; banco gerenciado via Drizzle ORM.
- Comunicação cliente↔servidor: tRPC sobre HTTP (endpoint montado em `/api/trpc`). O cliente usa `httpBatchLink` + `superjson` para chamadas tRPC.
- Runtime dev: `pnpm dev` inicia `tsx watch server/_core/index.ts` (Express + tRPC) e Vite dev server (frontend) integrados.
- Produção: `pnpm build` faz o build do client (Vite) e bundle do server com `esbuild` (bundle de `server/_core/index.ts` para `dist/index.js`).

Por que a arquitetura foi escolhida
- tRPC: tipagem compartilhada entre client/server → desenvolvimento mais rápido e menos erro de contratos.
- Drizzle ORM: queries tipadas e migrations (drizzle-kit) — adequado para um MVP focado em velocidade de desenvolvimento.
- Vite + React: dev fast refresh e bundling rápido.

---

## 2) Fluxo de dados e boundaries de serviço

- Frontend (client): roda em Vite dev server ou served static em produção; resolve rotas (wouter) e consome tRPC em `/api/trpc`.
- Backend (server): Express app que monta tRPC; também registra rotas OAuth e endpoints estáticos quando em produção.
- DB: Drizzle ORM (MySQL/TiDB) acessado via `server/db.ts` e migrations em `drizzle/`.
- Storage: integração S3 compatible (via `@aws-sdk/*`) para logos, receipts e proofs.
- Eventos: (planejado) Pub/Sub para status de pedidos/drivers — atualmente é parte do plano de migração.

Boundary importantes
- Autenticação/autorização: o backend decide se uma procedure tRPC é public/protected/admin usando `server/_core/trpc.ts`.
- Emissão de tokens: será responsabilidade do router `server/routers/auth.ts` (ou rota dedicada) quando implementarmos JWT.

---

## 3) Comandos e fluxo de desenvolvimento (essenciais)

- Instalar dependências: `pnpm install`
- Dev server: `pnpm dev` (inicia server + Vite)
- Build produção: `pnpm build`
- Start produção: `pnpm start` (executa `dist/index.js`)
- Lint/Typecheck: `pnpm check` (tsc)
- Tests: `pnpm test` (vitest)
- DB: `pnpm db:push` (drizzle-kit generate + migrate)

Dica: sempre que mudar variáveis em `.env.local`, reinicie o processo dev para que `dotenv/config` as leia.

---

## 4) Estrutura de pastas — explicação fora-a-fora (top-level)

Vou listar as pastas de nível superior e os arquivos mais relevantes e o que cada um faz.

- `client/`
  - `index.html` — documento HTML do frontend (template para Vite).
  - `public/` — assets estáticos servidos pelo Vite (manifest, sw, imagens públicas).
  - `src/` — código fonte do frontend (React + TS):
    - `main.tsx` — entrypoint que cria o trpc client e monta o App.
    - `App.tsx` — router principal (wouter) e providers (Theme, Tooltip, Toaster).
    - `const.ts`, `index.css` — constantes e estilos globais.
    - `components/` — componentes UI reutilizáveis (Header, Footer, AIChatBox, CartBar, etc.).
    - `pages/` — páginas (Home, StorePage, CheckoutPage, Admin pages, Driver app pages, etc.).
    - `lib/` — helpers e clients (por ex: `trpc` wrapper, API helpers).
    - `contexts/` — React contexts (Theme etc.).
    - `hooks/` — custom hooks.

- `server/`
  - `auth.ts` — helpers de autenticação (se presente; confira conteúdo para detalhes).
  - `db.ts` — conexão e helpers para DB (Drizzle client wrappers).
  - `health.ts`, `logs.ts`, `notify.ts`, `orders.ts`, `persist.ts` — endpoints/serviços utilitários.
  - `routers.ts` — arquivo que compõe o `appRouter` tRPC importando todos os routers modulares (orders, coupons, merchants, payment, etc.).
  - `storage.ts` — helpers para upload/download (S3 wrappers).
  - `_core/` — infra do servidor (detalhado abaixo).

- `server/_core/` (ponto crítico)
  - `index.ts` — entrypoint do servidor em dev; importa `dotenv/config`, inicia Express, registra OAuth routes, monta tRPC via `createExpressMiddleware`, usa Vite em dev ou serve static em prod; também contém lógica para procurar porta disponível.
  - `context.ts` — cria o contexto para tRPC; atualmente chama `sdk.authenticateRequest(req)` para popular `ctx.user`.
  - `trpc.ts` — wrapper `initTRPC`, define `publicProcedure`, `protectedProcedure`, `adminProcedure` (middlewares que verificam `ctx.user` e `user.role`).
  - `sdk.ts` — integração com serviços externos (OAuth/Manus SDK, helpers para tokens, troca de código OAuth, validação de JWT, etc.).
  - `env.ts` — mapeia `process.env` para um objeto `ENV` usado ao longo do server.
  - `vite.ts` — integra Vite dev server com Express (em dev) e serve static em produção.
  - `cookies.ts` — helpers para cookie/session.
  - `oauth.ts` — registro de rotas OAuth (callbacks);
  - `llm.ts`, `imageGeneration.ts`, `notification.ts` — integrações/serviços auxiliares.

- `drizzle/`
  - `schema.ts` — definição de tabelas/entidades Drizzle.
  - `migrations/` e arquivos SQL — histórico de migrations.

- `shared/`
  - `const.ts` — constantes compartilhadas (ex: messages, cookie names).
  - `types.ts` — tipos TS compartilhados entre client e server.
  - `_core/errors.ts` — erros customizados reusáveis.

- `infra/` — scripts e documentação infra (ex: `infra/phase1/` que criamos).

- raiz: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`, `README.md`, etc.

Observação: dentro de `server/routers/` existem muitos routers (orders, cart, chat, coupons, merchants, merchant-*). O padrão é criar um router por domínio e exportá-lo, depois adicioná-lo em `server/routers.ts` ao `appRouter`.

---

## 5) Arquivos chave para mudança/inspeção ao implementar JWT

- `server/_core/env.ts` — onde você confirma `JWT_SECRET` e `OAUTH_SERVER_URL` (vamos usar JWT_SECRET).
- `server/_core/sdk.ts` — contém funções para autenticação e validação de tokens; será o primeiro arquivo a adaptar para emitir/validar JWT localmente (sem Manus).
- `server/_core/context.ts` — usa `sdk.authenticateRequest(req)` para preencher `ctx.user` → manter, mas adaptar `sdk.authenticateRequest` para checar Header `Authorization: Bearer <token>` e cookie com nome `COOKIE_NAME`.
- `server/routers/auth.ts` — ideal para criar endpoints `auth.login`, `auth.logout`, `auth.refresh` (se for usar refresh tokens). Se não existir, crie-o e registre em `server/routers.ts`.
- `shared/const.ts` — verifique `COOKIE_NAME`, `UNAUTHED_ERR_MSG`, `NOT_ADMIN_ERR_MSG` para compatibilidade com lógicas cliente/servidor.
- `client/src/main.tsx` — já contém redirecionamento para login quando `UNAUTHED_ERR_MSG` é retornado — ajuste fluxos de login para receber e persistir o token.

---

## 6) Plano passo-a-passo e checklist executável para implementar JWT HOJE (sem Manus)

Objetivo do dia: emitir e validar JWT localmente, proteger rotas tRPC com `protectedProcedure`, e permitir login básico para testes locais.

Resumo das etapas — alto nível
1. Gerar `JWT_SECRET` seguro e colocá-lo em `.env.local` (ou `.env.secrets`).
2. Implementar endpoints de login/logout em `server/routers/auth.ts` (emitir JWT via `SignJWT` do pacote `jose`).
3. Adaptar `server/_core/sdk.ts` (ou criar `server/_core/jwt.ts`) com funções `issueToken(payload)`, `verifyToken(token)` e `authenticateRequest(req)` que setam `ctx.user`.
4. Ajustar `server/_core/context.ts` para usar `sdk.authenticateRequest` (se já não usar) e preencher `user` no contexto do tRPC.
5. Atualizar `clie/auth` (ou `client/src/lib/trpc` ou `client/src/main.tsx`) para armazenar token em cookie HTTP-only (preferível) ou localStorage (mais simples para dev), e enviar token com `fetch` (o client trpc já usa `credentials: 'include'` – privilégie cookie).
6. Testar fluxo: login → chamar `orders.create` (protected) → ver usuário no servidor.
7. (Opcional) Implementar `refresh` token se quiser manter sessões por longos períodos.

Checklist detalhado (Execute hoje — ordem sugerida)

- [ ] 0. Backup e verificação
  - [ ] Commitar mudanças locais e garantir branch `main` limpa.

- [ ] 1. Gerar JWT_SECRET
  - [ ] Execute `infra/phase1/gennt/src/liberate-secrets.sh` ou `openssl rand -hex 48`.
  - [ ] Atualize `.env.local` com `JWT_SECRET=<valor-gerado>`.

- [ ] 2. Implementar endpoint de login (server)
  - [ ] Criar/editar `server/routers/auth.ts`:
    - [ ] `auth.login` (publicProcedure) — aceita `{ openId, password }` ou apenas `openId` para dev (mock) e retorna `{ token }`.
    - [ ] Use `SignJWT` (jose) para emitir token com claims: `sub = user.id`, `name`, `role`, `iat/exp` (ex.: exp = now + 7d).
    - [ ] Opcional: setar cookie HTTP-only `res.cookie(COOKIE_NAME, token, cookieOptions)`.

  Exemplo simplificado (trecho):

  ```ts
  import { SignJWT } from 'jose';
  import { router, publicProcedure } from '../_core/trpc';
  import { ENV } from '../_core/env';

  export const authRouter = router({
    login: publicProcedure
      .input(z.object({ openId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // localizar usuário no DB (ou criar mock)
        const user = await findOrCreateUserByOpenId(input.openId);

        const token = await new SignJWT({ name: user.name, role: user.role, openId: user.openId })
          .setProtectedHeader({ alg: 'HS256' })
          .setSubject(String(user.id))
          .setIssuedAt()
          .setExpirationTime('7d')
          .sign(Buffer.from(ENV.cookieSecret, 'utf-8'));

        // retornar token
        return { token };
      }),
  });
  ```

- [ ] 3. Implementar verificação de token (server)
  - [ ] Em `server/_core/sdk.ts` (ou `server/_core/jwt.ts`) implemente `verifyToken(token)` usando `jwtVerify` (jose) com `ENV.cookieSecret`.
  - [ ] `authenticateRequest(req)` deve procurar token `Authorization: Bearer <token>` ou cookie `<COOKIE_NAME>`, chamar `verifyToken`, buscar `user` no DB por `openId`/`sub` e retornar user object (ou null).

  Exemplo simplificado:
  ```ts
  import { jwtVerify } from 'jose';
  import { ENV } from './env';

  export async function verifyToken(token: string) {
    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const { payload } = await jwtVerify(token, secret);
    return payload; // claims
  }
  ```

- [ ] 4. Preencher contexto tRPC (server)
  - [ ] `server/_core/context.ts` já chama `sdk.authenticateRequest(req)`; garanta que ela retorne `User | null`.
  - [ ] `protectedProcedure` e `adminProcedure` (em `server/_core/trpc.ts`) já levantam erros quando `ctx.user` ausente ou role != admin — apenas verifique compatibilidade de fields (role string etc.).

- [ ] 5. Ajustar cliente (frontend)
  - [ ] Decidir armazenamento: cookie HTTP-only (mais seguro) ou localStorage (mais simples para dev).
  - [ ] Se usar cookie: servidor deve setar cookie no login response e tRPC `fetch` já usa `credentials: 'include'` (ver `client/src/main.tsx`) — nada adicional necessário.
  - [ ] Se usar Bearer token: atualizar `client/src/main.tsx` `httpBatchLink.fetch` para incluir `Authorization: Bearer ${token}` no header.
  - [ ] Workflow de login: página de login envia credenciais para `auth.login`; no retorno: se cookie, redirecionar; se token, armazenar e redirecionar.

- [ ] 6. Testes rápidos
  - [ ] Testar login: chamar `auth.login` e inspecionar response/cookie.
  - [ ] Testar protected: chamar `orders.list` com token/cookie e confirmar retorno autorizado.

- [ ] 7. Hardening básico (pós-prova)
  - [ ] Expiração de token adequada (ex.: 7 dias), logout (remover cookie), refresh tokens (se necessário).
  - [ ] Blacklist de tokens (opcional) e rotação de `JWT_SECRET` com estratégia de rollback.

---

## 7) Exemplo concreto de patches/códigos a aplicar (arquivos e trechos)

1) Criar `server/routers/auth.ts` (se não existir). Exemplo mínimo:

```ts
// server/routers/auth.ts
import { z } from 'zod';
import { router, publicProcedure } from '../_core/trpc';
import { SignJWT } from 'jose';
import { ENV } from '../_core/env';
import { findUserByOpenIdOrCreate } from '../db';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ openId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByOpenIdOrCreate(input.openId);
      const secret = new TextEncoder().encode(ENV.cookieSecret);

      const token = await new SignJWT({ openId: user.openId, name: user.name, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

      // Opcional: set cookie
      ctx.res?.cookie('brazukas_session', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });

      return { token };
    }),
});
```

2) Atualizar `server/_core/sdk.ts` (adicionar verifyToken e verify middleware). Exemplo:

```ts
import { jwtVerify } from 'jose';
import { ENV } from './env';

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(ENV.cookieSecret);
  const { payload } = await jwtVerify(token, secret);
  return payload as Record<string, any>;
}

export async function authenticateRequest(req: Request) {
  const authHeader = req.headers['authorization'];
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
  // fallback: cookie
  if (!token) {
    const cookieHeader = req.headers['cookie'];
    if (cookieHeader) {
      const cookies = parseCookieHeader(cookieHeader);
      token = cookies['brazukas_session'];
    }
  }
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    // buscar usuário no DB por payload.sub ou payload.openId
    const user = await db.findUserByOpenId(payload.openId as string);
    return user ?? null;
  } catch (err) {
    return null;
  }
}
```

3) Confirmar `server/_core/context.ts` usa `sdk.authenticateRequest` e retorne `user` corretamente (já faz):

```ts
export async function createContext(opts) {
  let user = null;
  try { user = await sdk.authenticateRequest(opts.req); } catch (e) { user = null; }
  return { req: opts.req, res: opts.res, user };
}
```

4) Cliente: se preferir cookies, não precisa alterar (trpc client usa `credentials: 'include'`). Se preferir Bearer, altere o `fetch` usado pelo `httpBatchLink` para injetar header `Authorization` com token lido de `localStorage`.

---

## 8) Testes e validação local (passos rápidos após implementar)

1. `pnpm install`
2. Atualize `.env.local` com `JWT_SECRET` gerado.
3. `pnpm dev`
4. Em outro terminal, chamar via `curl` para login (exemplo de bearer):

```bash
curl -X POST http://localhost:3000/api/trpc/auth.login -H 'Content-Type: application/json' --data '{"input": {"openId": "dev-user"}}'
```

5. Receber token e testar endpoint protegido:

```bash
curl -X POST http://localhost:3000/api/trpc/orders.list -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' --data '{}'
```

6. Alternativa (cookie): inspecione cookies retornados pelo `auth.login` e repita chamada com `--cookie "brazukas_session=$TOKEN"`.

---

## 9) Riscos e pontos de atenção

- Segurança: não comitar `JWT_SECRET` em repositório. Use vault/secrets manager na produção.
- Revogação: JWTs não são fáceis de revogar; implemente blacklist/short lived tokens + refresh tokens se necessário.
- CSRF: se usar cookies http-only, proteja endpoints usando SameSite e CSRF protections para operações sensíveis.
- Logout: para cookies, limpe cookie; para bearer, remover token localmente.

---

## 10) Próximos passos sugeridos

- Implementar o fluxo básico hoje (seguir checklist). Depois:
  - Implementar refresh tokens e rotação de chaves.
  - Integrar provider SSO (se futuro desejar Manus/Manus-like OAuth), mantendo a mesma estratégia JWT no backend.
  - Escrever testes unitários para `authenticateRequest` e integração para `auth.login` + protected routes.

---

Se quiser, eu já aplico os arquivos de exemplo (`server/routers/auth.ts`, `server/_core/jwt.ts`) e testo localmente — diga se autoriza que eu execute comandos no seu ambiente (instalação e start). Ou indique se prefere que eu apenas gere os arquivos e você rode os comandos.

