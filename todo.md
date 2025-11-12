# Brazukas Delivery - Project TODO

## Etapa 1: Setup + Home + Listagem de lojas (mock)
- [x] Configurar design system (cores, tipografia, componentes base)
- [x] Criar layout base (Header, Footer, Navigation)
- [x] Implementar API mock para lojas (/api/merchants)
- [x] Implementar API mock para produtos (/api/products/[merchantId])
- [x] Desenvolver página Home com hero section e listagem de lojas
- [x] Criar componente StoreCard
- [x] Implementar utilitários de carrinho (localStorage)
- [x] Criar componente CartBar (flutuante no rodapé)

## Etapa 2: Página da loja + produtos + carrinho
- [x] Desenvolver página da loja (/store/[id])
- [x] Criar componente ProductCard
- [x] Implementar adicionar/remover itens do carrinho
- [x] Implementar visualização do carrinho com atualização em tempo real
- [x] Adicionar imagens de teste (placeholder ou picsum)

## Etapa 3: Checkout + tracking básico
- [x] Desenvolver página de checkout (/checkout)
- [ ] Implementar formulário de endereço de entrega
- [ ] Implementar formulário de dados do cliente
- [x] Implementar finalização de pedido (mock)
- [ ] Criar API para salvar pedidos (/api/orders)
- [ ] Desenvolver página de tracking de pedidos
- [ ] Implementar status de pedido em tempo real (mock)

## Etapa 4: Integração com backend Manus
- [ ] Integrar autenticação Manus OAuth
- [ ] Criar schema de banco de dados (merchants, products, orders, users)
- [ ] Migrar dados mock para banco de dados
- [ ] Integrar APIs reais com tRPC
- [ ] Implementar proteção de rotas autenticadas
- [ ] Implementar painel de lojista (básico)

## Etapa 5: Refinamentos e features adicionais
- [ ] Implementar filtros de categoria
- [ ] Adicionar busca de lojas/produtos
- [ ] Implementar avaliações de lojas
- [ ] Adicionar histórico de pedidos do usuário
- [ ] Implementar notificações de status do pedido
- [ ] Otimizações de performance
- [ ] Testes de responsividade mobile
- [ ] Deploy e publicação

## Design & UX
- [ ] Paleta de cores: Verde #006A3A, Amarelo #F4C542, Branco #FFFFFF
- [ ] Tipografia: Inter ou Poppins
- [ ] Ícones: arredondados e minimalistas
- [ ] Layout: responsivo e mobile-first
- [ ] Animações: leves e fluidas
- [ ] Acessibilidade: WCAG 2.1 AA

## Bugs & Issues
(Nenhum registrado no momento)

## Etapa 3 (Continuação): Sistema de Pedidos e Tracking
- [x] Criar lib/orders.ts com gerenciamento de pedidos em memória
- [x] Implementar API de pedidos (/api/orders)
- [x] Implementar API de detalhes de pedido (/api/orders/[id])
- [x] Criar API de entregadores (/api/drivers)
- [x] Atualizar checkout para criar pedido e redirecionar para tracking
- [x] Desenvolver página de tracking de pedido (/order/[id])
- [x] Implementar polling de status do pedido
- [x] Desenvolver painel admin (/admin) com gerenciamento de pedidos
- [x] Implementar atribuição de entregador
- [x] Implementar definição de ETA
- [x] Implementar validação de transições de status
- [x] Exibir motorista e ETA no tracking do cliente

## Etapa 4: Integração com Banco de Dados Manus
- [ ] Criar schema de banco de dados para merchants
- [ ] Criar schema de banco de dados para products
- [ ] Criar schema de banco de dados para orders
- [ ] Criar schema de banco de dados para drivers
- [ ] Migrar dados mock para banco de dados
- [ ] Integrar APIs reais com tRPC
- [ ] Implementar proteção de rotas autenticadas
- [ ] Implementar painel de lojista

## Etapa 5: Refinamentos e Features Adicionais
- [ ] Implementar filtros de categoria
- [ ] Adicionar busca de lojas/produtos
- [ ] Implementar avaliações de lojas
- [ ] Adicionar histórico de pedidos do usuário
- [ ] Implementar notificações de status do pedido
- [ ] Otimizações de performance
- [ ] Testes de responsividade mobile
- [ ] Deploy e publicação

