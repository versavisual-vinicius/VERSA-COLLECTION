# Proposal: rea-contract-hardening

## Why

A auditoria cirúrgica da release 6.8.0 do REA (`morluto/rea`) revelou padrões críticos de robustez: contratos tipados determinísticos com política fail-closed (sem fallbacks silenciosos), transações atômicas com rollback em mutações compostas e ausência de mutações DDL concorrentes em tempo de execução HTTP.
Atualmente, as rotas da API em `api/` do VERSA-COLLECTION validam payloads via checagens manuais dispersas (`if-else` e regexes simples), executam migrações e atualizações em loops sem transações (`BEGIN`/`COMMIT`/`ROLLBACK`) e disparam comandos DDL (`CREATE TABLE IF NOT EXISTS`) sob demanda dentro de handlers de requisição, criando risco de corrupção parcial de dados e contenção de locks no AlloyDB/PostgreSQL.

## What Changes

- **Validação de Entrada e Saída com Zod (Fail-Closed)**:
  - Adicionar biblioteca `zod` e definir esquemas formais e contratos tipados bidirecionais para todos os endpoints da API (`/api/collections`, `/api/collections/[slug]`, `/api/collections/[slug]/session`, `/api/collections/[slug]/favorites`, `/api/export-requests`, `/api/admin/*`).
  - Rejeição imediata de parâmetros inválidos ou desconhecidos com códigos de erro canônicos estruturados (HTTP 400 `INVALID_INPUT`), sem fallbacks silenciosos.
- **Transações Atômicas no PostgreSQL com Rollback Determinístico**:
  - Implementar helper transacional `withTransaction<T>((client) => Promise<T>)` no pool de banco `api/_lib/db.ts`.
  - Envolver migrações em lote (`api/admin/migrate-local.ts`), sincronização/merge de favoritos (`api/collections/[slug]/favorites.ts`) e mutações compostas de coleção dentro de blocos atômicos com rollback em caso de falha.
- **Expurgo de DDL em Tempo de Execução HTTP**:
  - Remover `CREATE TABLE IF NOT EXISTS` do handler HTTP de favoritos (`api/collections/[slug]/favorites.ts`).
  - Formalizar as tabelas `public.favorites` e índices em `scripts/seed-collections.sql` e migrations versionadas.

## Capabilities

### New Capabilities
- `api-contracts`: Validação estrita fail-closed com esquemas Zod para requisições e respostas em todas as rotas da API.
- `database-transactions`: Execução atômica de mutações no PostgreSQL/AlloyDB com rollback garantido e expurgo de DDL em runtime.

### Modified Capabilities
<!-- Nenhuma capacidade existente modificada, pois o projeto não possuía specs formais anteriores no OpenSpec. -->

## Impact

- **Código afetado**: `api/_lib/db.ts`, `api/_lib/http.ts`, `api/_lib/collections.ts`, `api/_lib/adminCollections.ts`, `api/admin/migrate-local.ts`, `api/collections/[slug]/favorites.ts`, `api/collections/[slug]/session.ts`, `api/export-requests.ts`, `scripts/seed-collections.sql`.
- **Dependências**: Adição de `zod` às dependências de produção do `package.json`.
- **Compatibilidade**: Zero quebra externa. Todos os contratos HTTP continuam respondendo com o mesmo formato JSON já consumido pelo frontend e pelos testes da Fase 12.
