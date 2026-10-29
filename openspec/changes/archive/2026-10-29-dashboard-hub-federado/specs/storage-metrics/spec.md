# Spec Delta: storage-metrics

## Purpose

Define a exibição visual e agregação de dados de armazenamento e métricas operacionais no dashboard do fotógrafo.

## ADDED Requirements

### Requirement: Storage Gauge Display
O sistema MUST (DEVE) exibir visualmente o percentual e valores absolutos do consumo de armazenamento em relação à cota total contratada.

#### Scenario: Visualização do gauge de armazenamento
- **WHEN** o fotógrafo carregar a página /dashboard
- **THEN** o sistema exibe o gauge com o volume consumido em gigabytes, o total da cota e a barra de progresso proporcional

### Requirement: Infrastructure Health Overview
O sistema MUST (DEVE) monitorar e indicar o status de conectividade dos serviços de banco de dados, servidor e CDN de mídia.

#### Scenario: Status operacional saudável
- **WHEN** o endpoint de métricas responder com sucesso
- **THEN** o dashboard exibe indicadores visuais verdes confirmando operação normal da infraestrutura