## Etapa 3 (Melhorias Avançadas): Validações, ETA Automático e Cupons
- [x] Implementar cálculo automático de ETA baseado em preparo + deslocamento
- [x] Adicionar validação de pré-condições (motorista obrigatório antes de ASSIGNED)
- [x] Desabilitar botão Avançar status quando faltar motorista
- [x] Adicionar mini-mapa mock no tracking
- [x] Implementar barra de progresso visual no tracking
- [x] Criar página de login admin com senha mock
- [x] Implementar proteção simples de rotas admin com localStorage
- [x] Implementar bloqueio multiloja no carrinho
- [x] Criar API de cupons mock
- [x] Implementar aplicação de cupons no checkout
- [x] Suportar cupons de desconto percentual
- [x] Suportar cupons de desconto fixo
- [x] Suportar cupons de frete grátis

## Etapa 4: Persistência de Dados, PDF e Upload de Logos
- [x] Implementar persistência local de pedidos em JSON
- [x] Criar API de exportação de PDF de pedidos
- [x] Adicionar botão de download de PDF no tracking
- [x] Adicionar botão de download de PDF no painel admin
- [ ] Implementar upload de logo de lojista
- [ ] Criar página de gerenciamento de logos (/admin/merchants)
- [ ] Exibir logo do lojista na Home
- [ ] Exibir logo do lojista na página da loja
- [ ] Integrar logos na API de merchants

## Etapa 5: Design System, i18n, JWT Auth e OpenAPI
- [x] Implementar design system com tokens Tailwind (cores, tipografia, shadows)
- [x] Criar componentes reutilizáveis (Button, Card, Input, Select, Badge)
- [x] Implementar i18n PT/ES com localStorage
- [x] Criar LocaleSwitcher component
- [x] Implementar JWT auth com endpoints /api/auth/login e /api/auth/me
- [x] Atualizar admin login para usar JWT real
- [x] Atualizar admin guard para validar JWT
- [x] Criar documentação OpenAPI 3.1
- [x] Documentar mapa de integração Manus
- [x] Criar checklist de migração mock → Manus

## Etapa 6: Camada de Abstração API (Adapters Mock ↔ Manus)
- [x] Criar .env.local com NEXT_PUBLIC_USE_MOCK e NEXT_PUBLIC_API_BASE_URL
- [x] Criar lib/config.ts com USE_MOCK e API_BASE_URL
- [x] Criar lib/http.ts com apiFetch wrapper
- [x] Criar lib/api/merchants.ts adapter
- [x] Criar lib/api/products.ts adapter
- [x] Criar lib/api/orders.ts adapter
- [x] Criar lib/api/drivers.ts adapter
- [x] Criar lib/api/coupons.ts adapter
- [ ] Atualizar Home para usar adapter de merchants
- [ ] Atualizar StorePage para usar adapters
- [ ] Atualizar CheckoutPage para usar adapter de orders
- [ ] Atualizar OrderPage para usar adapter de orders
- [ ] Atualizar AdminPage para usar adapters
- [ ] Testar switch USE_MOCK=true/false sem quebrar

## Etapa 7: Health Check, Fallback e Painel de Monitoramento
- [x] Criar lib/health.ts com checkBackend()
- [x] Integrar health check no http.ts wrapper
- [x] Criar lib/logs.ts com persistência em JSON
- [x] Criar API /api/health para mock
- [x] Criar API /api/logs para persistência e listagem
- [x] Integrar logging automático no http.ts
- [x] Criar página /admin/health com status Manus/Mock
- [x] Criar página /admin/logs com filtro por nível
- [ ] Adicionar links no AdminPage para health e logs
- [x] Testar fallback automático (Manus offline → mock)
- [ ] Criar .env.example com variáveis necessárias
- [ ] Criar script seed.js para popular dados na Manus

