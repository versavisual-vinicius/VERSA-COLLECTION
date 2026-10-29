# Tasks: dashboard-hub-federado

## 1. Backend de Métricas & Saúde da Infraestrutura

- [x] 1.1 Criar endpoint `api/admin/metrics.ts` calculando contagens de coleções, fotos e tamanho estimado de armazenamento
- [x] 1.2 Adicionar schemas Zod em `api/_lib/contracts.ts` para validação e resposta do endpoint de métricas
- [x] 1.3 Integrar suporte a `fetchAdminMetrics()` em `src/lib/backend.ts` com fallback offline para fixtures

## 2. Componentes do Dashboard e Design Editorial

- [x] 2.1 Criar componente `StorageGaugeCard.tsx` exibindo consumo em GB, cota e barra de progresso com tokens oficiais `#5E7F8C`
- [x] 2.2 Criar componente `ProductHubGrid.tsx` com cartões de acesso a Client Gallery, Biblioteca de Fotos, Studio Manager e Configurações
- [x] 2.3 Criar componente `SystemHealthCard.tsx` exibindo status dos serviços Cloud Run, AlloyDB e CDN Google Drive
- [x] 2.4 Criar componente principal `DashboardPage.tsx` unificando cabeçalho editorial, ações rápidas, métricas e hub de produtos

## 3. Roteamento SPA e Integração

- [x] 3.1 Conectar rota `/dashboard` em `src/App.tsx` e adicionar atalho de navegação no painel administrativo e rodapé
- [x] 3.2 Criar suíte de testes de integração e acessibilidade em `src/test/Fase14_DashboardHub.test.tsx`

## 4. Verificação Final

- [x] 4.1 Executar suíte completa de testes (`pnpm test`) garantindo que todos os 107 testes anteriores e os novos testes passam
- [x] 4.2 Executar `pnpm check` (lint, typecheck, test, build) validando build de produção limpo
