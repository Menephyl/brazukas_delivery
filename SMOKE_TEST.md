# Brazukas Delivery - Smoke Test Checklist

**Objetivo**: Validar o fluxo completo de pedido do usuário até a entrega com todas as integrações funcionando.

**Ambiente**: Produção ou staging com dados reais de Mercado Pago e Firebase.

**Duração Estimada**: 30-45 minutos

---

## ✅ Fase 1: Vitrine e Busca

- [ ] **Home carrega corretamente**
  - [ ] Hero section exibe corretamente
  - [ ] Lojas em destaque aparecem com imagens
  - [ ] Ratings aparecem em estrelas
  - [ ] Tempo de entrega é exibido

- [ ] **Busca funciona**
  - [ ] Digitar nome de loja filtra resultados
  - [ ] Busca é case-insensitive
  - [ ] Resultados atualizam em tempo real

- [ ] **Filtros funcionam**
  - [ ] Clicar em "Filtros" abre painel
  - [ ] Filtrar por categoria funciona
  - [ ] Filtrar por preço funciona
  - [ ] Filtrar por rating funciona
  - [ ] Limpar filtros reseta busca

- [ ] **Navegação**
  - [ ] Links no header funcionam (Lojas, Histórico, Cupóns)
  - [ ] Ícone de carrinho mostra contagem
  - [ ] Ícone de notificações mostra badge
  - [ ] Clique em loja abre página de detalhes

---

## ✅ Fase 2: Carrinho e Persistência

- [ ] **Adicionar itens ao carrinho**
  - [ ] Clicar em "Adicionar ao Carrinho" funciona
  - [ ] Quantidade pode ser ajustada
  - [ ] Preço total atualiza corretamente
  - [ ] Ícone de carrinho mostra contagem atualizada

- [ ] **Persistência entre recarregamentos**
  - [ ] Recarregar página mantém itens no carrinho
  - [ ] Fechar e reabrir navegador mantém carrinho
  - [ ] Carrinho sincroniza entre abas do navegador

- [ ] **Remover itens**
  - [ ] Botão de remover funciona
  - [ ] Total atualiza após remover
  - [ ] Carrinho vazio exibe mensagem apropriada

- [ ] **Frete e entrega**
  - [ ] Frete é calculado corretamente
  - [ ] Raio de entrega é respeitado
  - [ ] Endereço fora da área exibe erro

---

## ✅ Fase 3: Checkout e Pagamento

- [ ] **Formulário de checkout**
  - [ ] Campos obrigatórios são validados
  - [ ] Endereço pode ser preenchido
  - [ ] Telefone é validado
  - [ ] Email é validado

- [ ] **Seleção de método de pagamento**
  - [ ] Opção PIX é exibida
  - [ ] Opção Dinheiro é exibida
  - [ ] Seleção de método funciona

- [ ] **Cupom de desconto**
  - [ ] Campo de cupom é exibido
  - [ ] Cupom válido é aplicado
  - [ ] Desconto é calculado corretamente
  - [ ] Cupom inválido exibe erro
  - [ ] Cupom expirado exibe erro
  - [ ] Cupom com limite de uso exibe erro

- [ ] **Resumo de pedido**
  - [ ] Subtotal é exibido corretamente
  - [ ] Desconto é exibido (se aplicável)
  - [ ] Frete é exibido
  - [ ] Total final é calculado corretamente

---

## ✅ Fase 4: Pagamento PIX

- [ ] **QR Code PIX**
  - [ ] QR Code é gerado
  - [ ] QR Code é exibido corretamente
  - [ ] Botão "Copiar código" funciona
  - [ ] Código PIX pode ser copiado

- [ ] **Confirmação de pagamento**
  - [ ] Após pagar no banco, webhook é recebido
  - [ ] Status do pedido muda para CONFIRMED
  - [ ] Usuário é redirecionado para /order/:id
  - [ ] Notificação push é enviada (se habilitada)

- [ ] **Fallback para dinheiro**
  - [ ] Se escolher dinheiro, pedido é criado com status PENDING_PAYMENT
  - [ ] Admin pode confirmar pagamento manualmente
  - [ ] Após confirmação, status muda para CONFIRMED

---

## ✅ Fase 5: Rastreamento e Status

- [ ] **Página de rastreamento**
  - [ ] /order/:id carrega corretamente
  - [ ] Status do pedido é exibido
  - [ ] Mapa com localização do entregador é exibido
  - [ ] Tempo estimado de chegada é exibido
  - [ ] Informações do entregador são exibidas

- [ ] **Transições de status**
  - [ ] Admin pode mudar status: CONFIRMED → ASSIGNED
  - [ ] Admin pode mudar status: ASSIGNED → PICKED_UP
  - [ ] Admin pode mudar status: PICKED_UP → DELIVERED
  - [ ] Cada transição atualiza o rastreamento em tempo real

- [ ] **Notificações push**
  - [ ] Push é enviado quando status muda
  - [ ] Push contém informações relevantes
  - [ ] Clicar em push abre /order/:id
  - [ ] Notificações aparecem no NotificationCenter