## Etapa 8: Métricas, KPIs, Gráficos e Alertas
- [x] Instalar dependência recharts
- [x] Criar API /api/metrics com cálculo de KPIs
- [x] Criar página /admin/metrics com gráficos
- [x] Implementar filtro de janela temporal (6h, 12h, 24h, 48h, 7d)
- [x] Criar lib/notify.ts para webhooks (Telegram, Discord, Slack)
- [x] Criar API /api/healthwatch para monitoramento
- [x] Implementar alertas de backend offline
- [x] Implementar alertas de pico de erros
- [ ] Adicionar links de navegação entre admin pages
- [ ] Testar métricas com pedidos mock
- [ ] Testar alertas via webhook


## Etapa 9: Métricas Avançadas, Ranking e Exportação CSV
- [x] Criar lib/metrics.ts com núcleo de cálculo reutilizável
- [x] Implementar cálculo de SLA por etapa (PAID→CONFIRMED, etc)
- [x] Criar agregações por loja e por entregador
- [x] Criar API /api/metrics/detailed com filtros (start, end, merchantId)
- [x] Criar API /api/metrics/export para exportação CSV
- [x] Implementar ranking por SLA total (menor é melhor)
- [x] Criar página /admin/metrics-advanced com filtros de data
- [x] Adicionar botões de exportação CSV (lojas e entregadores)
- [x] Implementar tabelas de ranking com ordenação
- [x] Testar filtros e exportação CSV


## Etapa 10: Checkout com Endereço, PIX e App Entregador
- [ ] Atualizar Order schema com campos address e payment
- [ ] Atualizar createOrder para suportar PENDING_PAYMENT
- [ ] Atualizar adapter de orders para normalizar payment
- [ ] Adicionar campos de endereço no CheckoutPage
- [ ] Adicionar seletor de método de pagamento (PIX/Dinheiro)
- [ ] Instalar qrcode para geração de QR
- [ ] Criar componente PaymentPix com QR code
- [ ] Atualizar AdminPage com botão "Confirmar pagamento (PIX)"
- [ ] Atualizar login mock para aceitar driver@brazukas.app
- [ ] Criar página /driver/login
- [ ] Criar página /driver com lista de pedidos atribuídos
- [ ] Implementar ações PICKED_UP e DELIVERED no driver app
- [ ] Testar fluxo completo: checkout → PIX → admin → driver → tracking

## Etapa 10: PIX Reconciliation, Driver GPS Tracking e ETA Dinâmico
- [x] Implementar conversão PYG→BRL dinâmica com margem
- [x] Criar lib/reconciliation.ts com rastreamento de transações PIX
- [x] Criar AdminReconciliationPage com tabela de pagamentos
- [x] Implementar reconciliationRouter tRPC
- [x] Criar DriverLoginPage com autenticação JWT
- [x] Criar DriverAppPage com painel do entregador
- [x] Implementar GPS tracking com watchPosition
- [x] Criar TrackMap.tsx com Leaflet
- [x] Integrar OSRM para cálculo de rota real
- [x] Implementar EventBus para comunicação em tempo real
- [x] Implementar alertas de SLA (>45min) e parado (>8min)
- [x] Atualizar driverLocationRouter com suporte a dropoff

## Etapa 11: Proof of Delivery (POD) - Foto ou PIN
- [x] Adicionar campos pinDelivery e pod ao Order schema
- [x] Implementar geração de PIN 4-dígitos ao criar pedido
- [x] Criar lib/whatsapp.ts com msgDeliveryPin()
- [x] Adicionar notificação PIN via WhatsApp no checkout
- [x] Atualizar Order type com campos POD
- [x] Criar ModalPOD.tsx com interface foto/PIN
- [x] Integrar ModalPOD no DriverHomePage
- [x] Criar rota tRPC validatePOD para validação
- [x] Exibir PIN na página de tracking do cliente
- [x] Implementar validação de PIN no modal
- [x] Implementar upload de foto no modal
- [ ] Testar fluxo completo: checkout → PIN → driver → POD → tracking
- [ ] Integrar upload de foto com S3 (se necessário)
- [ ] Adicionar confirmação visual de POD no tracking


## Etapa 11: Melhorias Progressivas - Busca, Filtros, Avaliações, Histórico e Notificações

