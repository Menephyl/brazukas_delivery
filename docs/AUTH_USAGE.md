# Autenticação - Guia de Uso

## 🎯 Visão Geral

O sistema de autenticação foi configurado com suporte a:
- **JWT Local** (Desenvolvimento) - sem dependência externa
- **OAuth via Manus** (Produção) - quando `OAUTH_SERVER_URL` está configurado

## 🚀 Como Usar em Desenvolvimento

### 1. Login

```bash
# 1. Registrar um novo usuário (signup)
curl -X POST http://localhost:3000/api/trpc/auth.signup \
  -H 'Content-Type: application/json' \
  -d '{"input":{"name":"Test User","email":"test@brazukas.app","password":"securepassword"}}'

# Resposta esperada (sucesso)
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "message": "Usuário criado com sucesso."
      }
    }
  }
}

# 2. Fazer login com o usuário registrado
curl -X POST http://localhost:3000/api/trpc/auth.login \
  -H 'Content-Type: application/json' \
  -d '{"input":{"email":"test@brazukas.app","password":"securepassword"}}'

# Resposta esperada
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

### 2. Verificar Usuário Autenticado

```bash
curl -X POST http://localhost:3000/api/trpc/auth.me \
  -H 'Content-Type: application/json' \
  -d '{}'

# Com cookie automaticamente incluído (tRPC usa credentials: 'include')
```

### 3. Logout

```bash
curl -X POST http://localhost:3000/api/trpc/auth.logout \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## 📝 Frontend (React)

### useAuth Hook

```typescript
import { useAuth } from '@/_core/hooks/useAuth';

function MyComponent() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;

  return (
    <div>
      <p>Bem-vindo, {user.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## 🔒 Como Proteger Endpoints

### Backend (tRPC)

```typescript
// Público (sem autenticação)
publicProcedure.query(({ ctx }) => {
  return { message: "Qualquer um pode acessar" };
});

// Protegido (requer autenticação)
protectedProcedure.query(({ ctx }) => {
  return { userId: ctx.user.id, name: ctx.user.name };
});

// Admin (requer role admin)
adminProcedure.mutation(({ ctx }) => {
  return { message: `Ação de admin executada por ${ctx.user.name}` };
});
```

## 🔑 Configuração de Variáveis

### Desenvolvimento (.env.local)

```env
# Deixar vazio para usar JWT local
OAUTH_SERVER_URL=

# Senha segura para assinar JWTs
JWT_SECRET=dev_jwt_secret_key_12345678901234567890
```

### Produção

```env
# Configurar para usar Manus OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=seu-app-id-manus
JWT_SECRET=seu-jwt-secret-seguro

# Callback URL a registrar em Manus
# https://seu-dominio.com/api/oauth/callback
```

## 📊 Fluxo de Autenticação

### Modo Desenvolvimento (JWT Local)

```
1. Cliente chama auth.login(email, password)
2. Server valida credenciais
3. Server cria User no DB se não existir
4. Server assina JWT com JWT_SECRET
5. Server seta cookie HTTP-only (app_session_id)
6. Cliente envia cookie automaticamente nas requests
7. Server valida JWT e popula ctx.user
```

### Modo Produção (OAuth Manus)

```
1. Cliente redireciona para /api/oauth/callback?code=...&state=...
2. Server troca code por token via Manus
3. Server obtém user info de Manus
4. Server cria/atualiza User no DB
5. Server assina session token com JWT_SECRET
6. Server seta cookie HTTP-only
7. Resto igual ao modo desenvolvimento
```

## 🛡️ Segurança

- ✅ Tokens em cookies HTTP-only (não acessíveis via JavaScript)
- ✅ SameSite=none (permite cross-site quando necessário)
- ✅ Expiração automática (7 dias em dev, 1 ano em prod)
- ✅ User info sincronizado com DB
- ✅ Endpoints protegidos com tRPC procedures

## 🔄 Migração Dev → Prod

1. **Sem mudança de código** - aplicação funciona em ambos os modos
2. **Configure OAUTH_SERVER_URL** quando estiver pronto para produção
3. **Registre callback** em Manus: `https://seu-dominio.com/api/oauth/callback`
4. **Teste em staging** antes de deploy

## 🐛 Troubleshooting

### "Credenciais inválidas"

Credenciais padrão em desenvolvimento:
- Email: `admin@brazukas.app`
- Senha: `brazukas2025`

### "Invalid session cookie"

- Limpar cookies no navegador (DevTools → Storage → Cookies)
- Fazer login novamente
- Verificar se JWT_SECRET foi alterado (invalida tokens antigos)

### Endpoint retorna "Unauthorized"

- Verificar se endpoint é `protectedProcedure` ou `adminProcedure`
- Fazer login novamente
- Verificar se cookie está sendo enviado (DevTools → Network)

## 📚 Arquivos Importantes

- `server/_core/sdk.ts` - Validação JWT e fallbacks
- `server/routers/auth.ts` - Endpoints de autenticação
- `client/src/_core/hooks/useAuth.ts` - Hook React
- `server/_core/context.ts` - Contexto tRPC com usuário
- `.env.local` - Variáveis de ambiente
