# Brazukas Delivery - Guia de Migração (Mock → Manus)

## 1. Visão Geral

Este documento descreve o plano de migração do MVP com dados mock para a plataforma Manus com banco de dados real, autenticação OAuth e infraestrutura escalável.

## 2. Arquitetura Alvo

### 2.1 Domínios e Coleções

| Coleção | Descrição | Índices |
|---------|-----------|---------|
| `users` | Clientes, lojistas, entregadores, admin | email, role, phone |
| `merchants` | Lojas/restaurantes | name, category, active, delivery_fee |
| `products` | Produtos por loja | merchant_id, active, price |
| `orders` | Pedidos (OMS) | merchant_id, client_id, status, created_at |
| `drivers` | Perfil de entregadores | online, rating, vehicle |
| `coupons` | Códigos e regras de desconto | code, active, type |

### 2.2 Storage Buckets

```
merchant-logos/
  merchant-{id}.png
  merchant-{id}-banner.png

receipts/
  order-{id}-receipt.pdf

proofs/
  order-{id}-delivery-proof.jpg
```

### 2.3 Pub/Sub Channels

```
admin/orders          → novos pedidos, eventos críticos
orders/{orderId}      → status_changed, driver_assigned, eta_updated
drivers/{driverId}    → online_status, new_order_assigned
```

## 3. Fases de Migração

### Fase 1: Infra & Secrets (Semana 1)

- [ ] Criar projeto Manus
- [ ] Definir `API_BASE_URL`, `JWT_SECRET` em Secrets
- [ ] Criar buckets `merchant-logos`, `receipts`, `proofs`
- [ ] Habilitar CORS para `https://brazukas.app` e admin
- [ ] Provisionar Pub/Sub para canais acima

### Fase 2: Banco e Índices (Semana 1-2)

```sql
-- users
CREATE TABLE users (
  id STRING PRIMARY KEY,
  email STRING UNIQUE NOT NULL,
  role ENUM('admin', 'merchant', 'driver', 'client') DEFAULT 'client',
  phone STRING,
  doc STRING,
  name STRING,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(email), INDEX(role)
);

-- merchants
CREATE TABLE merchants (
  id STRING PRIMARY KEY,
  name STRING NOT NULL,
  address STRING,
  lat FLOAT,
  lng FLOAT,
  category STRING,
  delivery_fee INT,
  logo STRING,
  banner STRING,
  active BOOLEAN DEFAULT true,
  owner_id STRING REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(active), INDEX(category)
);

-- products
CREATE TABLE products (
  id STRING PRIMARY KEY,
  merchant_id STRING REFERENCES merchants(id),
  name STRING NOT NULL,
  price INT NOT NULL,
  photo_url STRING,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(merchant_id), INDEX(active)
);

-- orders
CREATE TABLE orders (
  id STRING PRIMARY KEY,
  merchant_id STRING REFERENCES merchants(id),
  client_id STRING REFERENCES users(id),
  status ENUM(...) NOT NULL,
  items JSON NOT NULL,
  subtotal INT,
  delivery_fee INT,
  discount INT,
  total INT,
  driver_id STRING REFERENCES users(id),
  eta_min INT,
  timeline JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(merchant_id), INDEX(client_id), INDEX(status), INDEX(created_at)
);

-- drivers
CREATE TABLE drivers (
  id STRING REFERENCES users(id) PRIMARY KEY,
  vehicle STRING,
  online BOOLEAN DEFAULT false,
  rating FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(online)
);

-- coupons
CREATE TABLE coupons (
  id STRING PRIMARY KEY,
  code STRING UNIQUE NOT NULL,
  type ENUM('percent', 'fixed', 'free_shipping'),
  value INT,
  min INT,
  max_off INT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(code), INDEX(active)
);
```

### Fase 3: Funções (Semana 2-3)

**orders.create**
```
- Validar multiloja (rejeitar itens de lojas diferentes)
- Validar cupom (chamar coupons.validate)
- Calcular subtotal, discount, delivery_fee, total
- Criar timeline=[PAID|PENDING_PAYMENT] conforme método
- Publicar admin/orders:new
```

**orders.advance**
```
- Aplicar TRANSITIONS (regras de fluxo)
- Validar pré-condições (motorista obrigatório antes de ASSIGNED)
- Gerenciar eta_min (CONFIRMED/ASSIGNED/PICKED_UP/DELIVERED)
- Publicar orders/{id}:status_changed
```

