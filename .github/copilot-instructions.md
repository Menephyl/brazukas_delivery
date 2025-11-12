## Brazukas Delivery — Instruções para agentes de código

Siga estas diretrizes curtas e práticas para ser produtivo neste repositório.

- Raiz do projeto: `client/` (frontend) e `server/` (backend). O build/dev é orquestrado a partir do `package.json` na raiz.
- Principais arquivos para entender a arquitetura: `README.md`, `package.json`, `vite.config.ts`, `server/_core/index.ts`, `server/routers.ts`, `server/_core/trpc.ts`, `server/_core/context.ts`, `client/src/main.tsx`, `client/src/App.tsx`.

1) Objetivo rápido
- Projeto: plataforma de delivery (React + TypeScript frontend; Express + tRPC backend; Drizzle ORM para DB). O servidor expõe a API tRPC em `/api/trpc` e serve o frontend via Vite em modo dev.

2) Comandos essenciais (use `pnpm`)
- Instalar dependências: `pnpm install`
- Rodar em desenvolvimento (server + vite): `pnpm dev` — roda `tsx watch server/_core/index.ts` e acopla o Vite dev server.
- Gerar migrações / sincronizar DB: `pnpm db:push` (usa `drizzle-kit`).
- Build produção: `pnpm build` (Vite build do client + esbuild bundle do servidor).
- Testes: `pnpm test` (Vitest). Há targets separados (`test:unit`, `test:e2e`) listados no README.

3) Arquitetura e padrões importantes
- Frontend
  - Local: `client/src`. Router principal em `client/src/App.tsx` (usa `wouter`).
  - tRPC client está configurado em `client/src/main.tsx` apontando para `/api/trpc` e usando `httpBatchLink` + `superjson`.
  - Import aliases (vite): `@` => `client/src`, `@shared` => `shared` (veja `vite.config.ts`). Prefira essas aliases ao criar imports.

- Backend
  - Entrypoint de dev: `server/_core/index.ts` (inicia Express, registra rotas OAuth e monta tRPC em `/api/trpc`). Em dev usa Vite middleware; em produção serve `dist/public` estático.
  - Routers: modularizados em `server/routers/*.ts`. Para adicionar um novo endpoint tRPC: crie `server/routers/foo.ts` e exporte um router; então importe e adicione em `server/routers.ts` ao `appRouter`.
  - Procedimentos tRPC: use `publicProcedure`, `protectedProcedure` e `adminProcedure` definidos em `server/_core/trpc.ts` para aplicar autenticação/autorização padrão.
  - Contexto: `server/_core/context.ts` chama `sdk.authenticateRequest(req)` para popular `ctx.user`. Checar `sdk` se precisar entender autenticação.

4) Convenções de projeto observadas
- Tipagem compartilhada em `shared/` (usar interfaces/tipos de lá para evitar duplicação entre client/server).
- Migrations e schema centralizados em `drizzle/schema.ts` e pasta `drizzle/`.
- Código server bundlado para produção com `esbuild` (veja script `build`): bundle do `server/_core/index.ts` para `dist/index.js`.
- Variáveis de ambiente e segredos configurados via `.env.local` (README lista nomes como `DATABASE_URL`, `JWT_SECRET`, `VITE_*`).
- Existe um patch em `patches/wouter@3.7.1.patch` e `pnpm` patchedDependencies — não remova sem revisar o motivo.

5) Integrações & pontos de atenção
- tRPC: endpoints expostos em `/api/trpc`. Ao depurar chamadas cliente -> servidor, observe `client/src/main.tsx` e o middleware Express em `server/_core/index.ts`.
- Auth: JWT + Manus OAuth (ver `server/oauth.ts` e `server/_core/context.ts`). Erros com `UNAUTHED_ERR_MSG` são tratados no cliente (redirecionamento para login em `main.tsx`).
- DB: Drizzle ORM + `drizzle-kit` para migrações (`pnpm db:push`). Ver `drizzle/` para migrations e `drizzle/schema.ts`.
- Uploads & limites: o servidor aumenta limites de body-parser para `50mb` (veja `server/_core/index.ts`).

6) Exemplos rápidos (como editar/estender)
- Adicionar router tRPC:
  - criar `server/routers/newFeature.ts` exportando `const newFeatureRouter = router({ ... })`
  - importar em `server/routers.ts` e adicionar `newFeature: newFeatureRouter` ao `appRouter`

- Proteger rota:
  - use `protectedProcedure` para endpoints que precisam de usuário autenticado
  - use `adminProcedure` para checagem de role 'admin' (veja `server/_core/trpc.ts`).

7) Erros comuns e como diagnosticar
- Se o frontend recarrega sem conectar ao backend em dev: verifique `pnpm dev` (server deve inicializar Vite middleware). Ports podem mudar se 3000 ocupado — `server/_core/index.ts` procura porta disponível e loga qual está usando.
- 401/UNAUTHED: cliente redireciona para login quando recebe `UNAUTHED_ERR_MSG` (ver `client/src/main.tsx`). Ver fluxo de cookies/headers e `sdk.authenticateRequest` no servidor.
- Problemas de import path: prefira aliases (`@`, `@shared`) para evitar caminhos relativos longos.

8) Onde eu (agente) posso buscar mais contexto
- Explorar `server/routers/` para exemplos concretos de patterns de validação/entrada e chamadas ao DB.
- Ver `client/src/components/` para padrões de UI (shadcn/ui + Tailwind).
- Ler `drizzle/` para mapear entidades e constraints do banco.

Se algo estiver incompleto ou você quiser que eu inclua exemplos adicionais (p.ex. como escrever um teste Vitest padrão para um router), diga o que prefere e eu atualizo este arquivo.
