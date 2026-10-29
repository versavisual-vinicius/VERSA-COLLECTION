# Spec Delta: database-transactions

## Purpose

Assegura atomicidade transacional e rollback determinístico em mutações compostas no PostgreSQL/AlloyDB, eliminando DDL concorrente em tempo de execução HTTP.

## ADDED Requirements

### Requirement: Atomic Mutation Transactions
O sistema MUST (DEVE) executar mutações compostas e migrações em lote dentro de uma transação explícita com BEGIN, COMMIT e ROLLBACK garantido em falhas.

#### Scenario: Rollback automático em caso de erro parcial
- **WHEN** uma operação de mutação composta falhar na inserção ou atualização de qualquer registro filho
- **THEN** o sistema executa ROLLBACK imediato no cliente de banco e nenhum registro parcial é persistido

#### Scenario: Commit atômico em caso de sucesso total
- **WHEN** todas as operações da mutação forem executadas com êxito
- **THEN** o sistema executa COMMIT confirmando todas as alterações simultaneamente

### Requirement: Isolation from Runtime DDL
O sistema MUST (DEVE) executar operações DDL exclusivamente por meio de scripts de migração estruturados fora do ciclo de vida das requisições HTTP.

#### Scenario: Requisição sem execução de DDL
- **WHEN** um endpoint HTTP de favoritos for acionado
- **THEN** nenhuma instrução CREATE TABLE ou ALTER TABLE é enviada ao banco de dados durante o tratamento da requisição
