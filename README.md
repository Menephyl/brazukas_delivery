# Brazukas Delivery - MVP

**O delivery da comunidade para a fronteira Brasil-Paraguai**

Brazukas Delivery é uma plataforma moderna de delivery que conecta clientes, lojas e entregadores em Ciudad del Este, Paraguai. Construída com React, TypeScript, tRPC e banco de dados MySQL.

## 🎯 Visão Geral

Este é o MVP (Minimum Viable Product) do Brazukas Delivery com todas as funcionalidades core implementadas:

- ✅ Listagem de lojas e produtos
- ✅ Carrinho e checkout com PIX/Dinheiro
- ✅ Rastreamento em tempo real com GPS
- ✅ Painel admin para gerenciamento
- ✅ App do entregador com GPS tracking
- ✅ Sistema de Proof of Delivery (POD)
- ✅ Cupons de desconto
- ✅ Avaliações de lojas
- ✅ Histórico de pedidos
- ✅ Programa de fidelidade
- ✅ Gateway de pagamento
- ✅ Notificações em tempo real
- ✅ Sistema de chat com suporte

## 🏗️ Stack Técnico

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **tRPC** - Type-safe RPC
- **Wouter** - Routing
- **Leaflet** - Maps

### Backend
- **Express.js** - Web framework
- **tRPC** - RPC framework
- **Drizzle ORM** - Database ORM
- **MySQL/TiDB** - Database
- **JWT** - Authentication

### Infraestrutura
- **Vite** - Build tool
- **pnpm** - Package manager
- **Manus** - Deployment platform

## 📋 Pré-requisitos

- Node.js 18+
- pnpm 8+
- MySQL 8+ ou TiDB

## 🚀 Setup Local

### 1. Clonar Repositório

```bash
git clone https://github.com/brazukas/delivery-mvp.git
cd brazukas_delivery
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/brazukas_delivery

# Auth
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Branding
VITE_APP_TITLE=Brazukas Delivery
VITE_APP_LOGO=https://example.com/logo.png

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 4. Setup do Banco de Dados

```bash
pnpm db:push
```

### 5. Iniciar Desenvolvimento

```bash
pnpm dev
```

Acesse http://localhost:3000

## 📁 Estrutura do Projeto

```
brazukas_delivery/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Store, Checkout, etc)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilitários e helpers
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx        # Router principal
│   └── index.html
├── server/                # Backend Express + tRPC
│   ├── routers/          # tRPC routers
│   │   ├── orders.ts     # Pedidos
│   │   ├── coupons.ts    # Cupons
│   │   ├── loyalty.ts    # Fidelidade
│   │   ├── payment.ts    # Pagamentos
│   │   ├── chat.ts       # Chat
│   │   └── ...
│   ├── db.ts             # Database helpers
│   ├── routers.ts        # Main router
│   └── _core/            # Framework internals
├── drizzle/              # Database schema & migrations
│   └── schema.ts
├── shared/               # Shared types & constants
├── storage/              # S3 helpers
├── userGuide.md          # User documentation
├── README.md             # This file
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints (tRPC)

### Autenticação
- `auth.me` - Obter usuário atual
- `auth.logout` - Fazer logout

### Pedidos
- `orders.create` - Criar novo pedido
- `orders.getById` - Obter detalhes do pedido
- `orders.list` - Listar pedidos do usuário
- `orders.updateStatus` - Atualizar status (admin)
- `orders.validatePOD` - Validar Proof of Delivery

### Lojas
- `merchants.list` - Listar lojas
- `merchants.getById` - Detalhes da loja
- `merchants.search` - Buscar lojas

### Produtos
- `products.list` - Listar produtos
- `products.getById` - Detalhes do produto
- `products.search` - Buscar produtos

### Cupons
- `coupons.list` - Listar cupons disponíveis
- `coupons.validate` - Validar cupom
- `coupons.getByCode` - Obter cupom por código

