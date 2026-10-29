# Proposal: Collection Creation Wizard & Onboarding

## Why

Atualmente, o Studio Dashboard e a Photo Library possuem atalhos para criação de novas coleções, mas o fluxo direciona para o painel administrativo legador ou exige manipulação manual de arquivos. Para alcançar paridade com o Alvo 1 da auditoria Pixieset (`collections/get-started` e `/collections/create`), é necessário um wizard guiado em 3 passos com injeção rápida de coleção demonstrativa ("Comece com fotos de exemplo"), validação de contratos Zod e persistência transacional atômica.

## What Changes

- **Wizard Guiado de 3 Passos (`/collections/create` e modal)**:
  - **Passo 1 (Detalhes do Evento)**: Título da coleção, data do evento, e-mail do cliente, slug gerado automaticamente com normalização URL-friendly.
  - **Passo 2 (Capa & Enquadramento)**: Upload ou seleção de imagem de capa, seletor de ponto focal interativo (`CoverFocalPicker`), opacidade de overlay editorial e assinatura fotográfica (`@v1ncsc`).
  - **Passo 3 (Layout da Grade & Privacidade)**: Seleção de template (Masonry editorial balanceado vs. Justified), configuração de senha/PIN opcional e botão de ação rápida "Criar com fotos de exemplo".
- **Backend & Contratos**:
  - Endpoint `POST /api/collections` validado por Zod (`createCollectionSchema`, `createCollectionResponseSchema`).
  - Transação ACID (`withTransaction`) para inserção da coleção e associação imediata das fotos iniciais em `public.collections` e `public.photos`.
  - Fallback local in-memory com persistência em `availableCollections` quando o banco não estiver acessível.
- **Integração SPA & Hubs**:
  - Conexão da rota `/collections/create` e parâmetro `?view=create-collection` em `App.tsx`.
  - Integração dos botões "Nova Coleção" do `ProductHubGrid`, `DashboardPage` e `PhotoLibraryEmptyState`.

## Capabilities

### New Capabilities
- `collection-creation`: Fluxo guiado em 3 passos para criação e inicialização de coleções fotográficas com upload/foco de capa, templates de grade e semente demonstrativa.

### Modified Capabilities

## Impact

- Novos endpoints e rotas: `POST /api/collections`, `/collections/create`, `?view=create-collection`.
- Componentes UI: `CollectionCreateWizard.tsx`, `StepEventDetails.tsx`, `StepCoverPicker.tsx`, `StepLayoutPreset.tsx`.
- Dependências: Primitivas existentes (Zod 4, React 18, Tailwind, `withTransaction`).
