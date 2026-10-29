# Tasks

## 1. Contratos Zod & Backend

- [x] 1.1 Definir `createCollectionSchema` e `createCollectionResponseSchema` em `api/_lib/contracts.ts` e verificar com typecheck.
- [x] 1.2 Implementar handler `api/collections/create.ts` (ou método POST em `api/collections/index.ts`) com transação atômica `withTransaction` e inserção em `public.collections` e `public.photos`.
- [x] 1.3 Implementar função cliente `createCollection` em `src/lib/backend.ts` com suporte a `seedDemoPhotos` e fallback local transparente.

## 2. Componentes do Wizard (UI & Design Editorial)

- [x] 2.1 Criar componente `src/components/CollectionWizard/StepEventDetails.tsx` com título, data, e-mail do cliente e normalização de slug em tempo real.
- [x] 2.2 Criar componente `src/components/CollectionWizard/StepCoverPicker.tsx` com seletor de capa, seletor de ponto focal e preview editorial.
- [x] 2.3 Criar componente `src/components/CollectionWizard/StepLayoutPreset.tsx` com seleção de preset (Masonry/Justified), toggle demonstrativo e resumo da coleção.
- [x] 2.4 Criar componente unificado `src/components/CollectionWizard/CollectionCreateWizard.tsx` com máquina de estados em 3 passos, transições acessíveis e feedback de erro/sucesso.

## 3. Integração SPA & Roteamento

- [x] 3.1 Registrar rota `/collections/create` e parâmetro `?view=create-collection` em `src/App.tsx`.
- [x] 3.2 Atualizar gatilhos "Nova Coleção" em `src/components/Dashboard/ProductHubGrid.tsx`, `DashboardPage.tsx` e `PhotoLibraryEmptyState.tsx` para abrir o assistente.

## 4. Testes Automatizados & Verificação Completa

- [x] 4.1 Criar suíte de testes `src/test/Fase16_CollectionCreationWizard.test.tsx` cobrindo validação de etapas, geração de slug, seleção de capa e criação com acervo demonstrativo.
- [x] 4.2 Executar `pnpm check` garantindo lint limpo, tipos válidos, 100% dos testes verdes no Vitest e build de produção sem erros.
