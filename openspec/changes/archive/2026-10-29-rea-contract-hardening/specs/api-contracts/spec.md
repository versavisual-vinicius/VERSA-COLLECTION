# Spec Delta: api-contracts

## Purpose

Define contratos tipados estritos e validação bidirecional com Zod para todas as rotas públicas e administrativas da API, aplicando política fail-closed.

## ADDED Requirements

### Requirement: Strict Request Validation
O sistema MUST (DEVE) validar o payload de requisição contra esquemas Zod estritos, rejeitando qualquer atributo malformado ou não reconhecido.

#### Scenario: Rejeição de payload com dados inválidos
- **WHEN** uma requisição POST ou PUT for enviada para /api/* com campos obrigatórios ausentes ou tipos inválidos
- **THEN** o sistema responde com status HTTP 400, código INVALID_INPUT e lista de violações estruturadas

#### Scenario: Aceitação de payload válido
- **WHEN** uma requisição for enviada com todos os campos conformes ao esquema Zod
- **THEN** o sistema processa a requisição e retorna os dados esperados com status 200/201

### Requirement: Fail-Closed Endpoint Responses
O sistema MUST (DEVE) retornar respostas tipadas previsíveis sem omitir erros estruturados ou recorrer a fallbacks silenciosos em falhas de validação.

#### Scenario: Tratamento determinístico de erro
- **WHEN** ocorrer falha de validação ou de serviço em qualquer endpoint da API
- **THEN** a resposta contém objeto error com code, message e details padronizados
