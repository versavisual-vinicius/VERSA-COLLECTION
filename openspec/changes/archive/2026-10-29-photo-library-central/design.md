# Design: photo-library-central

## Context

Atualmente o backend unificado (`server.mjs`) expõe endpoints por coleção (`api/collections/[slug]`) e métricas do estúdio (`api/admin/metrics.ts`), mas carece de um endpoint de agregação de fotografias com filtros transversais. No frontend, a navegação do `ProductHubGrid` aponta para `/#photos` como rascunho da Fase 15.

## Goals / Non-Goals

**Goals:**
- Prover endpoint `api/photos.ts` com validação Zod para busca textual, filtros de coleção e proporção geométrica.
- Implementar o hook `useAbortRequest` para cancelamento determinístico de requisições concorrentes via `AbortController`.
- Desenvolver a interface `PhotoLibraryPage.tsx` respeitando o Design System Editorial Versa Visual (`#050A0D`, `#5E7F8C`, Outfit, DM Sans).
- Habilitar navegação SPA bidirecional entre `/dashboard`, `/photos` e `/g/:slug`.

**Non-Goals:**
- Edição de fotos ou processamento de filtros de IA (escopo de fases futuras com WebGL/WASM).
- Upload direto de mídia via drag-and-drop no navegador (mantido o pipeline CLI via Google Drive CDN).

## Decisions

### 1. Cancelamento Resiliente via AbortController Nativo
- **Decisão**: Utilizar `AbortController` nativo no hook `useAbortRequest.ts`.
- **Justificativa**: Evita dependências pesadas e resolve race conditions de busca em rede (quando uma busca por "noiva" demora 400ms e uma busca por "noivos" subsequente responde em 100ms, a resposta anterior é abortada no nível do fetch).
- **Alternativa Considerada**: Debounce puro com `setTimeout`. Não impede que a requisição anterior sobreponha o estado mais recente caso a rede tenha latência instável.

### 2. Contratos Zod Bidirecionais (`api/_lib/contracts.ts`)
- **Decisão**: Tipar `photoLibraryQuerySchema` e `photoLibraryResponseSchema` com validação estrita de query params (`q`, `collection`, `orientation`, `limit`, `offset`).
- **Justificativa**: Segue o padrão fail-closed estabelecido na Fase 13.

### 3. Reutilização de Componentes Editoriais
- **Decisão**: Conectar o clique de fotos da biblioteca ao `PhotoLightbox` já existente para inspeção em tela cheia com deep linking opcional.

## Risks / Trade-offs

- **[Tratamento de AbortError]** → Requisições abortadas geram exceção `DOMException: The user aborted a request`.
  - *Mitigação*: O hook filtra silenciosamente erros com `err.name === 'AbortError'`, evitando que banners de indisponibilidade ou toasts de erro sejam disparados.
- **[Volume de Dados em Acervos Grandes]** → Retornar todas as fotos de uma só vez satura a banda e a renderização.
  - *Mitigação*: Paginação com `limit` padrão de 32 itens e `totalCount` para controle da paginação.