### Fase 1: Busca e Filtros de Lojas/Produtos
- [x] Implementar busca de lojas por nome
- [x] Implementar filtros por categoria de loja
- [x] Implementar busca de produtos por nome
- [x] Implementar filtros por preço (min/max)
- [x] Adicionar componente SearchBar na Home
- [x] Adicionar componente FilterPanel na StorePage
- [x] Integrar busca com API de merchants
- [x] Integrar busca com API de products
- [x] Testar busca com dados mock

### Fase 2: Sistema de Avaliações
- [x] Criar schema de avaliações (rating, comment, user)
- [x] Criar API /api/ratings para salvar avaliações
- [x] Criar API /api/ratings/[merchantId] para listar avaliações
- [x] Criar componente RatingStars para exibir rating
- [ ] Criar modal de avaliação na página de pedido entregue
- [ ] Exibir média de rating na StorePage
- [ ] Exibir média de rating na Home (StoreCard)
- [ ] Implementar filtro por rating na Home
- [ ] Testar fluxo de avaliação

### Fase 3: Histórico de Pedidos
- [x] Criar página /history para histórico de pedidos
- [x] Implementar API /api/orders/history para listar pedidos do usuário
- [x] Criar componente OrderHistoryCard
- [x] Adicionar filtros por status, data, loja
- [x] Implementar paginação ou scroll infinito
- [x] Adicionar link para reordenar (repetir pedido)
- [x] Exibir resumo de gastos e pedidos
- [x] Testar histórico com múltiplos pedidos

### Fase 4: Notificações em Tempo Real
- [x] Implementar WebSocket ou Server-Sent Events (SSE)
- [x] Criar sistema de notificações push no browser
- [x] Notificar quando pedido é confirmado
- [x] Notificar quando entregador é atribuído
- [x] Notificar quando pedido é retirado
- [x] Notificar quando pedido é entregue
- [x] Criar componente NotificationCenter
- [x] Adicionar badge de notificações não lidas
- [x] Testar notificações em tempo real

### Fase 5: Otimizações de Performance
- [x] Implementar lazy loading de imagens
- [x] Implementar code splitting por rota
- [x] Otimizar bundle size (minify, tree-shake)
- [x] Implementar caching de dados com React Query
- [x] Implementar service worker para offline support
- [x] Otimizar queries de banco de dados
- [x] Implementar CDN para imagens estáticas
- [x] Testar performance com Lighthouse
- [x] Testar responsividade mobile

### Fase 6: Melhorias UI/UX
- [x] Adicionar animações de transição entre páginas
- [x] Adicionar animações de loading (skeleton screens)
- [x] Implementar estados vazios com ilustrações
- [x] Melhorar tratamento de erros com mensagens claras
- [x] Adicionar confirmação antes de ações destrutivas
- [x] Implementar toast notifications para feedback
- [x] Adicionar dark mode (opcional)
- [x] Melhorar acessibilidade (ARIA labels, keyboard nav)
- [x] Testar com screen readers

### Fase 7: Testes e Checkpoint Final
- [ ] Testar fluxo completo: home → busca → loja → avaliação → checkout → histórico
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Testar performance com Lighthouse
- [ ] Testar acessibilidade com axe DevTools
- [ ] Corrigir bugs encontrados
- [ ] Documentar mudanças no README
- [ ] Atualizar userGuide.md
- [ ] Salvar checkpoint final


## Etapa 12: Sistema de Cupons de Desconto

### Fase 1: Schema e Lib de Gerenciamento
- [x] Criar schema de cupons em drizzle/schema.ts
- [x] Adicionar campos: code, discount (%), expiresAt, maxUses, usedCount, minOrderValue
- [x] Criar lib/coupons.ts com funções de gerenciamento
- [x] Implementar validação de cupom (ativo, não expirado, limite de uso)
- [x] Implementar cálculo de desconto

### Fase 2: Endpoint tRPC
- [x] Criar rota tRPC coupons.validate para validar cupom
- [x] Criar rota tRPC coupons.list para listar cupons disponíveis
- [x] Criar rota tRPC coupons.apply para aplicar cupom ao pedido
- [x] Implementar tratamento de erros (cupom inválido, expirado, etc)

### Fase 3: Componente CouponInput
- [x] Criar componente CouponInput.tsx
- [x] Input para código do cupom
- [x] Botão para aplicar cupom
- [x] Exibição de desconto aplicado
- [x] Opção para remover cupom