**orders.assignDriver**
```
- Atribuir driver ao pedido
- Se status==CONFIRMED → ASSIGNED automaticamente
- Publicar orders/{id}:driver_assigned
```

**orders.setETA**
```
- Definir eta_min
- Publicar orders/{id}:eta_updated
```

**coupons.validate**
```
- Validar código
- Aplicar regras (percent/fixed/free_shipping)
- Retornar value, min, maxOff
```

### Fase 4: API Gateway (Semana 3)

**Opção A: Manus Direct**
- Rotear `/merchants`, `/products`, `/orders`, `/drivers`, `/coupons` para functions/DB

**Opção B: BFF (Backend for Frontend)**
- Manter Next.js API como BFF
- Conectar internamente à Manus
- Benefício: controle de lógica, rate limiting, logging centralizado

### Fase 5: Frontend (Semana 3-4)

- [ ] Substituir `API_MOCK` por `API_BASE_URL`
- [ ] Injetar `Authorization: Bearer <token>` em todas as requisições
- [ ] Substituir upload de logo por Storage (URL pública)
- [ ] Substituir polling do tracking por Pub/Sub (SSE/WebSocket)
- [ ] Atualizar admin login para usar Manus OAuth

### Fase 6: Qualidade & Segurança (Semana 4)

- [ ] Validações no backend (types, ranges, enum)
- [ ] Rate limit nos endpoints públicos (100 req/min)
- [ ] Logs estruturados com correlation-id
- [ ] Observabilidade: métricas de fila, latência, falhas
- [ ] Testes de integração com Manus

### Fase 7: Dados & Seed (Semana 4-5)

- [ ] Script de seed para merchants/products/coupons/drivers
- [ ] Importar imagens iniciais de banners/logos
- [ ] Validar dados de teste

### Fase 8: Go-live (Semana 5)

- [ ] Beta fechado: 10 lojas, 10 drivers, 100 clientes
- [ ] Runbook de incidentes
- [ ] Plano de reversão

## 4. Checklist Técnico

### Infra & Secrets
- [ ] `API_BASE_URL` definido
- [ ] `JWT_SECRET` gerado
- [ ] Buckets criados
- [ ] CORS habilitado
- [ ] Pub/Sub provisionado

### Banco e Índices
- [ ] Tabelas criadas
- [ ] Índices criados
- [ ] Relacionamentos validados

### Funções
- [ ] `orders.create` implementada
- [ ] `orders.advance` implementada
- [ ] `orders.assignDriver` implementada
- [ ] `orders.setETA` implementada
- [ ] `coupons.validate` implementada

### API Gateway
- [ ] Rotas configuradas
- [ ] CORS testado
- [ ] Rate limiting ativo

### Frontend
- [ ] `API_BASE_URL` integrado
- [ ] JWT injetado
- [ ] Storage integrado
- [ ] Pub/Sub integrado
- [ ] OAuth Manus integrado

### Qualidade
- [ ] Testes de integração passando
- [ ] Logs estruturados
- [ ] Observabilidade ativa
- [ ] Rate limiting testado

### Dados
- [ ] Seed executado
- [ ] Dados validados
- [ ] Imagens importadas

### Go-live
- [ ] Beta testado
- [ ] Runbook pronto
- [ ] Plano de reversão pronto

## 5. Exemplos de Migração

### Antes (Mock)
```typescript
// client/src/lib/api-mock.ts
export const merchants = [
  { id: "1", name: "Brasil Burgers", ... }
];
```

### Depois (Manus)
```typescript
// client/src/lib/api.ts
const API_BASE_URL = process.env.VITE_API_BASE_URL;

export async function getMerchants() {
  const res = await fetch(`${API_BASE_URL}/merchants`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}
```

## 6. Rollback Plan

Se algo der errado:

1. **Fase 1-2**: Reverter para mock, sem impacto
2. **Fase 3-4**: Manter BFF, voltar para mock internamente
3. **Fase 5+**: Manter polling, desabilitar Pub/Sub
4. **Go-live**: Reverter para beta, investigar

## 7. Contato & Suporte

- **Manus Docs**: https://docs.manus.im
- **API Reference**: `/openapi.yaml`
- **Support**: support@manus.im
