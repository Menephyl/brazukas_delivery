# OAuth e Autenticação - Guia de Configuração

## 📋 Visão Geral

O Brazukas Delivery suporta dois modos de autenticação:

1. **Modo Local (Desenvolvimento)**: Usa JWT local quando `OAUTH_SERVER_URL` não está configurado
2. **Modo OAuth (Produção)**: Integra com Manus OAuth quando `OAUTH_SERVER_URL` é fornecido

## 🚀 Configuração Rápida (Desenvolvimento)

### 1. Variáveis de Ambiente

Crie ou atualize `.env.local`:

```env
# Deixar vazio para usar autenticação local (JWT)
OAUTH_SERVER_URL=

# JWT Secret (usar comando abaixo para gerar seguro)
JWT_SECRET=your-secret-key-here

# Outras variáveis
DATABASE_URL=mysql://user:password@localhost:3306/brazukas_delivery
VITE_APP_ID=dev-app-id
```

### 2. Gerar JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -hex 32

# Ou use o script do projeto
bash infra/phase1/generate-secrets.sh
```

### 3. Iniciar Servidor de Desenvolvimento

```bash
pnpm install
pnpm dev
```

O servidor agora aceitará login local via `auth.login`:

```bash
# Testar login
node test-auth.js

# Ou com curl
curl -X POST http://localhost:3000/api/trpc/auth.login \
  -H 'Content-Type: application/json' \
  -d '{"input": {"email": "admin@brazukas.app", "password": "brazukas2025"}}'
```

## 🔐 Fluxo de Autenticação Local

1. **Login**: Cliente chama `auth.login` com email/password
2. **Token Emitido**: Servidor retorna JWT assinado com `JWT_SECRET`
3. **Cookie HTTP-only**: Token é automaticamente setado em cookie seguro
4. **Requests Subsequentes**: Cookie é enviado automaticamente (tRPC usa `credentials: 'include'`)
5. **Validação**: `sdk.authenticateRequest()` verifica JWT e popula `ctx.user`

## 🌍 Configuração OAuth (Manus)

Para usar OAuth via Manus:

### 1. Criar Projeto Manus

- Acesse [Manus Console](https://console.manus.im)
- Crie novo projeto
- Obtenha credenciais

### 2. Atualizar `.env.local`

```env
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-manus-app-id
JWT_SECRET=your-jwt-secret
```

### 3. Configurar OAuth Callback

- Registre callback: `https://brazukas.app/api/oauth/callback`
- Permitir CORS para frontend URLs

### 4. Testar OAuth Flow

```bash
# Chamar endpoint de autorização (redirecionará para portal Manus)
curl http://localhost:3000/api/oauth/authorize?redirect_uri=http://localhost:3000

# Após aprovar, callback retorna com session cookie
```

## 📝 Endpoints de Autenticação

### Login Local

```typescript
POST /api/trpc/auth.login

Input:
{
  "input": {
    "email": "admin@brazukas.app",
    "password": "brazukas2025"
  }
}

Response:
{
  "result": {
    "data": {
      "json": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "success": true
      }
    }
  }
}
```

### Me (Obter Usuário Autenticado)

```typescript
POST /api/trpc/auth.me

Response:
{
  "result": {
    "data": {
      "json": {
        "id": 1,
        "openId": "admin",
        "name": "Admin User",
        "email": "admin@brazukas.app",
        "role": "admin",
        "loginMethod": "local",
        "createdAt": "2025-11-13T00:00:00Z"
      }
    }
  }
}
```

### Logout

```typescript
POST /api/trpc/auth.logout

Response:
{
  "result": {
    "data": {
      "json": {
        "success": true
      }
    }
  }
}
```

## 🛡️ Segurança

### Modo Desenvolvimento

- ✅ JWT_SECRET em `.env.local` (não commitado)
- ✅ Cookies HTTP-only + SameSite=lax
- ✅ Expiração de 7 dias

### Modo Produção (Manus OAuth)

- ✅ OAuth via plataforma segura
- ✅ Session tokens com expiração de 1 ano
- ✅ CSRF protection automático

### Checklist de Segurança

- [ ] Nunca commitar `JWT_SECRET`
- [ ] Usar HTTPS em produção
- [ ] Rodar `pnpm db:push` para sincronizar schema
- [ ] Testar logout limpa cookies
- [ ] Validar token expiration

## 🔄 Migração: Desenvolvimento → Produção

1. **Fase de Desenvolvimento**: Use modo local (sem OAUTH_SERVER_URL)
2. **Antes de Deploy**: 
   - Configure `OAUTH_SERVER_URL` em variáveis de produção
   - Mantenha `JWT_SECRET` (usado para fallback)
   - Teste fluxo OAuth completo

3. **Deploy**:
   - Código funciona com ambos os modos automaticamente
   - Se `OAUTH_SERVER_URL` vazio → usa JWT local
   - Se `OAUTH_SERVER_URL` definida → usa OAuth

## 🐛 Troubleshooting

### Erro: "Invalid session cookie"

```
Causa: Cookie não está sendo enviado ou JWT está inválido
Solução:
- Verificar JWT_SECRET em .env.local
- Limpar cookies no navegador (DevTools → Application → Cookies)
- Fazer login novamente
```

### Erro: "[OAuth] ERROR: OAUTH_SERVER_URL is not configured"

```
Causa: OAUTH_SERVER_URL vazio (comportamento esperado em dev)
Solução:
- Isso é normal! Use autenticação local
- Para OAuth, configure OAUTH_SERVER_URL
```

### Erro: "User not found after sync"

```
Causa: Usuário não foi criado no DB
Solução:
- Verificar DATABASE_URL
- Rodar pnpm db:push
- Verificar logs do servidor
```

## 📚 Referências

- [JWT.io](https://jwt.io) - Validar tokens
- [Manus Docs](https://docs.manus.im) - Documentação OAuth
- [OWASP - Auth](https://owasp.org/www-community/authentication) - Boas práticas

