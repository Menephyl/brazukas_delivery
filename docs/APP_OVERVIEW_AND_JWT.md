# Brazukas Delivery — Visão Geral e Arquitetura (Atualizado)

Este documento foi atualizado para refletir o estado atual do projeto, onde abandonamos o plano de JWT local em favor do **Supabase Auth**.

## 1. Visão Geral Atual

O **Brazukas Delivery** é uma plataforma de delivery focada na fronteira Brasil-Paraguai.

*   **Frontend**: React (Vite), Wouter (Routing), Context API, Shadcn UI, TailwindCSS.
*   **Backend**: Express + tRPC.
*   **Banco de Dados**: Drizzle ORM (Supabase/PostgreSQL ou MySQL).
*   **Autenticação**: **Supabase Auth** (Client-side) + Validação de Token (Backend - *Em Progresso*).

## 2. Autenticação com Supabase

### Frontend (Implementado)
O cliente utiliza a SDK oficial do Supabase (`@supabase/supabase-js`) configurada em `client/src/lib/supabase.ts`.

*   **AuthContext**: (`client/src/contexts/AuthContext.tsx`) Gerencia o estado da sessão (`user`, `session`, `loading`). Ouve por mudanças de estado (`onAuthStateChange`) e provê funções de `signIn` e `signUp`.
*   **Login/Register**: As páginas `Login.tsx` e `Register.tsx` chamam diretamente a API do Supabase.
*   **Rotas Protegidas**: O frontend protege rotas cruciais verificando se `user` existe no contexto. Se não, redireciona para `/auth`.

### Backend (Integração)
O backend trpc (`server/_core/trpc.ts`) possui middlewares `protectedProcedure` que verificam `ctx.user`.
*   **Estado Atual**: O `context.ts` atualmente tenta autenticar a requisição via `sdk.authenticateRequest`.
*   **Necessário**: Para completa segurança, o backend deve validar o JWT (Access Token) enviado pelo cliente Supabase no header `Authorization`.

## 3. Navegação e UI

*   **Header**: Exibe o nome do usuário logado e oferece links rápidos.
*   **Modal "Em Breve"**: Um componente reutilizável (`ComingSoonModal`) é usado em links de rodapé (Instagram, Sobre Nós) e em funcionalidades ainda não implementadas (Filtros de Menu, Cadastro de Parceiro).
*   **Loja (StorePage)**: Exibe produtos e permite adicionar ao carrinho. Possui estado vazio com botão "Solicitar Cardápio" (que abre o modal).

## 4. Estrutura de Pastas Chave

*   **`client/src`**
    *   `components/`: Componentes UI reutilizáveis.
    *   `pages/`: Páginas da aplicação (`StorePage`, `OrderPage`, `Auth`, etc.).
    *   `contexts/`: Gerenciamento de estado global (`AuthContext`).
    *   `lib/`: Configurações de serviços externos (`supabase.ts`, `trpc.ts`).

*   **`server`**
    *   `_core/`: Infraestrutura do servidor (Contexto, tRPC setup).
    *   `routers/`: Definição das rotas da API tRPC (`orders`, `merchants`, etc.).
    *   `orders.ts`: (Legado/Híbrido) Lógica de pedidos em memória, sendo migrada para DB.

## 5. Próximos Passos (Roadmap Imediato)

1.  **MVP de Rastreamento (Real-Time)**:
    *   Migrar dados de `orders` (memória) para tabelas reais no Drizzle (`drizzle/schema.ts`).
    *   Implementar `DriverAppPage` com envio de geolocalização.
    *   Configurar **Supabase Realtime** para atualizar a posição do entregador no mapa do cliente instantaneamente.

2.  **Refinamento do Backend**:
    *   Garantir que todas as rotas protegidas no tRPC validem corretamente o token do Supabase.

3.  **App do Entregador/Parceiro**:
    *   Implementar fluxos reais de cadastro e gestão de pedidos.

---
*Atualizado em: 08/12/2025 para substituir o antigo plano "JWT sem Manus".*