### Fase 4: Integração no Checkout
- [x] Integrar CouponInput no CheckoutPage
- [x] Calcular total com desconto
- [x] Exibir resumo: subtotal, desconto, total
- [x] Salvar cupom aplicado no pedido
- [x] Validar cupom antes de confirmar pedido

### Fase 5: Página de Cupons
- [x] Criar CouponsPage.tsx
- [x] Listar cupons disponíveis com descrição
- [x] Exibir desconto e condições
- [x] Botão para copiar código do cupom
- [x] Integrar rota /coupons no App.tsx

### Fase 6: Testes e Checkpoint
- [x] Testar fluxo: home → checkout → aplicar cupom → confirmar
- [x] Testar validações (cupom inválido, expirado, limite)
- [x] Testar cálculo de desconto
- [x] Testar responsividade
- [x] Salvar checkpoint final


## Etapa 13: Sistema de Avaliações

- [ ] Criar schema de avaliações no banco de dados
- [ ] Implementar rota tRPC para submeter avaliação
- [ ] Implementar rota tRPC para listar avaliações de loja
- [ ] Criar componente RatingForm para avaliar
- [ ] Integrar avaliações na StorePage
- [ ] Exibir média de rating no card da loja
- [ ] Testar fluxo completo de avaliações

## Etapa 14: Carrinho Persistente no Servidor

- [ ] Criar schema de carrinho no banco de dados
- [ ] Implementar rota tRPC para salvar carrinho
- [ ] Implementar rota tRPC para carregar carrinho
- [ ] Implementar rota tRPC para limpar carrinho
- [ ] Migrar localStorage para servidor
- [ ] Sincronizar carrinho entre abas do navegador
- [ ] Testar persistência de carrinho

## Etapa 15: Sistema de Recomendações

- [ ] Implementar algoritmo de recomendação baseado em histórico
- [ ] Criar rota tRPC para obter recomendações
- [ ] Exibir seção "Recomendado para você" na Home
- [ ] Recomendações baseadas em lojas visitadas
- [ ] Recomendações baseadas em categorias favoritas
- [ ] Testar qualidade das recomendações

## Etapa 16: Programa de Fidelidade

- [ ] Criar schema de pontos/cashback no banco
- [ ] Implementar sistema de pontos por compra
- [ ] Criar página de saldo de pontos
- [ ] Permitir usar pontos como desconto
- [ ] Exibir histórico de transações de pontos
- [ ] Implementar cashback automático
- [ ] Testar programa de fidelidade

## Etapa 17: Integração com Gateway de Pagamento Real

- [ ] Escolher gateway (Stripe, Mercado Pago, PayPal)
- [ ] Integrar SDK do gateway
- [ ] Criar rota tRPC para processar pagamento
- [ ] Implementar webhook para confirmação
- [ ] Adicionar suporte a múltiplos métodos de pagamento
- [ ] Testar pagamentos com dados de teste
- [ ] Implementar tratamento de erros de pagamento

## Etapa 18: Notificações Push em Tempo Real

- [ ] Implementar WebSocket para comunicação real-time
- [ ] Criar sistema de notificações push no browser
- [ ] Notificar quando pedido é confirmado
- [ ] Notificar quando entregador é atribuído
- [ ] Notificar quando pedido é retirado
- [ ] Notificar quando pedido é entregue
- [ ] Implementar som/vibração para notificações
- [ ] Testar notificações em múltiplos dispositivos


## Etapa 19: Correção de Bugs e Melhorias

### Bugs Identificados
- [ ] Corrigir erro de import duplicado em CheckoutPage.tsx
- [ ] Validar sincronização de carrinho entre abas
- [ ] Testar fluxo de pagamento com múltiplos métodos
- [ ] Corrigir responsividade em mobile para modais
- [ ] Validar autenticação em todas as rotas protegidas
- [ ] Testar notificações em background

### Melhorias Gerais
- [ ] Adicionar loading states em todas as operações async
- [ ] Implementar retry logic para falhas de rede
- [ ] Adicionar confirmação antes de ações destrutivas
- [ ] Melhorar mensagens de erro para o usuário
- [ ] Adicionar analytics tracking

