# Spec Delta: dashboard-hub

## Purpose

Define a experiência e comportamento do painel central /dashboard para o fotógrafo, organizando produtos, status e atalhos de gestão.

## ADDED Requirements

### Requirement: Central Dashboard Route
O sistema MUST (DEVE) disponibilizar a rota /dashboard exibindo os produtos do ecossistema e navegação de gestão para o fotógrafo.

#### Scenario: Acesso ao dashboard pelo fotógrafo
- **WHEN** o usuário navegar para /dashboard
- **THEN** o sistema renderiza o painel central com os módulos de produtos e ações rápidas

#### Scenario: Redirecionamento e navegação de produto
- **WHEN** o usuário clica no cartão Client Gallery no dashboard
- **THEN** o sistema redireciona o usuário para a página inicial das coleções públicas

### Requirement: Quick Creation Actions
O sistema MUST (DEVE) disponibilizar atalhos de ação rápida para criação e configuração de novas coleções diretamente do dashboard.

#### Scenario: Disparo de criação de coleção
- **WHEN** o usuário clica no botão Nova Coleção no dashboard
- **THEN** o sistema abre a interface de criação e configuração inicial da nova galeria
