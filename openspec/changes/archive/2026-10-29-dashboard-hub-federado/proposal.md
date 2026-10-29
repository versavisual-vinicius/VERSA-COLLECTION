# Proposal: dashboard-hub-federado

## Why

O relatório de engenharia reversa do painel central da Pixieset (`accounts.pixieset.com/dashboard/`) demonstrou que a experiência do fotógrafo é estruturada em torno de um hub centralizado de navegação e orquestração de produtos.
No VERSA-COLLECTION, as ações de gestão hoje estão acopladas diretamente à página da galeria (`AdminPanel.tsx` via `?admin=true`), sem uma visão unificada de todo o ecossistema (Client Gallery, Biblioteca de Fotos, Studio Manager, Métricas e Gauge de Armazenamento).
Esta mudança estabelece a rota `/dashboard` como o portal de comando oficial do fotógrafo Vini, integrando atalhos rápidos, status de saúde dos serviços e controle de cota de armazenamento.

## What Changes

- **Rota Central `/dashboard`**:
  - Implementação de página editorial e responsiva `/dashboard` no React com layout corporativo Versa Visual (`#050A0D`, acentos `#5E7F8C`, tipografia Outfit/DM Sans).
  - Hub de Produtos Federados: cartões com links diretos para Galeria do Cliente (`/`), Biblioteca de Fotos (`/photos`), Studio Manager e Configurações de Marca.
- **Gauge Visual de Armazenamento**:
  - Exibição de gauge de armazenamento consumido (AlloyDB + Google Drive CDN) vs. cota disponível.
  - Indicador numérico de coleções totais, fotos publicadas e downloads solicitados.
- **Monitoramento de Infraestrutura e Healthcheck**:
  - Indicador em tempo real de status dos serviços (Cloud Run, AlloyDB, CDN Google Drive).
  - Endpoint de agregação de métricas `/api/admin/metrics` protegido por autenticação de proprietário.
- **Atalhos Rápidos de Operação**:
  - Botão de ação rápida "Nova Coleção" (abertura de modal de criação).
  - Acesso ao painel administrativo de configurações de marca e presets.

## Capabilities

### New Capabilities
- `dashboard-hub`: Portal de orquestração e navegação de produtos para o fotógrafo na rota `/dashboard`.
- `storage-metrics`: Agregação e exibição visual de cota de armazenamento e métricas globais do acervo.

### Modified Capabilities
<!-- Nenhuma capacidade existente modificada. -->

## Impact

- **Código afetado**: `src/App.tsx`, novos componentes em `src/components/Dashboard/`, novo endpoint `api/admin/metrics.ts`, `src/lib/backend.ts`.
- **Dependências**: Nenhuma nova dependência externa necessária.
- **Compatibilidade**: Zero quebra nas rotas públicas de galeria (`/:slug`, `/`, deep links `?photo=` e `?pid=`).
