# Tasks: photo-library-central

## 1. Contratos Zod & Endpoint Agregador Backend

- [x] 1.1 Definir schemas `photoLibraryQuerySchema` e `photoLibraryResponseSchema` em `api/_lib/contracts.ts` com validação de `q`, `collection`, `orientation`, `limit` e `offset`
- [x] 1.2 Implementar handler `api/photos.ts` consultando o banco PostgreSQL ou fixtures locais e registrá-lo no despachante de rotas em `server.mjs`
- [x] 1.3 Adicionar função `fetchPhotoLibrary(query, signal)` em `src/lib/backend.ts` com fallback inteligente para fixtures e propagação de `AbortSignal`

## 2. Hook useAbortRequest & Controle de Concorrência

- [x] 2.1 Criar o hook `src/hooks/useAbortRequest.ts` gerenciando o ciclo de vida do `AbortController` nativo e filtrando exceções de cancelamento
- [x] 2.2 Criar teste unitário para `useAbortRequest` comprovando o cancelamento de requisições anteriores ao disparar nova busca

## 3. Componentes da Biblioteca de Fotos & Design Editorial

- [x] 3.1 Criar componente `PhotoLibraryFilterBar.tsx` com input de busca em tempo real, seleção de orientação e seletor de coleção
- [x] 3.2 Criar componente `PhotoLibraryEmptyState.tsx` para exibição de orientações quando não há fotos ou a busca não retorna resultados
- [x] 3.3 Criar componente de página `PhotoLibraryPage.tsx` unificando barra de filtros, cabeçalho editorial, grade responsiva e inspeção via Lightbox

## 4. Roteamento SPA & Integração

- [x] 4.1 Conectar rota `/photos` e `?view=photos` em `src/App.tsx`, adicionando navegação a partir do `ProductHubGrid.tsx`
- [x] 4.2 Criar suíte de testes de integração em `src/test/Fase15_PhotoLibrary.test.tsx` cobrindo busca, filtros e navegação
- [x] 4.3 Executar `pnpm check` (lint, typecheck, test, build) garantindo aprovação total
