# Guia de Deploy - Brazukas Delivery

Este projeto está configurado como uma **aplicação monolítica em Node.js**.
O servidor Express (`server/`) serve tanto a API quanto os arquivos estáticos do Frontend React (`client/`) quando em produção.

## 🏗️ Fluxo de Build

1. **Frontend**: O Vite compila o React para arquivos estáticos em `dist/public`.
2. **Backend**: O esbuild compila o servidor TypeScript para `dist/index.js`.
3. **Produção**: O comando `npm start` roda o `dist/index.js`, que expõe a API e serve o HTML do frontend.

## 🚀 Opção 1: Deploy com Docker (Recomendado - Easypanel/Railway/Render)

Crie um arquivo chamado `Dockerfile` na raiz do projeto com o seguinte conteúdo:

```dockerfile
# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY client/package.json ./client/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar todo o código fonte
COPY . .

# Construir o projeto (Frontend + Backend)
RUN pnpm build

# 2. Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar pnpm para rodar scripts se necessário (opcional, pois usaremos node direto)
# RUN corepack enable && corepack prepare pnpm@latest --activate

# Definir NODE_ENV para produção
ENV NODE_ENV=production

# Copiar apenas os arquivos construídos e dependências de produção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expor a porta 3000
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
```

### Configuração no Easypanel / Portainer / Railway

1. **Source**: Conecte seu repositório GitHub.
2. **Build Path**: Raiz (`/`).
3. **Porta**: 3000.
4. **Environment Variables**: Configure as variáveis abaixo.

## 🔑 Variáveis de Ambiente (Produção)

Configure estas variáveis no seu painel de hospedagem:

```env
# Servidor
NODE_ENV=production
PORT=3000

# Banco de Dados (Supabase Transaction Pooler é recomendado)
DATABASE_URL=postgres://postgres:[SENHA]@[HOST]:6543/postgres?pgbouncer=true

# Supabase (Auth & Realtime)
VITE_SUPABASE_URL=https://[ID-DO-PROJETO].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA-CHAVE-ANON-PUBLICA]

# Autenticação (JWT)
# Gere uma string aleatória longa para assinar tokens internos se houver
JWT_SECRET=[STRING-ALEATORIA-SEGURA]

# URLs da Aplicação (Para CORS e Redirecionamentos)
APP_URL=https://seu-dominio-de-producao.com
```

## ☁️ Opção 2: Deploy no Render (Automático)

Esta é a opção mais fácil. O projeto já inclui um arquivo `render.yaml`.

1. Crie uma conta no [Render.com](https://render.com).
2. Vá em **Blueprints** > **New Blueprint Instance**.
3. Conecte seu repositório GitHub.
4. O Render vai detectar automaticamente o arquivo `render.yaml` e pedir as variáveis de ambiente.
5. Preencha as variáveis (`DATABASE_URL`, `VITE_SUPABASE_URL`, etc).
6. Clique em **Apply**.

O Render vai rodar o build (`pnpm install && pnpm build`) e iniciar o servidor (`pnpm start`) automaticamente.

## ⚡ Opção 3: Deploy Frontend no Vercel (Híbrido)

Ideal se você quer CDN otimizada para o Frontend.
**Nota**: O Backend AINDA PRECISARÁ estar rodando em algum lugar (Opção 1 ou 2).

1. No [Vercel](https://vercel.com), importe o projeto do GitHub.
2. Nas configurações de **Build & Output Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (Deixe vazio/padrão)
   - **Build Command**: `npx vite build` (Compila apenas o Frontend)
   - **Output Directory**: `dist/public` (Configurado no vite.config.ts)
   - **Install Command**: `pnpm install`
3. Nas **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`: (Sua URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (Sua chave Anon)
   - `VITE_API_BASE_URL`: **URL completa do seu backend** (ex: `https://brazukas-backend.onrender.com`)

Dessa forma, o Frontend roda no Vercel e consome a API do seu backend no Render.

## 🖥️ Opção 4: Deploy Manual (VPS / Node.js)

Se você tem um servidor Linux com Node.js instalado:

1. Clone o repositório.
2. `pnpm install`
3. Certifique-se de que o `.env` de produção está configurado.
4. `pnpm build`
5. `pnpm start` (Recomendado usar PM2: `pm2 start dist/index.js --name brazukas`)