---

## ✅ Fase 6: Proof of Delivery (POD)

- [ ] **Modal POD**
  - [ ] Quando status é DELIVERED, modal POD aparece
  - [ ] Opção de tirar foto funciona
  - [ ] Opção de confirmar com PIN funciona
  - [ ] PIN é exibido para o cliente

- [ ] **Validação de PIN**
  - [ ] PIN correto marca pedido como entregue
  - [ ] PIN incorreto exibe erro
  - [ ] Foto é aceita como comprovante
  - [ ] Foto é armazenada com metadados

---

## ✅ Fase 7: Fidelidade e Pontos

- [ ] **Ganho de pontos**
  - [ ] Após entrega, pontos são creditados
  - [ ] Multiplicador de pontos por tier é aplicado
  - [ ] Saldo de pontos é atualizado no perfil

- [ ] **Resgate de pontos**
  - [ ] Usuário pode resgate pontos no checkout
  - [ ] Desconto é aplicado corretamente
  - [ ] Saldo de pontos é decrementado

- [ ] **Tier e benefícios**
  - [ ] Tier atual é exibido corretamente
  - [ ] Progresso para próximo tier é exibido
  - [ ] Benefícios do tier são aplicados

---

## ✅ Fase 8: Avaliações

- [ ] **Deixar avaliação**
  - [ ] Após entrega, botão "Avaliar" aparece
  - [ ] Modal de avaliação abre
  - [ ] Seleção de estrelas funciona
  - [ ] Comentário pode ser adicionado
  - [ ] Avaliação é salva

- [ ] **Exibição de avaliações**
  - [ ] Média de rating aparece no card da loja
  - [ ] Histórico de avaliações aparece na página da loja
  - [ ] Avaliações são ordenadas por data

- [ ] **Ranking**
  - [ ] Lojas com melhor rating aparecem em destaque
  - [ ] Filtro por rating funciona

---

## ✅ Fase 9: Recomendações

- [ ] **Recomendações personalizadas**
  - [ ] Seção "Recomendado para você" aparece na home
  - [ ] Recomendações são baseadas no histórico
  - [ ] Carrossel de recomendações funciona

- [ ] **Lojas em alta**
  - [ ] Seção "Populares" aparece
  - [ ] Lojas com mais pedidos aparecem em destaque

---

## ✅ Fase 10: Admin e Operações

- [ ] **Painel admin**
  - [ ] Login admin funciona
  - [ ] Dashboard exibe KPIs corretos
  - [ ] Lista de pedidos é exibida
  - [ ] Filtros por status funcionam

- [ ] **Gerenciamento de pedidos**
  - [ ] Admin pode atribuir entregador
  - [ ] Admin pode mudar status
  - [ ] Admin pode ver detalhes do pedido
  - [ ] Admin pode ver histórico de transições

- [ ] **Métricas**
  - [ ] Página de métricas exibe gráficos
  - [ ] KPIs são calculados corretamente
  - [ ] Filtros de data funcionam

---

## ✅ Fase 11: Segurança e Performance

- [ ] **HTTPS e SSL**
  - [ ] Site é acessível via HTTPS
  - [ ] Certificado SSL é válido
  - [ ] Redirecionamento HTTP → HTTPS funciona

- [ ] **CORS**
  - [ ] Requisições de domínios autorizados funcionam
  - [ ] Requisições de domínios não autorizados são bloqueadas

- [ ] **Rate limiting**
  - [ ] Múltiplas requisições são limitadas
  - [ ] Erro 429 é retornado quando limite é atingido

- [ ] **Performance**
  - [ ] Home carrega em < 3 segundos
  - [ ] Página de loja carrega em < 2 segundos
  - [ ] Checkout carrega em < 2 segundos
  - [ ] Lighthouse score > 80

---

## ✅ Fase 12: Notificações

- [ ] **Push notifications**
  - [ ] Notificação é recebida quando status muda
  - [ ] Notificação contém informações corretas
  - [ ] Clicar em notificação abre app

- [ ] **In-app notifications**
  - [ ] NotificationCenter mostra notificações
  - [ ] Badge mostra contagem de não lidas
  - [ ] Marcar como lida funciona

---

## 🚨 Problemas Encontrados

Use este espaço para documentar qualquer problema encontrado durante o teste:

| Problema | Severidade | Status | Notas |
|----------|-----------|--------|-------|
| | | | |

---

## ✅ Resultado Final

- [ ] Todos os itens foram testados
- [ ] Nenhum bug crítico foi encontrado
- [ ] Performance está dentro dos limites
- [ ] Segurança foi validada
- [ ] Pronto para deploy em produção

**Data do Teste**: _______________

**Testador**: _______________

**Assinatura**: _______________

---

## 📋 Próximos Passos

Após aprovação do smoke test:

1. [ ] Deploy em produção
2. [ ] Monitoramento 24/7 ativado
3. [ ] Backup automático configurado
4. [ ] Alertas de erro configurados
5. [ ] Documentação atualizada
6. [ ] Comunicado de lançamento enviado
