# Design: dashboard-hub-federado

## Context

O VERSA-COLLECTION consolidou até a Fase 13 a experiência de visualização pública da galeria, segurança de acesso por senha, testes de resiliência e contratos de API com Zod.
Com a conclusão da auditoria de engenharia reversa do painel Pixieset (`accounts.pixieset.com/dashboard/`), identificou-se a necessidade de um portal centralizado `/dashboard` onde o fotógrafo Vini tenha visão consolidada do ecossistema de produtos, gauge de armazenamento e status operacional.

## Goals / Non-Goals

**Goals:**
- Implementar a página SPA `/dashboard` no React com design editorial Versa Visual (`#050A0D`, acentos `#5E7F8C`, tipografia Outfit/DM Sans).
- Criar componentes modulares: `DashboardPage`, `ProductHubGrid`, `StorageGaugeCard`, `SystemHealthCard` e `QuickActions`.
- Criar endpoint autenticado `GET /api/admin/metrics` calculando contagem de coleções, total de fotos, estimativa de armazenamento (MB/GB) e status do banco.
- Conectar navegação fluida entre `/dashboard`, `/` (Coleções Públicas) e o painel de criação/edição.

**Non-Goals:**
- Não implementar a biblioteca global de fotos `/photos` nesta fase (escopada para a Fase 15).
- Não alterar regras de negócio ou de autenticação das galerias existentes.

## Decisions

### 1. Roteamento SPA em `src/App.tsx`
- **Decisão**: Tratar a rota `/dashboard` de forma nativa no roteador SPA existente, checando `window.location.pathname === '/dashboard'`.
- **Justificativa**: Mantém paridade com a arquitetura zero-dependency do roteador leve existente no projeto, sem exigir a instalação de bibliotecas pesadas de roteamento.

### 2. Endpoint de Métricas Agregadas (`/api/admin/metrics`)
- **Decisão**: Criar endpoint dedicado que executa agregação atômica via SQL das tabelas `collections`, `photos` e `export_requests`.
- **Justificativa**: Evita que o client faça múltiplas chamadas individuais; unifica em uma única carga JSON leve e com cache apropriado.

### 3. Gauge de Armazenamento com SVG Circular e Barra de Progresso
- **Decisão**: Renderizar o gauge de armazenamento utilizando SVG determinístico com `stroke-dasharray` e barra horizontal de progresso com tokens oficiais `#5E7F8C`.
- **Justificativa**: Garante renderização nítida em qualquer densidade de pixels, sem dependência de bibliotecas de gráficos (Chart.js / Recharts).

## Risks / Trade-offs

- **[Risco] Acesso não autorizado às métricas** → *Mitigação*: Proteção do endpoint `/api/admin/metrics` exigindo token de sessão ou credenciais administrativas válidas.
- **[Risco] Cálculo pesado de armazenamento no banco** → *Mitigação*: Agregação rápida baseada na soma de contagens e tamanhos declarados em metadados, sem varredura em disco a cada request.