## Etapa 20: Novas Features

- [ ] Sistema de chat com suporte (live chat)
- [ ] Rastreamento em tempo real com mapa interativo
- [ ] Programa de referência (convide amigos)
- [ ] Wishlist/Favoritos de lojas e produtos
- [ ] Agendamento de pedidos para horário específico
- [ ] Integração com redes sociais (compartilhar)
- [ ] Dark mode completo

## Etapa 21: Documentação Completa

- [ ] Criar userGuide.md com instruções de uso
- [ ] Criar README.md com setup e deployment
- [ ] Documentar todas as rotas tRPC
- [ ] Criar guia de contribuição
- [ ] Documentar variáveis de ambiente
- [ ] Criar changelog
- [ ] Documentar arquitetura do projeto

## Etapa 22: Otimizações de Performance

- [ ] Implementar lazy loading de imagens
- [ ] Code splitting por rota
- [ ] Minificação de assets
- [ ] Caching com service workers
- [ ] Compressão de imagens
- [ ] CDN para assets estáticos
- [ ] Database query optimization

## Etapa 23: Testes Automatizados

- [ ] Testes unitários para utilitários
- [ ] Testes de integração para rotas tRPC
- [ ] Testes de componentes React
- [ ] Testes E2E para fluxos críticos
- [ ] Testes de performance
- [ ] Cobertura de testes > 80%

## Etapa 24: Segurança e Validações

- [ ] Validação de entrada em todos os endpoints
- [ ] Rate limiting para APIs
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Autenticação segura
- [ ] Criptografia de dados sensíveis
- [ ] Audit logging

## Etapa 25: Publicação e Deploy

- [ ] Configurar CI/CD pipeline
- [ ] Preparar ambiente de produção
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/TLS
- [ ] Backup e disaster recovery
- [ ] Monitoramento e alertas
- [ ] Deploy em produção
- [ ] Documentação de operações


## Etapa 26: Painel Completo do Comerciante

### Fase 1: Schema e Rotas tRPC
- [ ] Criar tabela merchants com campos (name, email, phone, address, cnpj, bankAccount)
- [ ] Criar tabela merchant_products com campos (merchantId, name, price, description, image, category, available)
- [ ] Criar rotas tRPC merchants.signup, merchants.getProfile, merchants.updateProfile
- [ ] Criar rotas tRPC products.list, products.create, products.update, products.delete
- [ ] Implementar autenticação de comerciante (token JWT)

### Fase 2: MerchantSignup
- [ ] Criar página MerchantSignup.tsx com formulário de cadastro
- [ ] Validar email, CNPJ, telefone
- [ ] Upload de logo da loja
- [ ] Dados bancários para recebimento
- [ ] Termos e condições
- [ ] Enviar email de confirmação

### Fase 3: MerchantDashboard
- [ ] Criar dashboard principal com widgets KPI
- [ ] Exibir pedidos recentes
- [ ] Exibir faturamento do dia/mês
- [ ] Exibir número de clientes
- [ ] Exibir rating médio
- [ ] Links para gerenciar produtos, pedidos, configurações

### Fase 4: ProductManager
- [ ] Criar página ProductManager.tsx
- [ ] Listar produtos com filtros
- [ ] Adicionar novo produto (form modal)
- [ ] Editar produto (form modal)
- [ ] Deletar produto (com confirmação)
- [ ] Upload de imagem para produto
- [ ] Ativar/desativar produto

### Fase 5: OrderManager
- [ ] Criar página OrderManager.tsx
- [ ] Listar pedidos da loja com filtros
- [ ] Exibir detalhes do pedido
- [ ] Mudar status do pedido (CONFIRMED → PICKED_UP)
- [ ] Exibir informações do cliente
- [ ] Exibir tempo de preparo
- [ ] Marcar como pronto para entrega

### Fase 6: MerchantMetrics (COMPLETA)
- [x] Criar página MerchantMetrics.tsx
- [x] Gráfico de faturamento (dia/semana/mês)
- [x] Gráfico de pedidos
- [x] Gráfico de produtos mais vendidos
- [x] Estatísticas de clientes
- [x] Taxa de conclusão de pedidos
- [x] Tempo médio de preparo

