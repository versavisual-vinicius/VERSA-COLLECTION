# Tasks: rea-contract-hardening

## 1. Dependências e Infraestrutura DDL

- [x] 1.1 Adicionar biblioteca `zod` em `package.json` e verificar resolução de tipos via `pnpm typecheck`
- [x] 1.2 Atualizar `scripts/seed-collections.sql` com a DDL canônica da tabela `public.favorites` e índices de busca, expurgando DDL em runtime

## 2. Padrão Transacional e Integridade de Banco

- [x] 2.1 Implementar helper `withTransaction<T>` em `api/_lib/db.ts` com gerenciamento estrito de client, `BEGIN`, `COMMIT`, `ROLLBACK` e liberação no `finally`
- [x] 2.2 Criar suíte de testes unitários para `withTransaction` verificando commit atômico e rollback automático em falhas simuladas
- [x] 2.3 Refatorar `api/admin/migrate-local.ts` para envolver atualização de coleções e inserção de requests de exportação em uma transação atômica
- [x] 2.4 Refatorar `api/collections/[slug]/favorites.ts` para remover `ensureFavoritesTable()` e executar merges de favoritos atomicamente

## 3. Contratos Tipados e Validação Fail-Closed com Zod

- [x] 3.1 Criar módulo `api/_lib/contracts.ts` com esquemas Zod estritos para desbloqueio de galeria, export requests, favoritos e admin updates
- [x] 3.2 Integrar validação de esquemas Zod em `api/collections/[slug]/session.ts` e verificar retorno de HTTP 400 estruturado em dados inválidos
- [x] 3.3 Integrar validação de esquemas Zod em `api/export-requests.ts` e `api/admin/collections.ts`
- [x] 3.4 Criar suíte de testes de regressão de contratos em `src/test/Fase13_ReaContracts_Transactions.test.ts`

## 4. Verificação e Sanidade Final

- [x] 4.1 Executar suíte completa de testes (`pnpm test`) garantindo que todos os 95 testes anteriores e os novos testes continuam 100% verdes
- [x] 4.2 Executar `pnpm check` (lint, typecheck, test, build) garantindo zero erros e build limpo de produção
