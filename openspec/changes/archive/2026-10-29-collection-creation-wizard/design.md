# Design: Collection Creation Wizard & Onboarding

## Context

O projeto VERSA-COLLECTION consolidou o Studio Dashboard Hub (`/dashboard`) e a Photo Library Central (`/photos`). Em ambas as telas, os botões de ação primária "Nova Coleção" apontam para `/collections/create` ou disparam a criação de novas coleções de clientes. A arquitetura backend opera com PostgreSQL unificado via `server.mjs` com helper transacional `withTransaction` e fallback in-memory local.

## Goals / Non-Goals

**Goals:**
- Implementar um assistente modal/rota em 3 etapas com indicador visual de progresso, validação de etapas e transição fluida.
- Permitir geração de slug reativa e normalizada (kebab-case) a partir do título do evento.
- Integrar escolha de imagem de capa e configuração de ponto focal x/y com pré-visualização em tempo real.
- Suportar flag opcional `seedDemoPhotos: boolean` para injetar 12 fotos demonstrativas do acervo no momento da criação.
- Endpoint backend `POST /api/collections` com validação Zod e inserção atômica via transação ACID.
- Suporte a fallback in-memory quando o banco de dados não estiver conectado.

**Non-Goals:**
- Upload massivo de gigabytes de arquivos RAW nesta etapa (atendido pelo pipeline oficial via CLI Google Drive CDN e Service Account).
- Edição avançada de metadados EXIF/IPTC na criação.

## Decisions

### 1. Wizard em 3 Etapas com Máquina de Estado Leve
- **Decisão**: Utilizar estado local em React (`step: 1 | 2 | 3`) dentro do componente `CollectionCreateWizard`.
- **Alternativas consideradas**:
  - Sub-rotas SPA separadas (`/step-1`, `/step-2`): Adicionaria complexidade desnecessária de histórico e estado fragmentado.
  - Formulário longo em uma única tela: Quebra o padrão visual do Alvo 1 do Pixieset ("Crie belas coleções de fotos em 3 passos").

### 2. Validação Bidirecional Zod
- **Decisão**: Criar `createCollectionSchema` e `createCollectionResponseSchema` em `api/_lib/contracts.ts`.
- **Campos do Schema**:
  - `title`: string min 2 max 120
  - `slug`: string regex `^[a-z0-9-]+$` min 2 max 80
  - `eventDate`: string ISO opcional
  - `clientEmail`: string email opcional
  - `coverUrl`: string URL ou path relativo
  - `coverFocalPoint`: `{ x: number, y: number }` (0-100)
  - `layoutPreset`: enum `masonry` | `justified`
  - `seedDemoPhotos`: boolean opcional

### 3. Persistência Transacional no Backend
- **Decisão**: Em `api/collections/create.ts` ou `POST /api/collections`, executar `withTransaction(async (client) => ...)` inserindo em `public.collections` e, caso `seedDemoPhotos === true`, inserindo em `public.photos`.
- **Alternativas consideradas**: Queries sequenciais sem transação: Rejeitado por violar a diretriz transacional ACID do REA (risco de coleção criada sem fotos em caso de erro na metade).

### 4. Resiliência e Fallback Local
- **Decisão**: Implementar `createCollection` em `src/lib/backend.ts` com fallback transparente que popula `availableCollections` localmente caso a chamada HTTP falhe ou o ambiente esteja desconectado.

## Risks / Trade-offs

- **[Colisão de Slugs]** → Sanitização reativa com checagem de unicidade e fallback automático anexando sufixo numérico (`-1`, `-2`).
- **[Seleção de Capa com URL inválida]** → Fallback automático para a capa padrão autoral Versa Visual em caso de erro no carregamento da imagem.