### Fase 9: MerchantAnalytics (NOVA - COMPLETA)
- [x] Criar rotas tRPC para coleta de dados de análise
- [x] Implementar componentes de gráficos (vendas, receita, produtos)
- [x] Criar página MerchantAnalytics com dashboard completo
- [x] Adicionar filtros de período (Hoje, Semana, Mês)
- [x] Implementar exportação de relatórios (CSV, PDF)
- [x] Integrar no MerchantLayout sidebar
- [x] Adicionar rota /merchant/analytics/:merchantId no App.tsx

### Fase 7: MerchantSettings
- [ ] Criar página MerchantSettings.tsx
- [ ] Editar dados da loja (nome, descrição, telefone)
- [ ] Editar horário de funcionamento
- [ ] Editar raio de entrega
- [ ] Editar taxa de entrega
- [ ] Editar dados bancários
- [ ] Alterar senha
- [ ] Deletar conta

### Fase 8: Integração e Testes
- [ ] Adicionar rotas /merchant/signup, /merchant/dashboard, /merchant/products, /merchant/orders, /merchant/metrics, /merchant/settings no App.tsx
- [ ] Criar MerchantLayout com sidebar de navegação
- [ ] Implementar autenticação de comerciante (login/logout)
- [ ] Testar fluxo completo: signup → dashboard → adicionar produto → receber pedido
- [ ] Testar responsividade mobile
- [ ] Salvar checkpoint final

### Fase 10: Exportação de Rastreamento (CSV e GPX) - COMPLETA
- [x] Criar rota tRPC para exportação CSV com dados de rastreamento
- [x] Criar rota tRPC para exportação GPX com dados de rastreamento
- [x] Implementar funções de conversão (CSV e GPX)
- [x] Criar lib/track.metrics.ts com cálculo de distância e duração
- [x] Adicionar botões de download na página OrderDetail
- [x] Integrar métricas de distância e duração no painel admin
- [ ] Testar exportação CSV com dados reais
- [ ] Testar exportação GPX com compatibilidade (Strava, Google Earth, QGIS)
- [ ] Validar cálculos de distância (Haversine) e duração

### Fase 11: Mapa Interativo de Rastreamento - COMPLETA
- [x] Instalar dependência Leaflet e react-leaflet
- [x] Criar componente TrackingMap com renderização de mapa
- [x] Implementar visualização de pontos de rastreamento no mapa
- [x] Adicionar linha de rota conectando os pontos
- [x] Integrar mapa na página OrderDetail
- [x] Adicionar marcadores de origem e destino
- [x] Implementar controles de zoom e pan
- [x] Adicionar popup com informações dos pontos
- [ ] Testar mapa com dados de rastreamento reais
- [ ] Validar performance e responsividade mobile

### Fase 12: Painel de Resumo de Rota - COMPLETA
- [x] Criar componente RouteStats com cards de KPIs
- [x] Reorganizar layout OrderDetail em grid (mapa + painel)
- [x] Adicionar cards: distância total, tempo de viagem, velocidade média
- [x] Adicionar cards: quantidade de pontos, hora início, hora fim
- [x] Implementar layout responsivo (mapa em cima no mobile)
- [x] Adicionar ícones aos cards de estatísticas
- [x] Testar layout em diferentes tamanhos de tela
- [x] Validar dados de rastreamento no painel

### Fase 13: Recursos de Produção - COMPLETA
- [x] Implementar healthcheck endpoint (/api/healthz)
- [x] Criar middleware de rate-limit para APIs sensíveis
- [x] Configurar CORS restrito por origem
- [x] Adicionar headers de segurança (HSTS, CSP, X-Frame-Options)
- [x] Criar página de Termos de Uso
- [x] Criar página de Política de Privacidade (LGPD)
- [x] Adicionar links de Termos/Privacidade no footer
- [x] Criar manifest.json para PWA
- [x] Criar robots.txt para SEO
- [x] Implementar sitemap.xml dinâmico
- [x] Integrar Sentry para monitoramento de erros
- [x] Implementar sistema de auditoria de eventos
- [x] Testar fluxo completo de produção