### Fidelidade
- `loyalty.getStatus` - Status do usuário
- `loyalty.earnPoints` - Ganhar pontos
- `loyalty.redeemPoints` - Resgatar pontos
- `loyalty.getHistory` - Histórico de transações

### Pagamentos
- `payment.createPaymentIntent` - Criar intenção de pagamento
- `payment.confirmPayment` - Confirmar pagamento
- `payment.getPaymentMethods` - Métodos disponíveis
- `payment.getTransactionHistory` - Histórico de transações

### Notificações
- `notifications.sendNotification` - Enviar notificação
- `notifications.getNotifications` - Listar notificações
- `notifications.markAsRead` - Marcar como lida

### Chat
- `chat.createConversation` - Criar conversa
- `chat.getConversations` - Listar conversas
- `chat.sendMessage` - Enviar mensagem

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

**users**
- id (PK)
- openId (unique)
- name, email
- role (user | admin)
- createdAt, updatedAt

**merchants** (lojas)
- id (PK)
- name, description
- category, rating
- address, phone
- createdAt, updatedAt

**products**
- id (PK)
- merchantId (FK)
- name, description
- price, image
- createdAt, updatedAt

**orders**
- id (PK)
- userId (FK)
- merchantId (FK)
- items (JSON)
- status (PENDING_PAYMENT, CONFIRMED, etc)
- totalAmount, discount
- address, paymentMethod
- createdAt, updatedAt

**coupons**
- id (PK)
- code (unique)
- discountType (percentage | fixed)
- discountValue
- minOrderValue
- maxUses, usedCount
- expiresAt
- isActive

**loyaltyProgram**
- id (PK)
- userId (FK, unique)
- points, cashback
- tier (bronze | silver | gold | platinum)
- totalSpent

**reviews**
- id (PK)
- userId (FK)
- merchantId (FK)
- rating (1-5)
- comment
- createdAt

**carts**
- id (PK)
- userId (FK, unique)
- items (JSON)
- couponCode
- totalAmount

## 🧪 Testes

### Rodar Testes

```bash
pnpm test
```

### Testes Unitários

```bash
pnpm test:unit
```

### Testes E2E

```bash
pnpm test:e2e
```

## 🚢 Deploy

### Build para Produção

```bash
pnpm build
```

### Deploy na Manus

```bash
# Fazer login
manus login

# Deploy
manus deploy
```

### Variáveis de Produção

Configure as variáveis de ambiente no painel de controle da Manus:
- DATABASE_URL (produção)
- JWT_SECRET (gerado)
- Todas as chaves de API

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Logs

Acesse `/admin/logs` para ver logs do sistema.

### Métricas

Acesse `/admin/metrics` para ver KPIs e gráficos.

## 🔐 Segurança

### Validações
- ✅ Validação de entrada em todos os endpoints
- ✅ Rate limiting para APIs
- ✅ CSRF protection
- ✅ XSS prevention

### Autenticação
- ✅ JWT com expiração
- ✅ Manus OAuth integrado
- ✅ Proteção de rotas

### Dados
- ✅ Criptografia de dados sensíveis
- ✅ SSL/TLS em produção
- ✅ Backup automático

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

### v1.0.0 (MVP)
- ✅ Listagem de lojas e produtos
- ✅ Carrinho e checkout
- ✅ Rastreamento em tempo real
- ✅ Painel admin
- ✅ App do entregador
- ✅ POD (Proof of Delivery)
- ✅ Cupons
- ✅ Avaliações
- ✅ Fidelidade
- ✅ Pagamentos
- ✅ Notificações
- ✅ Chat

## 📞 Suporte

- 📧 Email: dev@brazukas.delivery
- 💬 Discord: [Brazukas Community](https://discord.gg/brazukas)
- 🐛 Issues: [GitHub Issues](https://github.com/brazukas/delivery-mvp/issues)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- Manus por fornecer a infraestrutura
- Comunidade da fronteira Brasil-Paraguai
- Todos os contribuidores

---

**Feito com ❤️ para a comunidade da fronteira**

Brazukas Delivery © 2025
