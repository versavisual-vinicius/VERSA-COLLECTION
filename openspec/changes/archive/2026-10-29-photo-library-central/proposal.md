# Proposal: photo-library-central

## Why

Atualmente o fotógrafo gerencia coleções de forma individual, sem uma visão consolidada de todas as fotografias do acervo ou capacidade de buscar imagens entre múltiplos eventos. A implementação da Biblioteca Central de Fotos (`/photos`), correspondente ao Alvo 2 da engenharia reversa do Pixieset (`galleries.pixieset.com/photos`), unifica o acesso a todas as fotos indexadas no banco PostgreSQL/AlloyDB com busca em tempo real e cancelamento resiliente de requisições (`useAbortRequest`).

## What Changes

- Criação do endpoint de backend `api/photos.ts` (registrado em `server.mjs`) que suporta busca por texto, filtro por coleção/slug, filtro por orientação (paisagem/retrato) e paginação com cursor determinístico.
- Criação da página SPA `PhotoLibraryPage.tsx` acessível via rota `/photos` e `?view=photos` em `src/App.tsx`.
- Implementação do hook `useAbortRequest` que encapsula `AbortController` nativo para abortar automaticamente consultas em andamento ao digitar novos termos na busca.
- Integração da visualização em grade com cálculo de proporção, visualização de metadados, seleção e abertura de Lightbox para inspeção em tela cheia.
- Estado vazio editorial (`PhotoLibraryEmptyState`) quando a busca não retorna resultados ou o acervo está zerado.
- Atualização do link e badge de "Biblioteca de Fotos" em `ProductHubGrid.tsx` para navegar diretamente para a rota ativa `/photos`.

## Capabilities

### New Capabilities

- `photo-library`: Catálogo e busca global de fotos do fotógrafo entre todas as coleções, com filtros de texto, orientação, paginação e cancelamento resiliente de requisições assíncronas via `AbortController`.

### Modified Capabilities

<!-- Nenhuma especificação anterior teve seus requisitos alterados. -->

## Impact

- **Frontend**: Novos componentes `PhotoLibraryPage.tsx`, `useAbortRequest.ts` e atualização no roteamento SPA de `src/App.tsx`.
- **Backend**: Novo endpoint `api/photos.ts` em Node.js com contratos Zod e testes de integração.
- **Dependências**: Nenhuma dependência externa nova (utiliza `AbortController` nativo e Zod existente).
