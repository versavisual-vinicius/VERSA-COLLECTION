# Design: rea-contract-hardening

## Context

O projeto VERSA-COLLECTION opera com um servidor Node 24 híbrido (`server.mjs`) despachando requisições para handlers em `api/`.
A persistência utiliza o driver `pg` conectado ao AlloyDB/PostgreSQL.
Conforme exposto em `proposal.md`, as validações atuais são pontuais e imperativas, e operações como `migrate-local.ts` e `favorites.ts` operam sem garantias de isolamento transacional ACID ou com mutações DDL em tempo de execução HTTP.

## Goals / Non-Goals

**Goals:**
- Centralizar contratos e validações de requisição/resposta em módulo tipado `api/_lib/contracts.ts` com biblioteca `zod`.
- Implementar utilitário `withTransaction<T>` em `api/_lib/db.ts` garantindo liberação segura do client (`client.release()`) e rollback em qualquer exceção.
- Migrar DDL de criação da tabela `public.favorites` para `scripts/seed-collections.sql`, removendo comandos `CREATE TABLE` do handler HTTP de favoritos.
- Preservar compatibilidade total com os 95 testes automatizados das Fases 2 a 12.

**Non-Goals:**
- Não alterar a interface visual da Galeria, Lightbox ou AdminPanel.
- Não introduzir novos fluxos de produto (Dashboard Hub ou /photos, escopados para as Fases 14 e 15).
- Não alterar provedores de autenticação (permanece scrypt para senhas de galeria e magic link para admin).

## Decisions

### 1. Zod para Schemas e Contratos Tipados
- **Decisão**: Utilizar `zod` para validar inputs de rotas da API e inferir tipos TypeScript diretamente dos esquemas.
- **Alternativas consideradas**:
  - *Ajv*: Rápido, mas verboso para composição de tipos no TypeScript e exige compilação de esquemas JSON Schema.
  - *Validação manual atual*: Frágil, propensa a regressões e sem capacidade de rejeitar atributos espúrios de forma declarativa.
- **Justificativa**: Zod é o padrão canônico do ecossistema moderno TypeScript e do REA 6.8.0, permitindo contratos fail-closed elegantes e parsing determinístico com mensagens de erro estruturadas.

### 2. Padrão Transacional `withTransaction`
- **Decisão**: Criar função de ordem superior `withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T>` em `api/_lib/db.ts`.
- **Alternativas consideradas**:
  - *Gerenciamento manual de BEGIN/COMMIT em cada rota*: Alto risco de conexões presas no pool caso um `client.release()` seja omitido em caminhos de exceção.
  - *ORM pesado (Prisma/TypeORM)*: Desnecessário para o porte do projeto, introduziria sobrecarga de compilação e dependências excessivas.
- **Justificativa**: O wrapper garante execução de `BEGIN`, `COMMIT` ao término bem-sucedido, e `ROLLBACK` + `client.release()` incondicional dentro de bloco `finally`.

### 3. Expurgo de DDL em Handlers HTTP
- **Decisão**: Remover a função `ensureFavoritesTable()` de `api/collections/[slug]/favorites.ts` e documentar a DDL canônica no script SQL de infraestrutura.
- **Justificativa**: Handlers HTTP devem realizar exclusivamente operações DML (Data Manipulation Language). Executar DDL em rotas web viola a separação de responsabilidades e introduz riscos de lock de catálogo e latência indeterminada.

## Risks / Trade-offs

- **[Risco] Rejeição de requisições com dados extras ou formato divergente** → *Mitigação*: Schemas configurados com tolerância necessária em campos opcionais (`.optional()`), mas com tipagem estrita para chaves críticas.
- **[Risco] Conexões órfãs no pool em caso de timeout** → *Mitigação*: Uso estrito de `try-finally` no `withTransaction`, assegurando `client.release()` mesmo se a query falhar ou o cliente cancelar.
